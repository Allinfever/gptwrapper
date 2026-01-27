import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition">
            Correcteur
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-8 space-y-6 prose prose-blue">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Collecte de données</h2>
            <p className="text-gray-700 leading-relaxed">
              Correcteur est conçu avec le respect de votre vie privée comme priorité. Nous collectons le strict minimum de données nécessaires au fonctionnement du service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Données que nous NE stockons PAS</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Vos textes</strong> : Le contenu que vous soumettez pour correction n'est jamais enregistré ou conservé après traitement.</li>
              <li><strong>Compte utilisateur</strong> : Aucun compte, email, ou information personnelle n'est requis.</li>
              <li><strong>Historique</strong> : Nous ne gardons aucune trace de vos corrections passées.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Données techniques collectées</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Compteur d'utilisation</strong> : Pour appliquer la limite de 10 corrections par jour, nous stockons temporairement un compteur anonyme basé sur votre adresse IP et votre navigateur. Ces données sont supprimées automatiquement chaque jour.</li>
              <li><strong>Logs serveur</strong> : Des logs techniques minimaux (horodatage, erreurs) sont conservés temporairement pour le bon fonctionnement du service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Partage avec des tiers</h2>
            <p className="text-gray-700 leading-relaxed">
              Vos textes sont envoyés à l'API OpenAI pour traitement. OpenAI indique ne pas utiliser les données envoyées via son API pour entraîner ses modèles (voir <a href="https://openai.com/enterprise-privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">politique d'OpenAI</a>).
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              Nous ne partageons vos données avec aucun autre tiers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Ce site n'utilise pas de cookies de suivi ou de publicité.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Vos droits</h2>
            <p className="text-gray-700 leading-relaxed">
              Étant donné que nous ne stockons pas de données personnelles identifiables, il n'y a pas de données à consulter, modifier ou supprimer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question concernant cette politique de confidentialité : <a href="mailto:contact@letelos.fr" className="text-blue-600 hover:underline">contact@letelos.fr</a>
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">Dernière mise à jour : 27 janvier 2026</p>
        </div>
      </main>

      <footer className="border-t bg-white py-6 px-4 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>© 2026 Correcteur. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-900 transition font-semibold">
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
