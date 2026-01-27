import Link from 'next/link';

export default function LegalPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions Légales</h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-8 space-y-6 prose prose-blue">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Éditeur du site</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Nom</strong> : Correcteur<br />
              <strong>Responsable</strong> : Letelos<br />
              <strong>Email</strong> : <a href="mailto:contact@letelos.fr" className="text-blue-600 hover:underline">contact@letelos.fr</a><br />
              <strong>Site web</strong> : <a href="https://gptwrapper.letelos.fr" className="text-blue-600 hover:underline">gptwrapper.letelos.fr</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Hébergement</h2>
            <p className="text-gray-700 leading-relaxed">
              Ce site est hébergé sur un serveur privé virtuel (VPS).<br />
              <strong>Domaine</strong> : letelos.fr
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Propriété intellectuelle</h2>
            <p className="text-gray-700 leading-relaxed">
              L'ensemble du contenu de ce site (textes, design, logo) est la propriété de Letelos. Toute reproduction ou utilisation sans autorisation est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Conditions d'utilisation</h2>
            <p className="text-gray-700 leading-relaxed">
              Le service Correcteur est fourni "tel quel", sans garantie d'aucune sorte. L'utilisateur est seul responsable de l'utilisation qu'il fait des textes corrigés.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              Nous nous réservons le droit de modifier ou suspendre le service à tout moment sans préavis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Limitation de responsabilité</h2>
            <p className="text-gray-700 leading-relaxed">
              Bien que nous utilisions des technologies avancées pour corriger vos textes, nous ne garantissons pas l'exactitude à 100% des corrections. L'utilisateur reste responsable de la vérification finale de ses textes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Limitation d'usage</h2>
            <p className="text-gray-700 leading-relaxed">
              La version gratuite est limitée à 10 corrections par jour et par utilisateur. Toute tentative de contournement de cette limite peut entraîner le blocage de l'accès au service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Droit applicable</h2>
            <p className="text-gray-700 leading-relaxed">
              Les présentes mentions légales sont régies par le droit français.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question : <a href="mailto:contact@letelos.fr" className="text-blue-600 hover:underline">contact@letelos.fr</a>
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">Dernière mise à jour : 27 janvier 2026</p>
        </div>
      </main>

      <footer className="border-t bg-white py-6 px-4 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>© 2026 Correcteur. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-900 transition">
              Confidentialité
            </Link>
            <Link href="/legal" className="hover:text-gray-900 transition font-semibold">
              Mentions légales
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
