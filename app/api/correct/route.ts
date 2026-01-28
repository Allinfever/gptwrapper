import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { RateLimiter } from '@/lib/rateLimiter';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fallback rate limiter for anonymous users
const rateLimiter = new RateLimiter();

const MAX_CHARS = 12000;
const DAILY_LIMIT_ANONYMOUS = 10;
const DAILY_LIMIT_AUTHENTICATED = 50; // Higher limit for logged-in users

const SYSTEM_PROMPT = `Tu es un correcteur orthographique et grammatical expert en français.

RÈGLES STRICTES :
- Corrige UNIQUEMENT l'orthographe, la grammaire, la conjugaison et la ponctuation
- NE reformule PAS le style, sauf correction minimale nécessaire pour corriger une erreur grammaticale
- N'ajoute AUCUNE information
- Ne mets JAMAIS les mots en gras
- Conserve le ton et le style de l'auteur
- Conserve la structure et la mise en page (sauts de ligne, paragraphes)

FORMAT DE SORTIE (JSON strict):
{
  "corrected_text": "le texte corrigé",
  "rules_applied": ["liste des types de corrections effectuées"]
}

Exemples de règles à mentionner dans rules_applied :
- "Correction d'accords sujet-verbe"
- "Correction de conjugaison"
- "Correction d'accords de participes passés"
- "Correction d'orthographe"
- "Correction de ponctuation"
- "Correction d'accords d'adjectifs"

Ne liste que les types de corrections réellement effectuées, sans détailler chaque mot corrigé.`;

export async function POST(request: NextRequest) {
  try {
    // Vérifier la présence de la clé API
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      );
    }

    // Extraire le texte de la requête
    const body = await request.json();
    const { text } = body;

    // Validation du texte
    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Texte invalide ou vide' },
        { status: 400 }
      );
    }

    if (text.length > MAX_CHARS) {
      return NextResponse.json(
        { error: `Le texte ne peut pas dépasser ${MAX_CHARS} caractères` },
        { status: 413 }
      );
    }

    // Check authentication and rate limiting
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let dailyLimit: number;
    let remaining: number;
    let isAuthenticated = false;

    if (user) {
      // Authenticated user - use Supabase-based quota
      isAuthenticated = true;
      dailyLimit = DAILY_LIMIT_AUTHENTICATED;
      
      // Get remaining corrections from Supabase
      const { data: remainingData } = await supabase
        .rpc('get_remaining_corrections', { 
          p_user_id: user.id, 
          p_daily_limit: dailyLimit 
        });
      
      remaining = remainingData ?? dailyLimit;
      
      if (remaining <= 0) {
        return NextResponse.json(
          { 
            error: 'Limite quotidienne atteinte',
            remaining_today: 0,
            limit_today: dailyLimit
          },
          { status: 429 }
        );
      }
      
      console.log(`[Correction] User: ${user.id.substring(0, 8)}... | Remaining: ${remaining}/${dailyLimit}`);
    } else {
      // Anonymous user - use IP-based rate limiting
      dailyLimit = DAILY_LIMIT_ANONYMOUS;
      const clientId = getClientIdentifier(request);
      const rateLimitCheck = rateLimiter.checkLimit(clientId, dailyLimit);

      if (!rateLimitCheck.allowed) {
        return NextResponse.json(
          { 
            error: 'Limite quotidienne atteinte. Connectez-vous pour obtenir plus de corrections !',
            remaining_today: rateLimitCheck.remaining,
            limit_today: dailyLimit
          },
          { status: 429 }
        );
      }
      
      remaining = rateLimitCheck.remaining;
      console.log(`[Correction] Anonymous: ${clientId.substring(0, 8)}... | Remaining: ${remaining}/${dailyLimit}`);
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Corrige ce texte :\n\n${text}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('Pas de réponse de l\'API');
    }

    // Parser la réponse JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[Correction] Erreur parsing JSON:', responseText);
      throw new Error('Réponse invalide du modèle');
    }

    const { corrected_text, rules_applied } = parsedResponse;

    if (!corrected_text) {
      throw new Error('Format de réponse invalide');
    }

    // Record usage
    if (user) {
      // Authenticated: increment in Supabase
      await supabase.rpc('increment_correction_count', { p_user_id: user.id });
      
      // Optionally save to corrections history
      await supabase.from('corrections').insert({
        user_id: user.id,
        original_text: text,
        corrected_text,
        rules_applied: Array.isArray(rules_applied) ? rules_applied : [],
        char_count: text.length,
      });
    } else {
      // Anonymous: use in-memory rate limiter
      const clientId = getClientIdentifier(request);
      rateLimiter.recordUsage(clientId);
    }

    // Retourner la réponse
    return NextResponse.json({
      corrected_text,
      rules_applied: Array.isArray(rules_applied) ? rules_applied : [],
      remaining_today: remaining - 1,
      limit_today: dailyLimit,
    });

  } catch (error) {
    console.error('[Correction] Erreur:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Erreur de configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la correction. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}

function getClientIdentifier(request: NextRequest): string {
  // Utiliser IP + User-Agent pour identifier de manière anonyme
  const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Hash simple (on pourrait utiliser crypto.subtle.digest pour un vrai hash)
  return `${ip}-${userAgent.substring(0, 50)}`;
}
