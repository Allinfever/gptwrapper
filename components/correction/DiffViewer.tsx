'use client';

import { useState } from 'react';
import { Info, Check, X } from 'lucide-react';
import { Change, CorrectionCategory } from '@/lib/types/correction';

interface DiffViewerProps {
    originalText: string;
    correctedText: string;
    changes: Change[];
    onAcceptAll: () => void;
    onAcceptChange: (changeId: string) => void;
    onRejectChange: (changeId: string) => void;
    acceptedChanges: Set<string>;
}

const CATEGORY_COLORS: Record<CorrectionCategory, string> = {
    orthographe: 'bg-red-100 border-red-300 text-red-900',
    grammaire: 'bg-blue-100 border-blue-300 text-blue-900',
    conjugaison: 'bg-purple-100 border-purple-300 text-purple-900',
    ponctuation: 'bg-green-100 border-green-300 text-green-900',
    accord: 'bg-orange-100 border-orange-300 text-orange-900',
    typographie: 'bg-pink-100 border-pink-300 text-pink-900',
};

export function DiffViewer({
    originalText,
    correctedText,
    changes,
    onAcceptAll,
    onAcceptChange,
    onRejectChange,
    acceptedChanges,
}: DiffViewerProps) {
    const [hoveredChange, setHoveredChange] = useState<string | null>(null);
    const [selectedChange, setSelectedChange] = useState<string | null>(null);

    if (changes.length === 0) {
        return (
            <div className="bg-white rounded-lg border p-6 text-center">
                <p className="text-gray-600">Aucune correction détectée</p>
            </div>
        );
    }

    // Construire le texte avec les highlights
    const renderTextWithHighlights = () => {
        const segments: React.ReactElement[] = [];
        let lastIndex = 0;

        // Trier les changements par position
        const sortedChanges = [...changes].sort((a, b) => a.position.start - b.position.start);

        sortedChanges.forEach((change, idx) => {
            // Texte avant le changement
            if (change.position.start > lastIndex) {
                segments.push(
                    <span key={`text-${idx}`} className="text-gray-900">
                        {originalText.substring(lastIndex, change.position.start)}
                    </span>
                );
            }

            // Le changement lui-même
            const isAccepted = acceptedChanges.has(change.id);
            const isHovered = hoveredChange === change.id;
            const isSelected = selectedChange === change.id;
            const colorClass = CATEGORY_COLORS[change.type];

            segments.push(
                <span
                    key={`change-${change.id}`}
                    className={`
            relative inline-block px-1 rounded border-b-2 cursor-pointer transition-all
            ${colorClass}
            ${isHovered || isSelected ? 'shadow-md scale-105' : ''}
            ${isAccepted ? 'opacity-50 line-through' : ''}
          `}
                    onMouseEnter={() => setHoveredChange(change.id)}
                    onMouseLeave={() => setHoveredChange(null)}
                    onClick={() => setSelectedChange(selectedChange === change.id ? null : change.id)}
                >
                    {change.original}
                    {(isHovered || isSelected) && (
                        <span className="absolute left-0 right-0 -bottom-6 text-xs font-medium whitespace-nowrap">
                            → {change.corrected}
                        </span>
                    )}
                </span>
            );

            lastIndex = change.position.end;
        });

        // Texte après le dernier changement
        if (lastIndex < originalText.length) {
            segments.push(
                <span key="text-end" className="text-gray-900">
                    {originalText.substring(lastIndex)}
                </span>
            );
        }

        return segments;
    };

    const pendingChanges = changes.filter(c => !acceptedChanges.has(c.id));

    return (
        <div className="space-y-4">
            {/* En-tête avec actions */}
            <div className="flex items-center justify-between bg-white rounded-lg border p-4">
                <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">
                        {pendingChanges.length} correction{pendingChanges.length > 1 ? 's' : ''} proposée{pendingChanges.length > 1 ? 's' : ''}
                    </span>
                </div>
                <button
                    onClick={onAcceptAll}
                    disabled={pendingChanges.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                >
                    Tout accepter
                </button>
            </div>

            {/* Texte avec highlights */}
            <div className="bg-white rounded-lg border p-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                    Survolez ou cliquez sur les mots surlignés pour voir les corrections
                </p>
                <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap font-serif text-base leading-relaxed">
                        {renderTextWithHighlights()}
                    </div>
                </div>
            </div>

            {/* Liste des changements */}
            <div className="bg-white rounded-lg border divide-y">
                <div className="p-4 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Détail des corrections</h3>
                </div>
                <div className="divide-y max-h-96 overflow-y-auto">
                    {changes.map((change) => {
                        const isAccepted = acceptedChanges.has(change.id);
                        const colorClass = CATEGORY_COLORS[change.type];

                        return (
                            <div
                                key={change.id}
                                className={`p-4 hover:bg-gray-50 transition ${isAccepted ? 'opacity-50' : ''}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorClass}`}>
                                                {change.type}
                                            </span>
                                            {change.confidence === 'medium' && (
                                                <span className="text-xs text-gray-500">(à vérifier)</span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-500 line-through">{change.original}</span>
                                                <span className="text-gray-400">→</span>
                                                <span className="text-green-700 font-medium">{change.corrected}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{change.explanation}</p>
                                            <p className="text-xs text-gray-500 italic">{change.rule}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!isAccepted ? (
                                            <>
                                                <button
                                                    onClick={() => onAcceptChange(change.id)}
                                                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                                                    title="Accepter"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onRejectChange(change.id)}
                                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                                    title="Refuser"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-green-600 font-medium">✓ Acceptée</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
