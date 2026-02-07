# ⚡ Guide Rapide : Activer OpenAI API

## 🎯 Problème
L'application affiche : **"Le compte OpenAI n'est pas actif"**

## ✅ Solution en 5 Minutes

### Étape 1 : Aller sur OpenAI Platform
🔗 https://platform.openai.com/

### Étape 2 : Se Connecter
- Utilise ton compte OpenAI existant
- Ou crée un nouveau compte si besoin

### Étape 3 : Ajouter un Moyen de Paiement
1. Cliquer sur **"Settings"** (en haut à droite)
2. Cliquer sur **"Billing"** dans le menu
3. Cliquer sur **"Add payment method"**
4. Ajouter ta carte bancaire

### Étape 4 : Ajouter du Crédit
1. Toujours dans **"Billing"**
2. Cliquer sur **"Add to credit balance"**
3. Ajouter au minimum **5$** (recommandé : 10$)
4. Confirmer

### Étape 5 : Vérifier la Clé API
1. Aller dans **"API keys"** (menu de gauche)
2. Vérifier que ta clé existe
3. Si besoin, créer une nouvelle clé :
   - Cliquer sur **"Create new secret key"**
   - Copier la clé (elle commence par `sk-...`)
   - La sauvegarder dans `.env.local`

### Étape 6 : Redémarrer le Serveur
```bash
# Arrêter le serveur (Ctrl+C dans le terminal)
# Puis relancer :
npm run dev
```

### Étape 7 : Tester
1. Ouvrir `http://localhost:3000/app`
2. Cliquer sur "Exemple"
3. Cliquer sur "Corriger mon texte"
4. ✅ Ça devrait fonctionner !

---

## 💰 Coût Estimé

### Pour le Développement
- **Modèle utilisé** : gpt-4o-mini (le moins cher)
- **Coût par correction** : ~0.002$ (texte moyen de 200 mots)
- **Pour 1000 corrections** : ~2$
- **Crédit recommandé** : 10$ (suffisant pour plusieurs mois de dev)

### Tarifs OpenAI (gpt-4o-mini)
- **Input** : 0.15$ / 1M tokens (~750k mots)
- **Output** : 0.60$ / 1M tokens (~750k mots)

---

## 🔍 Vérification

### Comment Savoir si Ça Fonctionne ?

#### Dans le Terminal (serveur)
Tu devrais voir :
```
[Correction] User: xxx... | Mode: standard | Remaining: 50/50
✓ Compiled in 99ms
```

Et **PAS** :
```
[Correction] Erreur: Error: 429 Your account is not active...
```

#### Dans le Navigateur
- Les statistiques s'affichent
- Le diff viewer montre les changements
- Pas de message d'erreur rouge

---

## 🆘 Si Ça ne Fonctionne Toujours Pas

### Vérifier la Clé API dans .env.local
```bash
# Ouvrir le fichier
cat .env.local

# Tu devrais voir :
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Tester la Clé Manuellement
```bash
# Remplace YOUR_API_KEY par ta vraie clé
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Si ça retourne une liste de modèles → La clé fonctionne ✅
Si ça retourne une erreur 401 → La clé est invalide ❌

### Créer une Nouvelle Clé
1. Sur https://platform.openai.com/api-keys
2. Cliquer sur **"Create new secret key"**
3. Donner un nom : "Correcteur Dev"
4. Copier la clé
5. Remplacer dans `.env.local`
6. Redémarrer le serveur

---

## 📝 Checklist

- [ ] Compte OpenAI créé
- [ ] Moyen de paiement ajouté
- [ ] Crédit ajouté (minimum 5$)
- [ ] Clé API créée
- [ ] Clé API dans `.env.local`
- [ ] Serveur redémarré
- [ ] Test réussi sur `http://localhost:3000/app`

---

## 🎉 Une Fois que Ça Fonctionne

### Prochaines Étapes
1. Tester les 3 modes de correction
2. Tester l'acceptation/refus des corrections
3. Vérifier le responsive (mobile)
4. Suivre la checklist complète dans `CHECKLIST_TEST.md`

---

**Bon courage ! 💪**

Une fois l'API activée, l'application sera 100% fonctionnelle.
