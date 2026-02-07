# Correcteur - Correction Orthographique Professionnelle

> **Corrige tes textes professionnels en français, sans reformulation.**

Correcteur est un outil de correction orthographique et grammaticale qui respecte strictement votre style. Contrairement aux IA génératives, il ne reformule jamais vos messages : il corrige uniquement les erreurs.

## 🎯 Philosophie

**❌ Aucune reformulation**  
**❌ Aucun changement de style**  
**✅ Correction stricte uniquement**

Correcteur se positionne comme une alternative professionnelle et minimaliste aux IA trop intrusives.

---

## ✨ Fonctionnalités

### 🎛️ 3 Modes de Correction

- **Typo uniquement** : Corrections rapides des fautes de frappe
- **Standard** (recommandé) : Orthographe, grammaire, conjugaison, ponctuation
- **Strict** : + Typographie française professionnelle (espaces insécables, guillemets, etc.)

### 🔍 Visualisation Complète des Changements

- **Diff Viewer interactif** : Voir exactement ce qui change
- **Surlignage coloré** par type de correction
- **Explications détaillées** : Comprendre chaque règle appliquée
- **Acceptation granulaire** : Accepter/refuser correction par correction

### 📊 Statistiques de Session

- Nombre de corrections
- Temps de traitement
- Répartition par catégorie (orthographe, grammaire, etc.)

### 🔒 Confidentialité

- Aucun texte stocké (utilisateurs anonymes)
- Transmission sécurisée vers OpenAI API
- Rate limiting basé sur IP (anonymisé)

---

## 🚀 Démarrage Rapide

### Installation

```bash
# Cloner le repo
git clone https://github.com/Allinfever/gptwrapper.git
cd gptwrapper

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local et ajouter votre OPENAI_API_KEY

# Lancer en dev
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Configuration

Créez un fichier `.env.local` avec :

```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

⚠️ **Ne jamais committer les clés API** (`.env.local` est dans `.gitignore`)

---

## 🛠 Stack Technique

- **Framework** : Next.js 16 (App Router)
- **Language** : TypeScript
- **Styling** : TailwindCSS v4
- **AI** : OpenAI API (gpt-4o-mini)
- **Icons** : Lucide React
- **Auth/DB** : Supabase
- **Deployment** : PM2 + Nginx sur VPS

---

## 📦 Build & Déploiement

### Build de production

```bash
npm run build
npm start
```

### Déploiement sur VPS

Voir `README_FULL.md` pour les instructions complètes de déploiement.

---

## 📖 Documentation

- **[Guide Utilisateur](GUIDE_UTILISATEUR.md)** : Comment utiliser Correcteur
- **[Documentation Technique](PHASE1_SPRINT1_COMPLETE.md)** : Architecture et fonctionnalités
- **[Transformation Complète](TRANSFORMATION_COMPLETE.md)** : Récapitulatif du projet

---

## 🎯 Roadmap

### ✅ Phase 1 (Terminée)
- [x] Modes de correction (Typo, Standard, Strict)
- [x] Diff Viewer interactif
- [x] Statistiques de session
- [x] Acceptation granulaire des corrections

### 🚧 Phase 2 (En cours)
- [ ] Historique utilisateur (authentifié)
- [ ] Page de pricing
- [ ] Intégration Stripe

### 🔮 Phase 3 (À venir)
- [ ] Glossaire personnel
- [ ] Explications pédagogiques détaillées
- [ ] Dashboard statistiques
- [ ] Mode Team

---

## 💼 Offres

| Fonctionnalité | Gratuit | Pro (9€/mois) | Team (29€/mois/user) |
|---|---|---|---|
| Corrections/jour | 10 | Illimité | Illimité |
| Modes | Tous | Tous | Tous |
| Historique | 7 jours | Illimité | Illimité |
| Glossaire | 10 termes | Illimité | Partagé |
| Support | Email | Prioritaire | Dédié |

---

## 🧪 Tests

```bash
# Lancer les tests (à venir)
npm test

# Linter
npm run lint
```

---

## 📄 License

© 2026 Letelos. Tous droits réservés.

---

## 📧 Contact

**Questions ? Feedback ?**  
contact@letelos.fr

---

## 🙏 Remerciements

Construit avec ❤️ pour les professionnels qui refusent qu'une IA reformule leurs messages.
