# 🔧 Diagnostic Connexion SSH VPS

## ❌ Problème Identifié

**Erreur :** `Connection reset by 51.91.121.176 port 22`

**Cause probable :**
1. **Fail2ban** a bloqué l'IP après plusieurs tentatives
2. **ProtonVPN** interfère avec la connexion SSH
3. **Limite de connexions simultanées** atteinte
4. **Firewall** temporaire

---

## ✅ Solutions

### Solution 1 : Déploiement via Hostinger Panel (RECOMMANDÉ)

**C'est la méthode la plus fiable et la plus simple.**

#### Étapes :

1. **Ouvrir Hostinger Panel**
   - https://hpanel.hostinger.com
   - Se connecter avec ton compte

2. **Accéder au VPS**
   - Cliquer sur ton VPS (51.91.121.176)
   - Cliquer sur "Terminal" ou "SSH Access"

3. **Exécuter les commandes de déploiement**
   ```bash
   cd /var/www/correcteur
   git pull origin main
   npm install
   npm run build
   pm2 restart correcteur
   pm2 logs correcteur --lines 50
   ```

4. **Vérifier le statut**
   ```bash
   pm2 status
   ```

5. **Tester l'application**
   - Ouvrir http://51.91.121.176:3000/app
   - Vérifier que le nouveau design est visible

---

### Solution 2 : Débloquer l'IP (Si Fail2ban)

Si tu as accès SSH via un autre moyen :

```bash
# Vérifier si l'IP est bloquée
sudo fail2ban-client status sshd

# Débloquer ton IP
sudo fail2ban-client set sshd unbanip <TON_IP>

# Redémarrer fail2ban
sudo systemctl restart fail2ban
```

---

### Solution 3 : Désactiver ProtonVPN Temporairement

Le VPN peut causer des problèmes de connexion SSH.

1. **Désactiver ProtonVPN**
2. **Réessayer la connexion SSH**
   ```bash
   ssh root@51.91.121.176
   ```
3. **Déployer**
4. **Réactiver ProtonVPN**

---

### Solution 4 : Utiliser un Autre Client SSH

Essayer avec **PuTTY** (Windows) :

1. **Télécharger PuTTY**
   - https://www.putty.org/

2. **Configurer la connexion**
   - Host: 51.91.121.176
   - Port: 22
   - Username: root

3. **Se connecter et déployer**

---

## 📋 Commandes de Déploiement Complètes

Une fois connecté au VPS (peu importe la méthode) :

```bash
# 1. Naviguer vers le répertoire
cd /var/www/correcteur

# 2. Vérifier l'état de Git
git status

# 3. Pull des dernières modifications
git pull origin main

# 4. Installer les dépendances
npm install

# 5. Build de l'application
npm run build

# 6. Redémarrer avec PM2
pm2 restart correcteur

# 7. Vérifier les logs
pm2 logs correcteur --lines 50

# 8. Vérifier le statut
pm2 status
```

---

## 🔍 Vérifications Post-Déploiement

### 1. Vérifier que PM2 tourne

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
- ✅ `▲ Next.js 15.1.4`
- ✅ `- Local: http://localhost:3000`
- ✅ `✓ Compiled`
- ❌ Pas d'erreurs

### 3. Tester l'application

**Ouvrir dans le navigateur :**
- http://51.91.121.176:3000/app
- http://51.91.121.176:3000/pricing
- http://51.91.121.176:3000/app/history
- http://51.91.121.176:3000/app/glossary

**Vérifier :**
- ✅ Design moderne visible
- ✅ Textarea visible
- ✅ Bouton "Corriger mon texte" visible et bleu
- ✅ Navigation fonctionne

---

## 🐛 Résolution de Problèmes

### Problème : Git pull échoue

```bash
# Vérifier les conflits
git status

# Si des modifications locales
git stash
git pull origin main
git stash pop

# Si vraiment bloqué
git reset --hard origin/main
```

### Problème : npm install échoue

```bash
# Nettoyer
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Problème : Build échoue

```bash
# Vérifier les variables d'environnement
cat .env.local

# Vérifier Node.js version
node -v  # Doit être >= 18

# Build avec logs détaillés
npm run build 2>&1 | tee build.log
```

### Problème : PM2 ne redémarre pas

```bash
# Arrêter complètement
pm2 stop correcteur
pm2 delete correcteur

# Redémarrer
pm2 start npm --name "correcteur" -- start

# Sauvegarder
pm2 save
```

---

## 💡 Pourquoi la Connexion SSH Échoue ?

### Diagnostic Technique

**Erreur :** `kex_exchange_identification: read: Connection reset`

**Signification :** Le serveur SSH a fermé la connexion pendant l'échange de clés.

**Causes possibles :**

1. **Fail2ban** (le plus probable)
   - Trop de tentatives de connexion
   - IP bloquée temporairement
   - Durée : 10-60 minutes

2. **ProtonVPN**
   - Le VPN peut causer des problèmes de routing
   - Le serveur SSH n'aime pas certaines IPs VPN

3. **Limite de connexions**
   - MaxStartups dépassé
   - Trop de connexions simultanées

4. **Firewall**
   - UFW ou iptables bloque temporairement

---

## ✅ Recommandation

**Utilise Hostinger Panel** pour déployer. C'est :
- ✅ Plus fiable
- ✅ Plus simple
- ✅ Pas de problème de connexion
- ✅ Interface web directe

**Temps estimé :** 2-3 minutes

---

## 📞 Si Problème Persiste

1. **Vérifier que le VPS est allumé** (Hostinger Panel)
2. **Redémarrer le VPS** si nécessaire
3. **Vérifier les logs du serveur** via Hostinger Panel
4. **Contacter le support Hostinger** si vraiment bloqué

---

**Le code est sur GitHub, il suffit de faire `git pull` ! 🚀**
