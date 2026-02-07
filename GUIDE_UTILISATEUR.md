# 📖 Guide d'Utilisation - Correcteur (Nouvelle Interface)

## 🎯 Vue d'Ensemble

Correcteur dispose maintenant d'une interface complète qui vous donne un **contrôle total** sur vos corrections. Fini l'anxiété de ne pas savoir ce qui a changé !

---

## 🚀 Démarrage Rapide

### Étape 1 : Choisir votre mode de correction

Trois modes sont disponibles selon vos besoins :

#### ⚡ **Typo uniquement** (Rapide)
**Quand l'utiliser ?**
- Messages Slack/Teams rapides
- Emails informels entre collègues
- Brouillons de notes

**Ce qu'il fait :**
- Corrige uniquement les fautes de frappe évidentes
- Ignore les accords complexes
- Ultra-rapide

**Exemple :**
- ✅ Corrige : "Je vais au reunoin" → "Je vais au réunion"
- ❌ Ne corrige pas : "Je vais au réunion" (accord féminin)

---

#### ✅ **Standard** (Recommandé)
**Quand l'utiliser ?**
- Emails professionnels
- Messages clients
- Documents internes
- 90% de vos besoins quotidiens

**Ce qu'il fait :**
- Orthographe complète
- Grammaire et conjugaison
- Accords (sujet-verbe, participes passés, adjectifs)
- Ponctuation

**Exemple :**
- ✅ "Je voulait vous contacter" → "Je voulais vous contacter"
- ✅ "Il faut ce rencontrer" → "Il faut se rencontrer"
- ✅ "Les documents est prêt" → "Les documents sont prêts"

---

#### 🛡️ **Strict** (Pro)
**Quand l'utiliser ?**
- Rapports officiels
- Documents juridiques
- Publications externes
- Présentations clients importantes

**Ce qu'il fait :**
- Tout ce que fait le mode Standard
- **+ Typographie française stricte** :
  - Espaces insécables (avant : ; ! ?)
  - Guillemets français « » au lieu de " "
  - Tirets cadratins — pour les incises
  - Points de suspension … (caractère unique)
  - Majuscules accentuées (À, É, etc.)

**Exemple :**
- ✅ "Bonjour !" → "Bonjour !"  (espace insécable)
- ✅ "Il a dit "oui"" → "Il a dit « oui »"
- ✅ "A bientôt" → "À bientôt"

---

### Étape 2 : Coller votre texte

1. Cliquez dans la zone "Texte à corriger"
2. Collez votre texte (Ctrl+V / Cmd+V)
3. Ou cliquez sur **"Exemple"** pour tester avec un texte pré-rempli

**Limites :**
- Maximum : 12 000 caractères
- Une barre de progression vous indique votre utilisation

---

### Étape 3 : Lancer la correction

Cliquez sur le bouton **"Corriger mon texte"**

⏱️ Temps moyen : 1-3 secondes

---

## 🔍 Comprendre les Résultats

### 1️⃣ Statistiques de Session

Une carte colorée vous affiche :

```
✅ 8 corrections appliquées
📊 3 accords • 2 conjugaisons • 2 orthographe • 1 ponctuation
⏱️ Corrigé en 1,2s
```

**Si aucune correction :**
```
✨ Aucune correction nécessaire !
Votre texte est déjà impeccable.
```

---

### 2️⃣ Visualisation des Changements (Diff Viewer)

#### Vue d'ensemble
En haut : **"3 corrections proposées"** + bouton **"Tout accepter"**

#### Texte avec surlignage
Votre texte original s'affiche avec les mots à corriger **surlignés en couleur** :

**Couleurs par type :**
- 🔴 **Rouge** = Orthographe
- 🔵 **Bleu** = Grammaire
- 🟣 **Violet** = Conjugaison
- 🟢 **Vert** = Ponctuation
- 🟠 **Orange** = Accords
- 🩷 **Rose** = Typographie

**Interactions :**
- **Survolez** un mot surligné → voir la correction proposée
- **Cliquez** sur un mot → figer l'affichage de la correction

---

### 3️⃣ Liste Détaillée des Corrections

Chaque correction est présentée dans une carte avec :

#### Informations affichées :
1. **Badge coloré** : type de correction
2. **Transformation** : `mot original` → `mot corrigé`
3. **Explication** : pourquoi cette correction
4. **Règle** : nom de la règle grammaticale

#### Exemple de carte :
```
┌─────────────────────────────────────────────────┐
│ [conjugaison]                    (à vérifier)   │
│                                                  │
│ voulait → voulais                                │
│ Correction de la conjugaison à l'imparfait      │
│ Accord avec le sujet "je"                       │
│                                                  │
│                               [✓ Accepter] [✗ Refuser] │
└─────────────────────────────────────────────────┘
```

---

## 🎛️ Contrôle Granulaire

### Option 1 : Tout accepter
Cliquez sur **"Tout accepter"** en haut → toutes les corrections sont appliquées

### Option 2 : Accepter/Refuser individuellement

Pour chaque correction :
- **Bouton vert ✓** : Accepter cette correction
- **Bouton rouge ✗** : Refuser cette correction

**Le texte final se met à jour en temps réel** selon vos choix !

---

### 4️⃣ Texte Final

Une dernière section affiche votre **texte final** :
- Avec toutes les corrections acceptées
- Sans les corrections refusées

**Bouton "Copier"** :
- Cliquez pour copier le texte final dans votre presse-papiers
- Confirmation visuelle : "Copié !" en vert

---

## 💡 Cas d'Usage Réels

### Scénario 1 : Email Client Important
**Contexte :** Vous envoyez une proposition commerciale

**Workflow :**
1. Mode : **Standard**
2. Collez votre email
3. Corrigez
4. Vérifiez les corrections une par une
5. Refusez les corrections qui changent votre ton
6. Copiez le résultat

**Temps total :** 30 secondes

---

### Scénario 2 : Message Slack Rapide
**Contexte :** Vous répondez à un collègue

**Workflow :**
1. Mode : **Typo uniquement**
2. Collez votre message
3. Corrigez
4. Acceptez tout
5. Copiez

**Temps total :** 10 secondes

---

### Scénario 3 : Rapport Officiel
**Contexte :** Compte-rendu de réunion pour la direction

**Workflow :**
1. Mode : **Strict**
2. Collez votre rapport
3. Corrigez
4. Lisez chaque explication
5. Apprenez les règles typographiques
6. Acceptez tout
7. Copiez

**Temps total :** 2 minutes
**Bonus :** Vous apprenez au passage !

---

## 🎓 Apprendre en Corrigeant

### Pourquoi c'est pédagogique ?

Chaque correction affiche :
- **Le type d'erreur** (orthographe, grammaire, etc.)
- **L'explication** (pourquoi c'est une erreur)
- **La règle** (nom de la règle grammaticale)

**Exemple :**
```
Correction : "Les documents est prêt" → "Les documents sont prêts"

Type : Accord
Explication : Le verbe doit s'accorder avec le sujet pluriel "documents"
Règle : Accord sujet-verbe au pluriel
```

### Progresser au fil du temps

Plus vous utilisez Correcteur, plus vous :
- Reconnaissez vos erreurs récurrentes
- Comprenez les règles
- Faites moins d'erreurs à l'avenir

**Objectif :** Vous rendre autonome, pas dépendant !

---

## 📊 Quotas et Limites

### Utilisateur Anonyme (Gratuit)
- **10 corrections par jour**
- Tous les modes disponibles
- Pas d'historique

### Utilisateur Connecté (Gratuit)
- **50 corrections par jour**
- Tous les modes disponibles
- Historique 7 jours (à venir)

### Pro (9€/mois) - À venir
- **Corrections illimitées**
- Historique illimité
- Export des corrections
- Statistiques avancées

---

## 🔒 Confidentialité

### Ce que nous faisons :
- ✅ Envoyons votre texte à OpenAI pour correction
- ✅ Stockons les corrections (utilisateurs connectés uniquement)
- ✅ Comptons vos corrections pour les quotas

### Ce que nous ne faisons PAS :
- ❌ Lire vos textes manuellement
- ❌ Partager vos textes avec des tiers
- ❌ Utiliser vos textes pour entraîner des modèles
- ❌ Conserver vos textes après correction (anonymes)

**Pour les utilisateurs connectés :**
- Vos corrections sont stockées dans votre compte
- Vous pouvez les supprimer à tout moment
- Elles ne sont jamais partagées

---

## 🐛 Résolution de Problèmes

### "Limite quotidienne atteinte"
**Solution :** 
- Attendez demain (reset à minuit)
- Ou créez un compte (50 corrections/jour)
- Ou passez Pro (illimité)

### "Texte trop long"
**Solution :**
- Divisez votre texte en plusieurs parties
- Maximum : 12 000 caractères par correction

### "Erreur lors de la correction"
**Solution :**
- Vérifiez votre connexion internet
- Réessayez dans quelques secondes
- Si le problème persiste, contactez le support

### Une correction semble incorrecte
**Solution :**
- Cliquez sur le bouton ✗ pour la refuser
- Le texte final n'inclura pas cette correction
- Vous gardez le contrôle total !

---

## 🎯 Bonnes Pratiques

### ✅ À faire :
- Choisir le bon mode selon le contexte
- Lire les explications pour apprendre
- Refuser les corrections qui changent votre ton
- Utiliser le mode Strict pour les documents officiels

### ❌ À éviter :
- Accepter aveuglément toutes les corrections
- Utiliser le mode Strict pour des messages informels
- Ignorer les explications (vous ratez une opportunité d'apprendre !)

---

## 🚀 Raccourcis Clavier (À venir)

Prochainement :
- `Ctrl/Cmd + Enter` : Lancer la correction
- `Ctrl/Cmd + A` : Accepter toutes les corrections
- `Ctrl/Cmd + C` : Copier le texte final

---

## 💬 Support

**Questions ? Problèmes ?**
- Email : contact@letelos.fr
- Réponse sous 24h

---

**Bonne correction ! 🎉**
