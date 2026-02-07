'use client';

import { CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { CorrectionStats } from '@/lib/types/correction';

interface StatsDisplayProps {
    stats: CorrectionStats;
}

const CATEGORY_LABELS: Record<string, string> = {
    orthographe: 'Orthographe',
    grammaire: 'Grammaire',
    conjugaison: 'Conjugaison',
    ponctuation: 'Ponctuation',
    accord: 'Accords',
    typographie: 'Typographie',
};

const CATEGORY_COLORS: Record<string, string> = {
    orthographe: 'bg-red-100 text-red-700',
    grammaire: 'bg-blue-100 text-blue-700',
    conjugaison: 'bg-purple-100 text-purple-700',
    ponctuation: 'bg-green-100 text-green-700',
    accord: 'bg-orange-100 text-orange-700',
    typographie: 'bg-pink-100 text-pink-700',
};

export function StatsDisplay({ stats }: StatsDisplayProps) {
    const hasChanges = stats.total_changes > 0;

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-5">
            <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Résultat de la correction</h3>
            </div>

            {hasChanges ? (
                <div className="space-y-4">
                    {/* Statistiques principales */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-medium text-gray-600">Corrections</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_changes}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-medium text-gray-600">Temps</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {(stats.processing_time_ms / 1000).toFixed(1)}s
                            </p>
                        </div>
                    </div>

                    {/* Répartition par catégorie */}
                    {Object.keys(stats.by_category).length > 0 && (
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <p className="text-xs font-medium text-gray-600 mb-2">Répartition</p>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(stats.by_category).map(([category, count]) => (
                                    <span
                                        key={category}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {count} {CATEGORY_LABELS[category] || category}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg p-4 border border-blue-100 text-center">
                    <p className="text-green-700 font-medium">✨ Aucune correction nécessaire !</p>
                    <p className="text-sm text-gray-600 mt-1">Votre texte est déjà impeccable.</p>
                </div>
            )}
        </div>
    );
}
