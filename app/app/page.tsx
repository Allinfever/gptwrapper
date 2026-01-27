'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, AlertCircle, Loader2 } from 'lucide-react';

const MAX_CHARS = 12000;
const EXAMPLE_TEXT = `Bonjour,

Je voulait vous contacter pour parler de notre projet. J'ai fait des recherches et je pense qu'il serait intéressant de ce rencontrer la semaine prochaine.

Merci pour votre retour.

Cordialement`;

interface CorrectionResponse {
  corrected_text: string;
  rules_applied: string[];
  remaining_today: number;
  limit_today: number;
}

export default function AppPage() {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [rulesApplied, setRulesApplied] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [quota, setQuota] = useState({ remaining: 10, limit: 10 });

  const handleCorrect = async () => {
    if (!inputText.trim()) {
      setError('Veuillez entrer un texte à corriger');
      return;
    }

    if (inputText.length > MAX_CHARS) {
      setError(`Le texte ne peut pas dépasser ${MAX_CHARS} caractères`);
      return;
    }

    setIsLoading(true);
    setError('');
    setCorrectedText('');
    setRulesApplied([]);

    try {
      const response = await fetch('/api/correct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Limite quotidienne atteinte. Revenez demain !');
        }
        if (response.status === 413) {
          throw new Error('Texte trop long');
        }
        throw new Error('Erreur lors de la correction');
      }

      const data: CorrectionResponse = await response.json();
      setCorrectedText(data.corrected_text);
      setRulesApplied(data.rules_applied);
      setQuota({ remaining: data.remaining_today, limit: data.limit_today });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (correctedText) {
      await navigator.clipboard.writeText(correctedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const charCount = inputText.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition">
            Correcteur
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {quota.remaining}/{quota.limit} corrections aujourd'hui
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Texte à corriger</h2>
                <button
                  onClick={() => setInputText(EXAMPLE_TEXT)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Exemple
                </button>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Collez ici votre email, message ou texte professionnel..."
                className="w-full h-96 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} caractères
                </div>
                <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${charPercentage > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(charPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleCorrect}
              disabled={isLoading || !inputText.trim() || quota.remaining === 0}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Correction en cours...
                </>
              ) : (
                'Corriger mon texte'
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {correctedText && (
              <>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">Texte corrigé</h2>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copier
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-96 whitespace-pre-wrap font-serif text-gray-900 leading-relaxed">
                    {correctedText}
                  </div>
                </div>

                {rulesApplied.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Règles appliquées</h3>
                    <ul className="space-y-2">
                      {rulesApplied.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {!correctedText && !error && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-400">
                <p>Le texte corrigé apparaîtra ici...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>© 2026 Correcteur. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-900 transition">
              Confidentialité
            </Link>
            <Link href="/legal" className="hover:text-gray-900 transition">
              Mentions légales
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
