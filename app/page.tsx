import Link from 'next/link';
import { CheckCircle2, Copy, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Correcteur</h1>
          <Link 
            href="/app" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Essayer maintenant
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Corrige tes emails et textes pros en français,<br />
            <span className="text-blue-600">sans te prendre la tête.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Correction orthographique et grammaticale rapide. Pas de reformulation, juste ce qu'il faut pour être sûr·e de ton texte.
          </p>
          <Link 
            href="/app" 
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold shadow-lg hover:shadow-xl"
          >
            Essayer gratuitement
          </Link>
          <p className="mt-4 text-sm text-gray-500">10 corrections par jour gratuites</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Pourquoi Correcteur ?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900">Confiance</h4>
              <p className="text-gray-600">
                Envoie tes messages pros sans douter. Orthographe et grammaire impeccables en un clic.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900">Rapidité</h4>
              <p className="text-gray-600">
                Colle ton texte, clique sur "Corriger", c'est fait. Pas de chargement interminable.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <Copy className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900">Ton pro</h4>
              <p className="text-gray-600">
                On corrige uniquement les erreurs. Ton style, ton message, c'est le tien. Aucune reformulation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Comment ça marche ?</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1 text-gray-900">Colle ton texte</h4>
                <p className="text-gray-600">Email, rapport, message LinkedIn... n'importe quel texte en français.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1 text-gray-900">Clique sur Corriger</h4>
                <p className="text-gray-600">L'outil analyse et corrige orthographe, grammaire et ponctuation.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1 text-gray-900">Copie et utilise</h4>
                <p className="text-gray-600">Récupère ton texte corrigé et les règles appliquées. C'est prêt !</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026 Correcteur. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm hover:text-white transition">
                Confidentialité
              </Link>
              <Link href="/legal" className="text-sm hover:text-white transition">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
