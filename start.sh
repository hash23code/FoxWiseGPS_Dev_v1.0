#!/bin/bash

echo "🦊 Lancement de FoxWiseGPS..."
echo ""
echo "📍 L'application sera accessible à:"
echo "   👉 http://localhost:8000"
echo ""
echo "🔑 Au premier lancement, vous devrez:"
echo "   1. Obtenir une clé API gratuite sur: https://account.mapbox.com/auth/signup/"
echo "   2. La coller dans l'application"
echo ""
echo "⏳ Démarrage du serveur..."
echo ""

# Essayer Python 3 d'abord
if command -v python3 &> /dev/null; then
    echo "✅ Serveur démarré avec Python 3"
    python3 -m http.server 8000
# Sinon Python 2
elif command -v python &> /dev/null; then
    echo "✅ Serveur démarré avec Python 2"
    python -m SimpleHTTPServer 8000
# Sinon PHP
elif command -v php &> /dev/null; then
    echo "✅ Serveur démarré avec PHP"
    php -S localhost:8000
else
    echo "❌ Erreur: Python ou PHP requis"
    echo "Installez Python depuis: https://www.python.org/downloads/"
    exit 1
fi
