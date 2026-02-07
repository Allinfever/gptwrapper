'use client';

import { Zap, CheckCircle2, Shield } from 'lucide-react';
import { CorrectionMode } from '@/lib/types/correction';
import { CORRECTION_MODES } from '@/lib/correction/modes';

interface ModeSelectorProps {
    selectedMode: CorrectionMode;
    onModeChange: (mode: CorrectionMode) => void;
    disabled?: boolean;
}

const ICON_MAP = {
    Zap,
    CheckCircle2,
    Shield,
};

const COLOR_MAP = {
    green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        badge: 'bg-green-100 text-green-700',
        selected: 'border-green-500 bg-green-50/50 shadow-md shadow-green-100',
        hover: 'hover:border-green-300 hover:shadow-sm',
    },
    blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-700',
        selected: 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-100',
        hover: 'hover:border-blue-300 hover:shadow-sm',
    },
    purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-700',
        selected: 'border-purple-500 bg-purple-50/50 shadow-md shadow-purple-100',
        hover: 'hover:border-purple-300 hover:shadow-sm',
    },
};

export function ModeSelector({ selectedMode, onModeChange, disabled = false }: ModeSelectorProps) {
    return (
        <div className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                Mode de correction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.values(CORRECTION_MODES).map((mode) => {
                    const Icon = ICON_MAP[mode.icon as keyof typeof ICON_MAP];
                    const colors = COLOR_MAP[mode.color as keyof typeof COLOR_MAP];
                    const isSelected = selectedMode === mode.id;

                    return (
                        <button
                            key={mode.id}
                            onClick={() => onModeChange(mode.id)}
                            disabled={disabled}
                            className={`
                relative p-4 rounded-xl border-2 transition-all text-left group
                ${isSelected ? colors.selected : `border-gray-200 ${colors.hover}`}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
                        >
                            {/* Badge */}
                            {mode.badge && (
                                <div className="absolute -top-2 -right-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm ${colors.badge}`}>
                                        {mode.badge}
                                    </span>
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex items-start gap-3">
                                {/* Icon */}
                                <div className={`
                  p-2.5 rounded-lg flex-shrink-0 transition-all
                  ${isSelected ? colors.bg : 'bg-gray-100 group-hover:bg-gray-50'}
                `}>
                                    <Icon className={`w-5 h-5 ${isSelected ? colors.text : 'text-gray-600'}`} />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        {mode.label}
                                    </h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {mode.description}
                                    </p>
                                </div>
                            </div>

                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className={`absolute bottom-3 right-3 w-2 h-2 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
