# 🗄️ Guide : Appliquer la Migration SQL sur Supabase

## 📋 Étapes à Suivre

### 1. Se Connecter à Supabase
1. Aller sur https://supabase.com
2. Se connecter avec votre compte
3. Sélectionner votre projet Correcteur

### 2. Ouvrir le SQL Editor
1. Dans le menu de gauche, cliquer sur **"SQL Editor"**
2. Cliquer sur **"New query"** (en haut à droite)

### 3. Copier la Migration
1. Ouvrir le fichier `supabase/migrations/20260207_history_glossary.sql`
2. Copier **TOUT** le contenu (Ctrl+A puis Ctrl+C)

### 4. Coller et Exécuter
1. Coller le contenu dans l'éditeur SQL de Supabase
2. Cliquer sur **"Run"** (ou Ctrl+Enter)
3. Attendre quelques secondes

### 5. Vérifier le Résultat
Vous devriez voir :
```
Success. No rows returned
```

Si vous voyez des erreurs, **ne paniquez pas** ! Lisez le message d'erreur et :
- Si c'est "already exists" : c'est OK, la table existe déjà
- Si c'est autre chose : copiez l'erreur et contactez-moi

### 6. Vérifier les Tables Créées
1. Dans le menu de gauche, cliquer sur **"Table Editor"**
2. Vous devriez voir :
   - `corrections` (enrichie)
   - `glossary_terms` (nouvelle)
   - `subscriptions` (nouvelle)

### 7. Tester les RPC Functions
1. Retourner dans **"SQL Editor"**
2. Créer une nouvelle query
3. Tester avec :

```sql
-- Tester get_user_glossary
SELECT * FROM get_user_glossary('votre-user-id-ici');

-- Tester check_glossary_limit
SELECT * FROM check_glossary_limit('votre-user-id-ici');
```

Si ça retourne des résultats (même vides), c'est bon ! ✅

---

## ⚠️ Problèmes Courants

### Erreur : "permission denied"
**Solution :** Vous n'êtes pas connecté en tant qu'admin. Vérifiez que vous êtes sur le bon projet.

### Erreur : "already exists"
**Solution :** C'est OK ! La table ou la fonction existe déjà. Vous pouvez ignorer.

### Erreur : "syntax error"
**Solution :** Vérifiez que vous avez copié TOUT le fichier, du début à la fin.

---

## ✅ Checklist de Vérification

Après avoir exécuté la migration, vérifiez :

- [ ] Table `glossary_terms` existe
- [ ] Table `subscriptions` existe
- [ ] Table `corrections` a les nouvelles colonnes :
  - [ ] `document_type`
  - [ ] `title`
  - [ ] `error_count`
  - [ ] `auto_delete_at`
  - [ ] `mode`
- [ ] RPC function `get_user_glossary` existe
- [ ] RPC function `check_glossary_limit` existe
- [ ] RPC function `get_remaining_corrections` existe
- [ ] RPC function `cleanup_expired_corrections` existe

---

## 🎯 Une Fois la Migration Appliquée

Vous pouvez :
1. Tester la page pricing : `http://localhost:3000/pricing`
2. Tester l'API du glossaire avec Postman ou curl
3. Continuer l'implémentation des UI

---

## 💡 Astuce

Pour voir la structure complète d'une table :
1. Aller dans **"Table Editor"**
2. Cliquer sur la table
3. Cliquer sur l'onglet **"Definition"**

Vous verrez toutes les colonnes, types, contraintes, etc.

---

**Bon courage ! 🚀**

Si vous avez des problèmes, n'hésitez pas à me contacter.
