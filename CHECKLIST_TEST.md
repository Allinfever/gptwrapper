# ✅ Checklist de Test - Correcteur

## 🎯 Objectif
Vérifier que toutes les fonctionnalités de la Phase 1 fonctionnent correctement.

---

## 📋 Tests à Effectuer

### 1. Démarrage de l'Application

- [ ] Le serveur démarre sans erreur (`npm run dev`)
- [ ] L'application est accessible sur `http://localhost:3000`
- [ ] La landing page s'affiche correctement
- [ ] Le bouton "Essayer maintenant" redirige vers `/app`

---

### 2. Interface Principale (`/app`)

#### Header
- [ ] Le logo "Correcteur" s'affiche
- [ ] Le quota s'affiche (format : "X/10 corrections aujourd'hui")
- [ ] Le menu utilisateur est présent

#### Mode Selector
- [ ] Les 3 modes s'affichent (Typo uniquement, Standard, Strict)
- [ ] Chaque mode a son icône
- [ ] Chaque mode a son badge (Rapide, Recommandé, Pro)
- [ ] Le mode Standard est sélectionné par défaut (bordure bleue)
- [ ] Cliquer sur un mode le sélectionne (bordure bleue + point bleu)

#### Zone de Texte
- [ ] Le placeholder s'affiche
- [ ] On peut taper du texte
- [ ] Le compteur de caractères se met à jour
- [ ] La barre de progression se remplit
- [ ] La barre devient rouge après 90% (10 800 caractères)
- [ ] Le bouton "Exemple" charge le texte d'exemple

#### Bouton de Correction
- [ ] Le bouton est actif quand il y a du texte
- [ ] Le bouton est désactivé si le texte est vide
- [ ] Le bouton est désactivé si le quota est à 0
- [ ] Cliquer affiche "Correction en cours..." avec spinner

---

### 3. Processus de Correction

#### Appel API
- [ ] La requête est envoyée à `/api/correct`
- [ ] Le mode sélectionné est inclus dans la requête
- [ ] La réponse arrive en 1-3 secondes

#### Gestion d'Erreurs
- [ ] Si le texte est trop long (>12 000 caractères) : message d'erreur
- [ ] Si la limite quotidienne est atteinte : message d'erreur
- [ ] Si l'API échoue : message d'erreur générique

---

### 4. Affichage des Résultats

#### Statistiques (StatsDisplay)
- [ ] La carte des statistiques s'affiche
- [ ] Le nombre de corrections est correct
- [ ] Le temps de traitement s'affiche (format : X.Xs)
- [ ] La répartition par catégorie s'affiche avec badges colorés
- [ ] Si aucune correction : message "Aucune correction nécessaire !"

#### Diff Viewer
- [ ] Le header affiche "X corrections proposées"
- [ ] Le bouton "Tout accepter" est présent
- [ ] Le texte original s'affiche avec les mots surlignés
- [ ] Les couleurs correspondent aux types :
  - [ ] Rouge = Orthographe
  - [ ] Bleu = Grammaire
  - [ ] Violet = Conjugaison
  - [ ] Vert = Ponctuation
  - [ ] Orange = Accords
  - [ ] Rose = Typographie

#### Interactions Diff Viewer
- [ ] Survoler un mot surligné affiche la correction en dessous
- [ ] Cliquer sur un mot fige l'affichage de la correction
- [ ] Cliquer à nouveau retire l'affichage

#### Liste Détaillée
- [ ] Chaque correction a un badge coloré
- [ ] Le format "original → corrigé" s'affiche
- [ ] L'explication est présente
- [ ] Le nom de la règle s'affiche
- [ ] Les boutons Accepter (✓) et Refuser (✗) sont présents
- [ ] Si confiance = "medium" : mention "(à vérifier)"

---

### 5. Acceptation/Refus des Corrections

#### Acceptation Individuelle
- [ ] Cliquer sur ✓ accepte la correction
- [ ] La correction passe en état "Acceptée" (texte vert)
- [ ] Les boutons disparaissent
- [ ] Le texte final se met à jour immédiatement

#### Refus Individuel
- [ ] Cliquer sur ✗ refuse la correction
- [ ] La correction est retirée de la liste des acceptées
- [ ] Le texte final se met à jour immédiatement

#### Tout Accepter
- [ ] Cliquer sur "Tout accepter" accepte toutes les corrections
- [ ] Toutes les corrections passent en état "Acceptée"
- [ ] Le texte final = texte corrigé complet

#### Calcul du Texte Final
- [ ] Le texte final reflète uniquement les corrections acceptées
- [ ] Si toutes acceptées : texte final = texte corrigé
- [ ] Si aucune acceptée : texte final = texte original
- [ ] Si partiellement acceptées : mix correct

---

### 6. Texte Final

#### Affichage
- [ ] Le texte final s'affiche dans la zone dédiée
- [ ] Le formatage est préservé (sauts de ligne, etc.)
- [ ] La police est lisible (font-serif)

#### Copie
- [ ] Le bouton "Copier" est présent
- [ ] Cliquer copie le texte dans le presse-papiers
- [ ] Le bouton affiche "Copié !" en vert pendant 2 secondes
- [ ] L'icône change (Copy → Check)
- [ ] Coller dans un éditeur de texte fonctionne

---

### 7. Tests des Modes

#### Mode "Typo uniquement"
- [ ] Sélectionner le mode
- [ ] Corriger un texte avec fautes de frappe ET erreurs grammaticales
- [ ] Vérifier que seules les fautes de frappe sont corrigées
- [ ] Les erreurs grammaticales complexes sont ignorées

#### Mode "Standard"
- [ ] Sélectionner le mode
- [ ] Corriger un texte avec diverses erreurs
- [ ] Vérifier que orthographe + grammaire + conjugaison sont corrigées
- [ ] La typographie française stricte n'est pas appliquée

#### Mode "Strict"
- [ ] Sélectionner le mode
- [ ] Corriger un texte avec guillemets droits " "
- [ ] Vérifier que les guillemets français « » sont appliqués
- [ ] Vérifier les espaces insécables (avant : ; ! ?)
- [ ] Vérifier les majuscules accentuées (À, É, etc.)

---

### 8. Quota et Rate Limiting

#### Utilisateur Anonyme
- [ ] Le quota initial est 10/10
- [ ] Après une correction : 9/10
- [ ] Après 10 corrections : 0/10
- [ ] Le bouton de correction est désactivé à 0/10
- [ ] Message d'erreur : "Limite quotidienne atteinte"

#### Utilisateur Connecté (si implémenté)
- [ ] Le quota initial est 50/50
- [ ] Le quota se décrémente correctement
- [ ] Les corrections sont sauvegardées en DB

---

### 9. Responsive Design

#### Desktop (>1024px)
- [ ] Layout en 2 colonnes (input | output)
- [ ] Mode selector en 3 colonnes
- [ ] Tout est lisible et espacé

#### Tablet (768-1024px)
- [ ] Layout en 2 colonnes
- [ ] Mode selector en 3 colonnes (peut être serré)
- [ ] Texte lisible

#### Mobile (<768px)
- [ ] Layout en 1 colonne (input au-dessus, output en dessous)
- [ ] Mode selector en 1 colonne (modes empilés)
- [ ] Boutons accessibles
- [ ] Texte lisible

---

### 10. Performance

#### Temps de Réponse
- [ ] Correction < 3 secondes (texte moyen)
- [ ] Interface réactive (pas de lag)
- [ ] Mise à jour du texte final instantanée

#### Gestion de la Mémoire
- [ ] Pas de fuite mémoire après plusieurs corrections
- [ ] Pas de ralentissement après usage prolongé

---

### 11. Cas Limites

#### Texte Vide
- [ ] Le bouton est désactivé
- [ ] Cliquer n'envoie pas de requête

#### Texte Très Long (>12 000 caractères)
- [ ] Message d'erreur avant l'envoi
- [ ] La barre de progression est rouge

#### Texte Sans Erreur
- [ ] Message "Aucune correction nécessaire !"
- [ ] Le texte final = texte original
- [ ] Pas de diff viewer (ou vide)

#### Texte avec Emojis
- [ ] Les emojis sont préservés
- [ ] Les positions des corrections sont correctes

#### Texte avec Sauts de Ligne Multiples
- [ ] Le formatage est préservé
- [ ] Les corrections sont au bon endroit

---

### 12. Accessibilité

#### Clavier
- [ ] Tab navigue entre les éléments
- [ ] Enter dans la zone de texte ne soumet pas (saut de ligne)
- [ ] Les boutons sont accessibles au clavier

#### Contraste
- [ ] Tous les textes sont lisibles
- [ ] Les couleurs ont un contraste suffisant

#### Screen Readers (si possible)
- [ ] Les labels sont présents
- [ ] Les boutons ont des aria-labels

---

### 13. Sécurité

#### Variables d'Environnement
- [ ] `.env.local` n'est pas commité
- [ ] La clé API OpenAI n'est pas exposée côté client
- [ ] Les variables Supabase sont correctes

#### Rate Limiting
- [ ] Impossible de dépasser le quota en manipulant le client
- [ ] Le rate limiting serveur fonctionne

---

## 🐛 Bugs Connus à Vérifier

### Potentiels Problèmes
- [ ] Décalage des positions avec caractères spéciaux
- [ ] Performance avec textes >10k caractères
- [ ] Affichage mobile du diff viewer
- [ ] Gestion des accents dans les positions

---

## ✅ Validation Finale

### Avant de Considérer la Phase 1 Terminée
- [ ] Tous les tests ci-dessus passent
- [ ] Aucune erreur dans la console navigateur
- [ ] Aucune erreur dans les logs serveur
- [ ] L'application est utilisable de bout en bout
- [ ] La documentation est à jour

---

## 📝 Notes de Test

**Date du test :** _______________

**Testeur :** _______________

**Environnement :**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Résolution :**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Bugs trouvés :**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Améliorations suggérées :**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

**Bon test ! 🧪**
