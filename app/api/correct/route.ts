import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { RateLimiter } from '@/lib/rateLimiter';
import { getModeConfig } from '@/lib/correction/modes';
import type { CorrectionMode, Change, Rule, CorrectionStats } from '@/lib/types/correction';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fallback rate limiter for anonymous users
const rateLimiter = new RateLimiter();

const MAX_CHARS = 12000;
const DAILY_LIMIT_ANONYMOUS = 10;
const DAILY_LIMIT_AUTHENTICATED = 50; // Higher limit for logged-in users

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Vérifier la présence de la clé API
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      );
    }

    // Extraire le texte et le mode de la requête
    const body = await request.json();
    const { text, mode = 'standard' } = body as { text: string; mode?: CorrectionMode };

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

      console.log(`[Correction] User: ${user.id.substring(0, 8)}... | Mode: ${mode} | Remaining: ${remaining}/${dailyLimit}`);
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
      console.log(`[Correction] Anonymous: ${clientId.substring(0, 8)}... | Mode: ${mode} | Remaining: ${remaining}/${dailyLimit}`);
    }

    // Obtenir la configuration du mode
    const modeConfig = getModeConfig(mode);

    // Appel à OpenAI avec le prompt du mode sélectionné
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: modeConfig.promptModifier },
          { role: 'user', content: `Corrige ce texte :\n\n${text}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });
    } catch (openaiError: any) {
      console.error('[Correction] Erreur OpenAI:', openaiError);

      // Gestion spécifique des erreurs OpenAI
      if (openaiError.status === 429) {
        if (openaiError.code === 'billing_not_active') {
          return NextResponse.json(
            {
              error: 'Le compte OpenAI n\'est pas actif. Veuillez vérifier vos informations de facturation sur platform.openai.com',
              code: 'OPENAI_BILLING_ERROR'
            },
            { status: 503 }
          );
        }
        return NextResponse.json(
          {
            error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.',
            code: 'RATE_LIMIT_ERROR'
          },
          { status: 429 }
        );
      }

      if (openaiError.status === 401) {
        return NextResponse.json(
          {
            error: 'Clé API OpenAI invalide. Veuillez contacter l\'administrateur.',
            code: 'OPENAI_AUTH_ERROR'
          },
          { status: 503 }
        );
      }

      // Erreur générique
      return NextResponse.json(
        {
          error: 'Erreur lors de l\'appel à l\'API de correction. Veuillez réessayer.',
          code: 'OPENAI_ERROR'
        },
        { status: 500 }
      );
    }

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('Pas de réponse de l\'API');
    }

    // Parser la réponse JSON
    let parsedResponse: {
      corrected_text: string;
      changes?: Change[];
      rules_applied?: Rule[];
    };

    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[Correction] Erreur parsing JSON:', responseText);
      throw new Error('Réponse invalide du modèle');
    }

    const { corrected_text, changes = [], rules_applied = [] } = parsedResponse;

    if (!corrected_text) {
      throw new Error('Format de réponse invalide');
    }

    // Calculer les statistiques
    const processingTime = Date.now() - startTime;
    const stats: CorrectionStats = {
      total_changes: changes.length,
      by_category: changes.reduce((acc, change) => {
        acc[change.type] = (acc[change.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      processing_time_ms: processingTime
    };

    // Record usage
    if (user) {
      // Authenticated: increment in Supabase
      await supabase.rpc('increment_correction_count', { p_user_id: user.id });

      // Optionally save to corrections history
      await supabase.from('corrections').insert({
        user_id: user.id,
        original_text: text,
        corrected_text,
        rules_applied: rules_applied,
        char_count: text.length,
      });
    } else {
      // Anonymous: use in-memory rate limiter
      const clientId = getClientIdentifier(request);
      rateLimiter.recordUsage(clientId);
    }

    // Retourner la réponse enrichie
    return NextResponse.json({
      corrected_text,
      changes,
      rules_applied,
      stats,
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
