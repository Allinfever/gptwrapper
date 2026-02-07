import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { HistoryItem, HistoryFilters } from '@/lib/types/subscription';

/**
 * GET /api/history
 * Récupère l'historique des corrections de l'utilisateur
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

        // Récupérer les paramètres de requête
        const { searchParams } = new URL(request.url);
        const document_type = searchParams.get('document_type');
        const date_from = searchParams.get('date_from');
        const date_to = searchParams.get('date_to');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        // Récupérer le plan de l'utilisateur
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan, status')
            .eq('user_id', user.id)
            .in('status', ['active', 'trialing'])
            .single();

        const plan = subscription?.plan || 'free';
        const isPro = plan === 'pro' || plan === 'team';

        // Construire la requête
        let query = supabase
            .from('corrections')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        // Filtres
        if (document_type) {
            query = query.eq('document_type', document_type);
        }

        if (date_from) {
            query = query.gte('created_at', date_from);
        }

        if (date_to) {
            query = query.lte('created_at', date_to);
        }

        if (search) {
            query = query.or(`original_text.ilike.%${search}%,corrected_text.ilike.%${search}%,title.ilike.%${search}%`);
        }

        // Limite de 7 jours pour les comptes gratuits
        if (!isPro) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            query = query.gte('created_at', sevenDaysAgo.toISOString());
        }

        // Pagination
        query = query.range(offset, offset + limit - 1);

        const { data: corrections, error, count } = await query;

        if (error) {
            console.error('[History] Erreur:', error);
            return NextResponse.json(
                { error: 'Erreur lors de la récupération de l\'historique' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            items: corrections as HistoryItem[],
            total: count || 0,
            page,
            limit,
            has_more: count ? offset + limit < count : false,
            plan,
            is_pro: isPro,
        });

    } catch (error) {
        console.error('[History] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/history
 * Supprime toutes les corrections de l'utilisateur
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

        // Supprimer toutes les corrections
        const { error } = await supabase
            .from('corrections')
            .delete()
            .eq('user_id', user.id);

        if (error) {
            console.error('[History] Erreur suppression:', error);
            return NextResponse.json(
                { error: 'Erreur lors de la suppression' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[History] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
