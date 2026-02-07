'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Copy, Check, AlertCircle, Loader2, Sparkles, History, BookOpen } from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';
import { ModeSelector } from '@/components/correction/ModeSelector';
import { DiffViewer } from '@/components/correction/DiffViewer';
import { StatsDisplay } from '@/components/correction/StatsDisplay';
import { applyChanges } from '@/lib/diff/textDiffer';
import type { CorrectionResponse, CorrectionMode } from '@/lib/types/correction';

const MAX_CHARS = 12000;
const EXAMPLE_TEXT = `Bonjour,

Je voulait vous contacter pour parler de notre projet. J'ai fait des recherches et je pense qu'il serait intéressant de ce rencontrer la semaine prochaine.

Merci pour votre retour.

Cordialement`;

export default function AppPage() {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<CorrectionMode>('standard');
  const [correctionData, setCorrectionData] = useState<CorrectionResponse | null>(null);
  const [acceptedChanges, setAcceptedChanges] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [quota, setQuota] = useState({ remaining: 10, limit: 10 });

  const finalText = useMemo(() => {
    if (!correctionData) return '';
    if (correctionData.changes.length === 0) return correctionData.corrected_text;
    if (acceptedChanges.size === correctionData.changes.length) {
      return correctionData.corrected_text;
    }
    return applyChanges(inputText, correctionData.changes, acceptedChanges);
  }, [correctionData, acceptedChanges, inputText]);

  const handleCorrect = async () => {
    if (!inputText.trim()) {
      setError('Veuillez entrer un texte à corriger');
      return;
    }

    if (inputText.length > MAX_CHARS) {
      setError(`Le texte ne peut pas dépasser ${MAX_CHARS.toLocaleString()} caractères`);
      return;
    }

    setIsLoading(true);
    setError('');
    setCorrectionData(null);
    setAcceptedChanges(new Set());

    try {
      const response = await fetch('/api/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, mode }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error) throw new Error(errorData.error);
        if (response.status === 429) throw new Error('Limite quotidienne atteinte');
        if (response.status === 413) throw new Error('Texte trop long');
        if (response.status === 503) throw new Error('Service temporairement indisponible');
        throw new Error('Erreur lors de la correction');
      }

      const data: CorrectionResponse = await response.json();
      setCorrectionData(data);
      setQuota({ remaining: data.remaining_today, limit: data.limit_today });
      setAcceptedChanges(new Set(data.changes.map(c => c.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(finalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAcceptAll = () => {
    if (correctionData) {
      setAcceptedChanges(new Set(correctionData.changes.map(c => c.id)));
    }
  };

  const handleAcceptChange = (changeId: string) => {
    setAcceptedChanges(prev => {
      const newSet = new Set(prev);
      newSet.add(changeId);
      return newSet;
    });
  };

  const handleRejectChange = (changeId: string) => {
    setAcceptedChanges(prev => {
      const newSet = new Set(prev);
      newSet.delete(changeId);
      return newSet;
    });
  };

  const charCount = inputText.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Correcteur</span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Quota */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {quota.remaining}/{quota.limit}
                </span>
                <span className="text-xs text-gray-500">corrections</span>
              </div>

              {/* Navigation */}
              <Link
                href="/app/history"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors hidden md:flex items-center gap-2"
                title="Historique"
              >
                <History className="w-4 h-4" />
                Historique
              </Link>

              <Link
                href="/app/glossary"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors hidden md:flex items-center gap-2"
                title="Glossaire"
              >
                <BookOpen className="w-4 h-4" />
                Glossaire
              </Link>

              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6 animate-fade-in">
            {/* Mode Selector */}
            <ModeSelector
              selectedMode={mode}
              onModeChange={setMode}
              disabled={isLoading}
            />

            {/* Input Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Texte à corriger</h2>
                <button
                  onClick={() => setInputText(EXAMPLE_TEXT)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Exemple
                </button>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Collez votre email, message ou texte professionnel ici..."
                className="w-full min-h-[200px] p-4 text-[15px] bg-white border-2 border-gray-200 rounded-xl transition-all outline-none resize-vertical focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(91,127,255,0.1)] placeholder:text-gray-400"
                disabled={isLoading}
              />

              {/* Character Count */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${charPercentage > 90 ? 'bg-red-500' :
                        charPercentage > 70 ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}
                      style={{ width: `${Math.min(charPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                <span className={`text-xs font-medium ${charPercentage > 90 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                  {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Correct Button */}
              <button
                onClick={handleCorrect}
                disabled={isLoading || !inputText.trim()}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Correction en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Corriger mon texte
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            {correctionData ? (
              <>
                {/* Stats */}
                <StatsDisplay stats={correctionData.stats} />

                {/* Diff Viewer */}
                {correctionData.changes.length > 0 ? (
                  <DiffViewer
                    originalText={inputText}
                    correctedText={correctionData.corrected_text}
                    changes={correctionData.changes}
                    onAcceptAll={handleAcceptAll}
                    onAcceptChange={handleAcceptChange}
                    onRejectChange={handleRejectChange}
                    acceptedChanges={acceptedChanges}
                  />
                ) : (
                  <div className="card text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucune erreur détectée !
                    </h3>
                    <p className="text-gray-600">
                      Votre texte est parfait, aucune correction nécessaire.
                    </p>
                  </div>
                )}

                {/* Final Text */}
                {finalText && (
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Texte corrigé</h3>
                      <button
                        onClick={handleCopy}
                        className="px-4 py-2 text-sm font-medium bg-white text-gray-700 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            Copié !
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copier
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {finalText}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="card text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Prête à corriger ?
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Collez votre texte à gauche et cliquez sur "Corriger mon texte" pour commencer.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
