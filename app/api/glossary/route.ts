import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { GlossaryTerm, AddGlossaryTermRequest } from '@/lib/types/subscription';

/**
 * GET /api/glossary
 * Récupère le glossaire de l'utilisateur
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Vérifier l'authentification
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        // Récupérer le glossaire
        const { data: terms, error } = await supabase
            .from('glossary_terms')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('[Glossary] Erreur:', error);
            return NextResponse.json(
                { error: 'Erreur lors de la récupération du glossaire' },
                { status: 500 }
            );
        }

        // Vérifier les limites
        const { data: limitData } = await supabase
            .rpc('check_glossary_limit', { p_user_id: user.id });

        const limits = limitData?.[0] || { count: 0, limit_reached: false, plan: 'free' };

        return NextResponse.json({
            terms: terms as GlossaryTerm[],
            count: terms?.length || 0,
            limit: limits.plan === 'free' ? 10 : 999999,
            limit_reached: limits.limit_reached,
            plan: limits.plan,
        });

    } catch (error) {
        console.error('[Glossary] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/glossary
 * Ajoute un terme au glossaire
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Vérifier l'authentification
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const body: AddGlossaryTermRequest = await request.json();
        const { term, category = 'other' } = body;

        // Validation
        if (!term || term.trim().length === 0) {
            return NextResponse.json(
                { error: 'Le terme ne peut pas être vide' },
                { status: 400 }
            );
        }

        if (term.length > 100) {
            return NextResponse.json(
                { error: 'Le terme ne peut pas dépasser 100 caractères' },
                { status: 400 }
            );
        }

        // Vérifier les limites
        const { data: limitData } = await supabase
            .rpc('check_glossary_limit', { p_user_id: user.id });

        const limits = limitData?.[0];

        if (limits?.limit_reached) {
            return NextResponse.json(
                {
                    error: 'Limite de glossaire atteinte',
                    code: 'GLOSSARY_LIMIT_REACHED',
                    limit: limits.plan === 'free' ? 10 : 999999,
                    plan: limits.plan,
                },
                { status: 403 }
            );
        }

        // Ajouter le terme
        const { data: newTerm, error } = await supabase
            .from('glossary_terms')
            .insert({
                user_id: user.id,
                term: term.trim(),
                category,
            })
            .select()
            .single();

        if (error) {
            // Gestion de l'erreur de doublon
            if (error.code === '23505') { // Unique violation
                return NextResponse.json(
                    { error: 'Ce terme existe déjà dans votre glossaire' },
                    { status: 409 }
                );
            }

            console.error('[Glossary] Erreur ajout:', error);
            return NextResponse.json(
                { error: 'Erreur lors de l\'ajout du terme' },
                { status: 500 }
            );
        }

        return NextResponse.json(newTerm, { status: 201 });

    } catch (error) {
        console.error('[Glossary] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/glossary
 * Supprime tous les termes du glossaire
 */
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Vérifier l'authentification
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        // Supprimer tous les termes
        const { error } = await supabase
            .from('glossary_terms')
            .delete()
            .eq('user_id', user.id);

        if (error) {
            console.error('[Glossary] Erreur suppression:', error);
            return NextResponse.json(
                { error: 'Erreur lors de la suppression' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[Glossary] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
