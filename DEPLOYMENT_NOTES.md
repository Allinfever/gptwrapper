# Deployment Notes - GPT Wrapper

**Date de déploiement** : 27 janvier 2026  
**URL** : https://gptwrapper.letelos.fr  
**Status** : ✅ Production

---

## 🎯 Contexte du projet

**Objectif** : MVP de correcteur orthographique/grammatical français basé sur GPT  
**Délai** : Déploiement en une session (< 2h)  
**Stack** : Next.js 14, TypeScript, TailwindCSS, OpenAI API

---

## ✅ Ce qui a fonctionné

### 1. Architecture standardisée
- **Pattern réutilisé** : Même structure que saasengine (PM2 + Nginx + Let's Encrypt)
- **Pas de Docker** : PM2 suffit largement pour des apps Next.js
- **Séparation des droits** : Utilisateur `deploy` pour l'app, `root` pour Nginx

### 2. Développement
- `create-next-app` avec options préconfigurées (TypeScript + Tailwind)
- Build local réussi avant déploiement (évite les surprises)
- `.env` bien géré dès le début (`.env.local` pour dev, `.env` sur VPS)

### 3. Déploiement
- Clonage du repo GitHub directement sur le VPS
- Build sur place (pas de transfert de `node_modules`)
- PM2 démarre automatiquement après le build
- Nginx + Certbot configurés en quelques minutes

### 4. GitHub Actions
- Workflow déjà prêt dans `.github/workflows/deploy.yml`
- Auto-déploiement sur push main

---

## ⚠️ Problèmes rencontrés & Solutions

### 1. **TypeScript error: `request.ip` n'existe pas**
**Problème** : Next.js 16 a supprimé `request.ip`  
**Solution** : Utiliser `request.headers.get('x-forwarded-for')` à la place

```typescript
// ❌ Ancien (ne marche plus)
const ip = request.ip;

// ✅ Nouveau (Next.js 16+)
const ip = request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           'unknown';
```

### 2. **Build échoue avec "Missing OPENAI_API_KEY"**
**Problème** : Next.js valide les variables d'environnement au build  
**Solution** : Créer un `.env` avec placeholder AVANT le build
```bash
echo "OPENAI_API_KEY=placeholder" > .env
npm run build
# Puis remplacer par la vraie clé avant pm2 start
```

### 3. **PowerShell escape les variables dans heredoc**
**Problème** : Les `$variables` Nginx étaient mal échappées dans PowerShell  
**Solution** : Créer le fichier localement et le transférer via SCP
```bash
scp gptwrapper.nginx letelos:/etc/nginx/sites-available/gptwrapper
```

### 4. **DNS non configuré**
**Problème** : Le site n'utilise PAS de wildcard DNS (*.letelos.fr)  
**Solution** : Ajouter manuellement chaque sous-domaine dans Hostinger
- Type: A
- Nom: gptwrapper
- Valeur: 72.62.175.183

---

## 📋 Checklist de déploiement

### Phase 1 : Développement local
- [ ] `create-next-app` avec TypeScript + Tailwind
- [ ] Développer les features
- [ ] Créer `.env.example` (sans clés réelles)
- [ ] Tester le build localement (`npm run build`)
- [ ] Vérifier que pas d'erreurs TypeScript

### Phase 2 : Git & GitHub
- [ ] `git init` et configurer user.name/email
- [ ] Ajouter `.env.local` au `.gitignore`
- [ ] Commit initial
- [ ] Créer repo GitHub (via `gh repo create`)
- [ ] Push le code

### Phase 3 : VPS - Premier déploiement
```bash
# Sur le VPS
cd /var/www
git clone https://github.com/USER/PROJET.git
chown -R deploy:deploy /var/www/PROJET
cd PROJET

# En tant que deploy
sudo -u deploy bash
npm install
echo "OPENAI_API_KEY=votre_cle" > .env
npm run build
pm2 start npm --name "PROJET" -- start
pm2 save
exit
```

### Phase 4 : Nginx + HTTPS
```bash
# Créer config Nginx localement
# Transférer via SCP
scp config.nginx letelos:/etc/nginx/sites-available/PROJET

# Activer
ln -sf /etc/nginx/sites-available/PROJET /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Phase 5 : DNS + SSL
- [ ] Ajouter enregistrement A dans Hostinger (PROJET.letelos.fr → IP VPS)
- [ ] Attendre propagation DNS (vérifier avec `Resolve-DnsName -Server 8.8.8.8`)
- [ ] Lancer Certbot : `certbot --nginx -d PROJET.letelos.fr`

### Phase 6 : GitHub Actions
- [ ] Vérifier que `.github/workflows/deploy.yml` existe
- [ ] Configurer secrets GitHub (VPS_HOST, VPS_USER, VPS_SSH_KEY)
- [ ] Tester avec un commit

---

## 🔧 Commandes de maintenance

```bash
# Logs en temps réel
ssh letelos
sudo -u deploy pm2 logs gptwrapper

# Restart après modification .env
cd /var/www/gptwrapper
sudo -u deploy pm2 restart gptwrapper

# Rebuild après changement de code
sudo -u deploy git pull origin main
sudo -u deploy npm ci
sudo -u deploy npm run build
sudo -u deploy pm2 restart gptwrapper

# Vérifier SSL
curl -I https://gptwrapper.letelos.fr

# Logs Nginx
tail -f /var/log/nginx/gptwrapper_access.log
tail -f /var/log/nginx/gptwrapper_error.log
```

---

## 💡 Leçons apprises

### À faire systématiquement
1. **Build local avant push** : Évite 90% des problèmes
2. **Variables d'env préparées** : Créer `.env` AVANT le build sur VPS
3. **Tester le DNS avant Certbot** : Utiliser Google DNS (8.8.8.8) pour éviter le cache
4. **PM2 save après start** : Sinon pas de redémarrage auto après reboot
5. **Permissions deploy:deploy** : Toujours utiliser l'utilisateur `deploy` pour les apps

### À éviter
1. ❌ Ne jamais commiter `.env` avec clés réelles (même temporairement)
2. ❌ Ne pas builder dans `node_modules` avec mauvaises permissions
3. ❌ Ne pas utiliser PowerShell heredoc pour créer des configs avec variables
4. ❌ Ne pas assumer que wildcard DNS existe (vérifier chaque sous-domaine)

---

## 📊 Métriques

- **Temps de développement** : ~45 min
- **Temps de déploiement** : ~30 min (dont 5 min d'attente DNS)
- **Bugs de prod** : 0
- **Downtime** : 0

---

## 🔗 Références

- Repo GitHub : https://github.com/Allinfever/gptwrapper
- URL Production : https://gptwrapper.letelos.fr
- Ajouté à la landing : https://letelos.fr
- Documentation similaire : voir `/var/www/saasengine/` et `dashboard-yann/`

---

**Note** : Ce fichier doit être mis à jour à chaque modification majeure ou problème rencontré.
