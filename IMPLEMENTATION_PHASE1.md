# 📦 Implémentation Complète - Historique, Glossaire & Pricing

## ✅ Ce Qui a Été Créé

### 1. Base de Données (Supabase)
**Fichier :** `supabase/migrations/20260207_history_glossary.sql`

**Tables créées :**
- `glossary_terms` - Termes protégés par utilisateur
- `subscriptions` - Abonnements Stripe
- Enrichissement de `corrections` (title, document_type, error_count, mode, auto_delete_at)

**RPC Functions :**
- `get_remaining_corrections()` - Quota avec plan
- `get_user_glossary()` - Récupérer le glossaire
- `check_glossary_limit()` - Vérifier les limites
- `cleanup_expired_corrections()` - Nettoyage auto

**Row Level Security :**
- Policies pour glossary_terms
- Policies pour subscriptions

---

### 2. Types TypeScript
**Fichier :** `lib/types/subscription.ts`

**Types créés :**
- `HistoryItem` - Élément d'historique
- `HistoryFilters` - Filtres de recherche
- `HistoryStats` - Statistiques
- `GlossaryTerm` - Terme du glossaire
- `GlossaryLimits` - Limites du glossaire
- `Subscription` - Abonnement
- `PlanFeatures` - Fonctionnalités par plan
- `PricingTier` - Tarif

**Constantes :**
- `PLAN_FEATURES` - Fonctionnalités Free/Pro/Team
- `PRICING_TIERS` - Tarifs pour la page pricing

---

### 3. API Routes

#### Historique
**`app/api/history/route.ts`**
- `GET /api/history` - Liste avec filtres et pagination
- `DELETE /api/history` - Supprimer tout l'historique

**`app/api/history/[id]/route.ts`**
- `GET /api/history/[id]` - Détail d'une correction
- `DELETE /api/history/[id]` - Supprimer une correction
- `PATCH /api/history/[id]` - Mettre à jour (title, document_type)

#### Glossaire
**`app/api/glossary/route.ts`**
- `GET /api/glossary` - Liste des termes + limites
- `POST /api/glossary` - Ajouter un terme (avec vérification limite)
- `DELETE /api/glossary` - Supprimer tous les termes

**`app/api/glossary/[id]/route.ts`**
- `DELETE /api/glossary/[id]` - Supprimer un terme
- `PATCH /api/glossary/[id]` - Modifier un terme

---

## 🔄 Prochaines Étapes

### Étape 1 : Appliquer la Migration SQL
```bash
# Se connecter à Supabase
# Aller dans SQL Editor
# Copier le contenu de supabase/migrations/20260207_history_glossary.sql
# Exécuter
```

### Étape 2 : Modifier l'API de Correction
Il faut intégrer le glossaire dans `/app/api/correct/route.ts` :

```typescript
// Récupérer le glossaire de l'utilisateur
const { data: glossaryData } = await supabase
  .rpc('get_user_glossary', { p_user_id: user.id });

const glossaryTerms = glossaryData?.map(g => g.term) || [];

// Ajouter au prompt
const glossaryPrompt = glossaryTerms.length > 0
  ? `\n\nMots à ne JAMAIS corriger (noms propres, acronymes, jargon) : ${glossaryTerms.join(', ')}`
  : '';

const systemPrompt = modeConfig.promptModifier + glossaryPrompt;
```

Et enrichir l'enregistrement :

```typescript
// Lors de l'enregistrement dans corrections
await supabase.from('corrections').insert({
  user_id: user.id,
  original_text: text,
  corrected_text: parsedResponse.corrected_text,
  mode: mode,
  error_count: changes.length,
  document_type: body.document_type || 'other',
  title: body.title,
});
```

### Étape 3 : Créer les Composants UI

#### Historique
- `components/history/HistoryList.tsx` - Liste des corrections
- `components/history/HistoryFilters.tsx` - Filtres
- `components/history/HistoryCard.tsx` - Carte d'une correction
- `app/history/page.tsx` - Page principale

#### Glossaire
- `components/glossary/GlossaryManager.tsx` - Gestionnaire
- `components/glossary/GlossaryList.tsx` - Liste des termes
- `components/glossary/AddTermForm.tsx` - Formulaire d'ajout
- `app/glossary/page.tsx` - Page principale (ou modal)

#### Pricing
- `app/pricing/page.tsx` - Page de tarification
- `components/pricing/PricingCard.tsx` - Carte de tarif
- `components/pricing/FeatureComparison.tsx` - Tableau comparatif

### Étape 4 : Intégration Stripe
- Créer un compte Stripe
- Ajouter les clés dans `.env.local`
- Créer les webhooks
- Implémenter `/api/stripe/webhook`
- Implémenter `/api/stripe/create-checkout-session`

---

## 📋 Checklist d'Implémentation

### Base de Données
- [ ] Exécuter la migration SQL sur Supabase
- [ ] Vérifier que les tables sont créées
- [ ] Tester les RPC functions

### API
- [x] API Historique (GET, DELETE)
- [x] API Historique détail (GET, DELETE, PATCH)
- [x] API Glossaire (GET, POST, DELETE)
- [x] API Glossaire détail (DELETE, PATCH)
- [ ] Modifier API Correction pour intégrer le glossaire
- [ ] Modifier API Correction pour enrichir l'historique

### UI - Historique
- [ ] Créer la page `/app/history`
- [ ] Composant HistoryList
- [ ] Composant HistoryFilters
- [ ] Composant HistoryCard
- [ ] Pagination
- [ ] Recherche
- [ ] Upsell "Historique illimité en Pro"

### UI - Glossaire
- [ ] Créer la page `/app/glossary` ou modal
- [ ] Composant GlossaryManager
- [ ] Composant AddTermForm
- [ ] Composant GlossaryList
- [ ] Gestion des limites (10 pour Free)
- [ ] Upsell "Glossaire illimité en Pro"

### UI - Pricing
- [ ] Créer la page `/app/pricing`
- [ ] Composant PricingCard
- [ ] Tableau comparatif
- [ ] CTA "Essayer Pro"
- [ ] FAQ

### Stripe
- [ ] Créer compte Stripe
- [ ] Créer produits (Pro, Team)
- [ ] Webhooks
- [ ] API create-checkout-session
- [ ] API webhook
- [ ] Gestion des abonnements

### Tests
- [ ] Tester l'historique (Free : 7 jours, Pro : illimité)
- [ ] Tester le glossaire (Free : 10 termes, Pro : illimité)
- [ ] Tester l'intégration du glossaire dans la correction
- [ ] Tester le pricing
- [ ] Tester le flow Stripe

---

## 🎯 Ordre d'Implémentation Recommandé

### Semaine 1 - Jour 1-2
1. Appliquer la migration SQL
2. Modifier l'API de correction
3. Tester l'intégration du glossaire

### Semaine 1 - Jour 3-4
4. Créer la page Historique
5. Créer les composants Historique
6. Tester l'historique

### Semaine 1 - Jour 5-7
7. Créer la page/modal Glossaire
8. Créer les composants Glossaire
9. Tester le glossaire

### Semaine 2 - Jour 1-3
10. Créer la page Pricing
11. Design des cartes de tarif
12. Tableau comparatif

### Semaine 2 - Jour 4-7
13. Intégration Stripe
14. Webhooks
15. Tests complets

---

## 💡 Notes Importantes

### Glossaire
- Les termes sont **case-insensitive** (UNIQUE sur LOWER(term))
- Limite : 10 pour Free, illimité pour Pro/Team
- Intégré dans le prompt OpenAI

### Historique
- Free : 7 jours
- Pro/Team : illimité
- Possibilité de supprimer manuellement
- Pro : option "auto-delete" configurable

### Pricing
- Free : 50 corrections/jour
- Pro : 9€/mois (illimité)
- Team : 29€/mois/user (+ glossaire partagé)

---

## 🚀 Prochaine Action

**Veux-tu que je :**
1. Modifie l'API de correction pour intégrer le glossaire ?
2. Crée les composants UI pour l'historique ?
3. Crée la page Pricing ?

**Ou préfères-tu que je continue dans l'ordre et fasse tout ?**
