# 🚀 Guide de Déploiement VPS

## ✅ Code Poussé sur GitHub

**Commit :** `8ea1683`
**Message :** Refonte design complète + Implémentation Phase 1

**Fichiers modifiés :** 37 fichiers
**Insertions :** 7736 lignes
**Suppressions :** 239 lignes

---

## 📋 Déploiement sur VPS

### Option 1 : Déploiement Automatique (SSH)

**Prérequis :** Connexion SSH configurée

```bash
# Se connecter au VPS
ssh root@51.91.121.176

# Naviguer vers le répertoire
cd /var/www/correcteur

# Pull des dernières modifications
git pull origin main

# Installer les dépendances
npm install

# Build de l'application
npm run build

# Redémarrer avec PM2
pm2 restart correcteur

# Vérifier le statut
pm2 status
pm2 logs correcteur --lines 50
```

---

### Option 2 : Déploiement via GitHub Actions (Recommandé)

**Créer `.github/workflows/deploy.yml` :**

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to VPS
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.VPS_SSH_KEY }}
        script: |
          cd /var/www/correcteur
          git pull origin main
          npm install
          npm run build
          pm2 restart correcteur
```

**Secrets à configurer dans GitHub :**
- `VPS_HOST` : 51.91.121.176
- `VPS_USER` : root
- `VPS_SSH_KEY` : Clé SSH privée

---

### Option 3 : Déploiement Manuel (Si SSH ne fonctionne pas)

**1. Se connecter au VPS via Hostinger Panel**
- Aller sur https://hpanel.hostinger.com
- Ouvrir le terminal du VPS

**2. Exécuter les commandes :**

```bash
cd /var/www/correcteur
git pull origin main
npm install
npm run build
pm2 restart correcteur
pm2 logs correcteur
```

---

## 🔍 Vérifications Post-Déploiement

### 1. Vérifier que l'application tourne

```bash
pm2 status
```

**Résultat attendu :**
```
┌─────┬──────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ status  │ restart │ uptime  │ cpu      │
├─────┼──────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ correcteur   │ online  │ 0       │ 5s      │ 0%       │
└─────┴──────────────┴─────────┴─────────┴─────────┴──────────┘
```

### 2. Vérifier les logs

```bash
pm2 logs correcteur --lines 50
```

**Rechercher :**
- ✅ `Ready in Xms`
- ✅ `Local: http://localhost:3000`
- ❌ Pas d'erreurs

### 3. Tester l'application

**URLs à tester :**
- http://51.91.121.176:3000/app
- http://51.91.121.176:3000/pricing
- http://51.91.121.176:3000/app/history
- http://51.91.121.176:3000/app/glossary

### 4. Vérifier NGINX (si configuré)

```bash
sudo nginx -t
sudo systemctl status nginx
```

**Si domaine configuré :**
- https://correcteur.letelos.fr/app
- https://correcteur.letelos.fr/pricing

---

## 🐛 Résolution de Problèmes

### Problème : Git pull échoue

```bash
# Vérifier l'état de git
git status

# Si des conflits
git stash
git pull origin main
git stash pop
```

### Problème : npm install échoue

```bash
# Nettoyer le cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Problème : Build échoue

```bash
# Vérifier les variables d'environnement
cat .env.local

# Vérifier les logs
npm run build 2>&1 | tee build.log
```

### Problème : PM2 ne démarre pas

```bash
# Arrêter et redémarrer
pm2 stop correcteur
pm2 delete correcteur
pm2 start npm --name "correcteur" -- start

# Sauvegarder
pm2 save
```

### Problème : Port 3000 déjà utilisé

```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Redémarrer
pm2 restart correcteur
```

---

## 📊 Monitoring

### Logs en temps réel

```bash
pm2 logs correcteur
```

### Statistiques

```bash
pm2 monit
```

### Redémarrage automatique

```bash
pm2 startup
pm2 save
```

---

## 🔄 Rollback (Si Problème)

### Revenir au commit précédent

```bash
cd /var/www/correcteur
git log --oneline -5  # Voir les derniers commits
git checkout cd6fffe  # Commit précédent
npm install
npm run build
pm2 restart correcteur
```

---

## ✅ Checklist de Déploiement

- [ ] Code poussé sur GitHub
- [ ] Connexion SSH au VPS réussie
- [ ] Git pull effectué
- [ ] npm install terminé
- [ ] npm run build réussi
- [ ] PM2 restart effectué
- [ ] Application accessible sur http://51.91.121.176:3000
- [ ] Pages testées (app, pricing, history, glossary)
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Variables d'environnement vérifiées

---

## 🎯 Prochaines Étapes

1. **Configurer le domaine** (si pas encore fait)
   - Pointer correcteur.letelos.fr vers 51.91.121.176
   - Configurer NGINX
   - Installer SSL (Let's Encrypt)

2. **Configurer GitHub Actions** (déploiement automatique)

3. **Monitoring** (Sentry, LogRocket, etc.)

4. **Backup** (base de données, code)

---

## 📞 Support

**Si problème de connexion SSH :**
1. Vérifier que le VPS est allumé (Hostinger Panel)
2. Vérifier les clés SSH
3. Utiliser le terminal Hostinger Panel

**Si problème de déploiement :**
1. Vérifier les logs : `pm2 logs correcteur`
2. Vérifier les variables d'environnement
3. Tester en local d'abord

---

**Bon déploiement ! 🚀**
