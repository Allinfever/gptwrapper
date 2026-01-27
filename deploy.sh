#!/bin/bash
set -e

echo "🚀 Déploiement de Correcteur..."
echo "Exécuté par: $(whoami)"

# Install dependencies
echo "📦 Installation des dépendances..."
npm ci

# Build
echo "🔨 Build de l'application..."
npm run build

# Reload PM2
echo "♻️  Rechargement PM2..."
pm2 reload gptwrapper || pm2 start npm --name "gptwrapper" -- start

echo "✅ Déploiement terminé !"
