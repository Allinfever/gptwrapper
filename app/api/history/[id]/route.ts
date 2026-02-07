import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/history/[id]
 * Récupère une correction spécifique
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const { id } = params;

        // Récupérer la correction
        const { data: correction, error } = await supabase
            .from('corrections')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error || !correction) {
            return NextResponse.json(
                { error: 'Correction non trouvée' },
                { status: 404 }
            );
        }

        return NextResponse.json(correction);

    } catch (error) {
        console.error('[History Detail] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/history/[id]
 * Supprime une correction spécifique
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const { id } = params;

        // Supprimer la correction
        const { error } = await supabase
            .from('corrections')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('[History Detail] Erreur suppression:', error);
            return NextResponse.json(
                { error: 'Erreur lors de la suppression' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[History Detail] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/history/[id]
 * Met à jour le titre ou le type de document
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const { id } = params;
        const body = await request.json();
        const { title, document_type } = body;

        // Préparer les données à mettre à jour
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (document_type !== undefined) updateData.document_type = document_type;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: 'Aucune donnée à mettre à jour' },
                { status: 400 }
            );
        }

        // Mettre à jour
        const { data, error } = await supabase
            .from('corrections')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('[History Detail] Erreur mise à jour:', error);
            return NextResponse.json(
                { error: 'Erreur lors de la mise à jour' },
                { status: 500 }
            );
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('[History Detail] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
