import type { CorrectionResponse } from '@/lib/types/correction';

/**
 * Réponse de démo pour tester l'interface sans appeler l'API OpenAI
 * Utilisé quand OPENAI_API_KEY n'est pas configurée ou le compte n'est pas actif
 */
export const DEMO_CORRECTION_RESPONSE: CorrectionResponse = {
    corrected_text: `Bonjour,

Je voulais vous contacter pour parler de notre projet. J'ai fait des recherches et je pense qu'il serait intéressant de se rencontrer la semaine prochaine.

Merci pour votre retour.

Cordialement`,
    changes: [
        {
            id: 'change-1',
            type: 'conjugaison',
            original: 'voulait',
            corrected: 'voulais',
            position: { start: 13, end: 20 },
            rule: 'Conjugaison à l\'imparfait',
            explanation: 'Le verbe "vouloir" doit être conjugué à la première personne du singulier à l\'imparfait : "je voulais"',
            confidence: 'high'
        },
        {
            id: 'change-2',
            type: 'grammaire',
            original: 'ce rencontrer',
            corrected: 'se rencontrer',
            position: { start: 125, end: 138 },
            rule: 'Pronom réfléchi',
            explanation: 'Le verbe pronominal "se rencontrer" nécessite le pronom réfléchi "se" et non "ce"',
            confidence: 'high'
        }
    ],
    rules_applied: [
        {
            id: 'rule-1',
            category: 'conjugaison',
            title: 'Conjugaison à l\'imparfait',
            shortDescription: 'Accord du verbe avec le sujet à l\'imparfait'
        },
        {
            id: 'rule-2',
            category: 'grammaire',
            title: 'Pronom réfléchi',
            shortDescription: 'Utilisation correcte des pronoms réfléchis'
        }
    ],
    stats: {
        total_changes: 2,
        by_category: {
            conjugaison: 1,
            grammaire: 1
        },
        processing_time_ms: 1200
    },
    remaining_today: 9,
    limit_today: 10
};

/**
 * Vérifie si le mode démo doit être activé
 */
export function shouldUseDemoMode(): boolean {
    // Mode démo si pas de clé API
    if (!process.env.OPENAI_API_KEY) {
        return true;
    }

    // Mode démo si variable d'environnement DEMO_MODE est activée
    if (process.env.DEMO_MODE === 'true') {
        return true;
    }

    return false;
}
