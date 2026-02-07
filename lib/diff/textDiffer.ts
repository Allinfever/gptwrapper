import { Change } from '../types/correction';

/**
 * Algorithme de diff simple pour détecter les changements entre deux textes
 * Utilisé comme fallback si l'API ne renvoie pas les positions exactes
 */

interface DiffSegment {
    type: 'unchanged' | 'deleted' | 'inserted';
    text: string;
    position: number;
}

export function computeTextDiff(original: string, corrected: string): DiffSegment[] {
    const segments: DiffSegment[] = [];

    // Algorithme simple basé sur les mots
    const originalWords = original.split(/(\s+)/);
    const correctedWords = corrected.split(/(\s+)/);

    let origIndex = 0;
    let corrIndex = 0;
    let position = 0;

    while (origIndex < originalWords.length || corrIndex < correctedWords.length) {
        if (origIndex >= originalWords.length) {
            // Mots ajoutés à la fin
            segments.push({
                type: 'inserted',
                text: correctedWords[corrIndex],
                position
            });
            position += correctedWords[corrIndex].length;
            corrIndex++;
        } else if (corrIndex >= correctedWords.length) {
            // Mots supprimés à la fin
            segments.push({
                type: 'deleted',
                text: originalWords[origIndex],
                position
            });
            position += originalWords[origIndex].length;
            origIndex++;
        } else if (originalWords[origIndex] === correctedWords[corrIndex]) {
            // Mots identiques
            segments.push({
                type: 'unchanged',
                text: originalWords[origIndex],
                position
            });
            position += originalWords[origIndex].length;
            origIndex++;
            corrIndex++;
        } else {
            // Mots différents - détection simple
            segments.push({
                type: 'deleted',
                text: originalWords[origIndex],
                position
            });
            segments.push({
                type: 'inserted',
                text: correctedWords[corrIndex],
                position
            });
            position += Math.max(originalWords[origIndex].length, correctedWords[corrIndex].length);
            origIndex++;
            corrIndex++;
        }
    }

    return segments;
}

/**
 * Applique les changements acceptés au texte original
 */
export function applyChanges(originalText: string, changes: Change[], acceptedIds: Set<string>): string {
    // Trier les changements par position (du plus loin au plus proche pour éviter les décalages)
    const sortedChanges = [...changes]
        .filter(change => acceptedIds.has(change.id))
        .sort((a, b) => b.position.start - a.position.start);

    let result = originalText;

    for (const change of sortedChanges) {
        const before = result.substring(0, change.position.start);
        const after = result.substring(change.position.end);
        result = before + change.corrected + after;
    }

    return result;
}

/**
 * Génère un ID unique pour un changement
 */
export function generateChangeId(change: Omit<Change, 'id'>): string {
    return `${change.position.start}-${change.position.end}-${change.type}`;
}
