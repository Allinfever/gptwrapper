import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * DELETE /api/glossary/[id]
 * Supprime un terme spécifique du glossaire
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

        // Supprimer le terme
        const { error } = await supabase
            .from('glossary_terms')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('[Glossary Term] Erreur suppression:', error);
            return NextResponse.json(
                { error: 'Erreur lors de la suppression' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[Glossary Term] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/glossary/[id]
 * Met à jour un terme du glossaire
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
        const { term, category } = body;

        // Préparer les données à mettre à jour
        const updateData: any = {};
        if (term !== undefined) {
            if (term.trim().length === 0) {
                return NextResponse.json(
                    { error: 'Le terme ne peut pas être vide' },
                    { status: 400 }
                );
            }
            updateData.term = term.trim();
        }
        if (category !== undefined) updateData.category = category;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: 'Aucune donnée à mettre à jour' },
                { status: 400 }
            );
        }

        // Mettre à jour
        const { data, error } = await supabase
            .from('glossary_terms')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            // Gestion de l'erreur de doublon
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: 'Ce terme existe déjà dans votre glossaire' },
                    { status: 409 }
                );
            }

            console.error('[Glossary Term] Erreur mise à jour:', error);
            return NextResponse.json(
                { error: 'Erreur lors de la mise à jour' },
                { status: 500 }
            );
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('[Glossary Term] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
