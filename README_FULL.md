# Correcteur - GPT Wrapper MVP

Correcteur orthographique et grammatical en français, simple et élégant.

## 🎯 Fonctionnalités

- ✅ Correction orthographe + grammaire + ponctuation (français)
- ✅ Pas de reformulation, uniquement les corrections nécessaires
- ✅ Liste des règles appliquées
- ✅ Rate limit : 10 corrections/jour (freemium)
- ✅ Copie rapide du texte corrigé
- ✅ Interface minimaliste et professionnelle

## 🛠 Stack Technique

- **Framework** : Next.js 14+ (App Router)
- **Language** : TypeScript
- **Styling** : TailwindCSS
- **AI** : OpenAI API (gpt-4o-mini)
- **Icons** : Lucide React
- **Deployment** : PM2 + Nginx sur VPS

## 📋 Prérequis

- Node.js 20+
- Clé API OpenAI
- PM2 (pour le déploiement)

## 🚀 Installation locale

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

## 🔧 Configuration

Créez un fichier `.env.local` avec :

```env
OPENAI_API_KEY=your_openai_api_key_here
```

⚠️ **Ne jamais committer la clé API** (le fichier `.env.local` est dans `.gitignore`)

## 📦 Build

```bash
npm run build
npm start
```

## 🚀 Déploiement sur VPS

### Première installation

```bash
# Sur le VPS
cd /var/www
sudo git clone https://github.com/Allinfever/gptwrapper.git
sudo chown -R deploy:deploy /var/www/gptwrapper
cd gptwrapper

# En tant qu'utilisateur deploy
sudo -u deploy bash
npm install
npm run build

# Créer le fichier .env
echo "OPENAI_API_KEY=your_key_here" > .env

# Lancer avec PM2
pm2 start npm --name "gptwrapper" -- start
pm2 save
exit
```

### Déploiement automatique (GitHub Actions)

Chaque push sur `main` déclenche un déploiement automatique via le workflow GitHub Actions configuré dans `.github/workflows/deploy.yml`.

**Secrets GitHub requis** :
- `VPS_HOST` : letelos.fr
- `VPS_USER` : root
- `VPS_SSH_KEY` : Clé privée SSH

### Déploiement manuel

```bash
# Sur le VPS
cd /var/www/gptwrapper
sudo -u deploy git pull origin main
sudo -u deploy bash deploy.sh
```

## 🌐 Configuration Nginx

Exemple de configuration pour `gptwrapper.letelos.fr` :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name gptwrapper.letelos.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Puis activer HTTPS avec Certbot :

```bash
sudo certbot --nginx -d gptwrapper.letelos.fr
```

## 📝 Scripts disponibles

- `npm run dev` : Lancer en mode développement
- `npm run build` : Build de production
- `npm start` : Lancer en production
- `npm run lint` : Vérifier le code avec ESLint

## 🔒 Sécurité & Privacy

- ❌ Aucun texte stocké
- ❌ Pas de compte utilisateur requis
- ✅ Rate limit basé sur IP + User-Agent (anonymisé)
- ✅ Compteurs supprimés automatiquement chaque jour
- ✅ Transmission sécurisée vers OpenAI API

## 🐛 Commandes utiles

```bash
# Logs PM2
pm2 logs gptwrapper

# Restart
pm2 restart gptwrapper

# Status
pm2 status

# Logs Nginx
sudo tail -f /var/log/nginx/error.log
```

## 📄 License

© 2026 Letelos. Tous droits réservés.

## 📧 Contact

contact@letelos.fr
