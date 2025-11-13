# 🦊 FoxWiseGPS - Application GPS Avancée

Application GPS moderne avec graphiques avancés, suivi en temps réel, visualisations 3D et analyse de données basée sur Mapbox GL JS.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌐 Application En Ligne

**🎉 Accédez à l'application directement depuis votre navigateur!**

Une fois le déploiement GitHub Pages activé, l'application sera accessible à:
```
https://hash23code.github.io/FoxWiseGPS_Dev_v1.0/
```

**Aucune installation requise** - Utilisez-la directement en ligne! 🚀

### 📦 Activation de GitHub Pages (2 méthodes)

#### Méthode 1: Via la Branche Claude (Recommandé)

1. **Allez sur GitHub:** `https://github.com/hash23code/FoxWiseGPS_Dev_v1.0`
2. **Dans Settings > Pages:**
   - Source: Sélectionnez **Deploy from a branch**
   - Branch: Sélectionnez **claude/gps-app-advanced-graphics-011CV5Wo1Nv28TgasTXHMR8v**
   - Folder: `/ (root)`
   - Cliquez **Save**
3. **Attendez 1-2 minutes** - L'app sera en ligne! ✅

#### Méthode 2: Créer une Branche Main

1. Sur GitHub, allez dans l'onglet **Code**
2. Cliquez sur le sélecteur de branche (où il est écrit la branche actuelle)
3. Tapez "main" et créez la nouvelle branche à partir de claude/gps...
4. Allez dans **Settings > Pages**
5. Sélectionnez **Deploy from a branch** → **main** → **Save**

L'application sera accessible à l'URL ci-dessus une fois le déploiement terminé!

## ✨ Fonctionnalités

### 🗺️ Cartographie Avancée
- **Styles de carte multiples**: Rues, Satellite, Navigation, Sombre, Clair, Extérieur
- **Vue 3D**: Terrain en 3D avec bâtiments extrudés
- **Contrôles interactifs**: Inclinaison (pitch) et rotation (bearing) ajustables

### 📍 Géolocalisation & Suivi
- **Localisation en temps réel**: Positionnement GPS haute précision
- **Suivi continu**: Tracking GPS avec mise à jour automatique
- **Enregistrement de trajets**: Sauvegarde et visualisation de vos parcours
- **Statistiques en direct**: Vitesse, distance, altitude, durée

### 🚗 Navigation
- **Itinéraires optimisés**: Calcul d'itinéraires avec alternatives
- **Navigation turn-by-turn**: Instructions détaillées
- **Trafic en temps réel**: Informations de congestion

### 📊 Visualisations Avancées
- **Heatmaps**: Visualisation de zones d'activité
- **Graphiques dynamiques**: Charts en temps réel avec Chart.js
- **Clustering**: Regroupement intelligent de points d'intérêt
- **Mesures de distance**: Outil de mesure interactif

### 📈 Statistiques & Analyse
- Vitesse instantanée et maximale
- Distance totale parcourue
- Altitude en temps réel
- Historique de vitesse (graphique)
- Temps actif et durée des trajets
- Nombre de points enregistrés

## 🚀 Installation & Lancement

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Python 3.x (pour le serveur de développement)
- Connexion internet
- Clé API Mapbox (gratuite)

### Étape 1: Obtenir une Clé API Mapbox

1. Visitez [mapbox.com](https://account.mapbox.com/auth/signup/)
2. Créez un compte gratuit (aucune carte bancaire requise)
3. Accédez à votre tableau de bord
4. Copiez votre **Access Token** (commence par `pk.`)

**Plan Gratuit Mapbox:**
- ✅ 50,000 chargements de carte / mois
- ✅ Toutes les fonctionnalités de base
- ✅ Pas de carte bancaire requise

### Étape 2: Lancer l'Application

```bash
# Option 1: Avec Python 3
python3 -m http.server 8000

# Option 2: Avec Python 2
python -m SimpleHTTPServer 8000

# Option 3: Avec Node.js (si installé)
npx http-server -p 8000
```

### Étape 3: Ouvrir dans le Navigateur

Ouvrez votre navigateur et allez à:
```
http://localhost:8000
```

### Étape 4: Configurer la Clé API

Au premier lancement, une fenêtre modale s'ouvrira:
1. Collez votre clé API Mapbox
2. Cliquez sur "Sauvegarder"
3. La clé sera stockée localement (LocalStorage)

**Note:** Votre clé API reste privée et est stockée uniquement dans votre navigateur.

## 🎮 Guide d'Utilisation

### Contrôles de Base

#### 📍 Ma Position
Localise et centre la carte sur votre position actuelle.

#### 🎯 Suivi en Temps Réel
Active le suivi GPS continu avec mise à jour automatique de:
- Votre position sur la carte
- Vitesse en km/h
- Altitude
- Statistiques en temps réel

#### 🗺️ Style de Carte
Changez le style de la carte:
- **Rues**: Vue classique avec rues et bâtiments
- **Satellite**: Vue satellite avec noms de rues
- **Extérieur**: Optimisé pour la randonnée
- **Sombre**: Mode sombre élégant
- **Clair**: Mode clair minimaliste
- **Navigation**: Optimisé pour la conduite

### Fonctionnalités 3D

#### 🏔️ Vue 3D / Terrain
Active le mode 3D avec:
- Terrain en relief
- Bâtiments extrudés en 3D
- Ciel atmosphérique
- Contrôles d'inclinaison et rotation

**Contrôles:**
- **Inclinaison (Pitch)**: 0° à 85° - ajuste l'angle de vue
- **Rotation (Bearing)**: 0° à 360° - fait pivoter la carte

### Navigation & Itinéraires

#### 🚗 Navigation/Itinéraire
Active le panneau de navigation pour:
- Calculer des itinéraires
- Comparer des alternatives
- Voir le trafic en temps réel
- Obtenir des instructions turn-by-turn

**Profils disponibles:**
- Voiture (par défaut)
- Vélo
- Marche

### Enregistrement de Trajets

#### ▶️ Démarrer Enregistrement
Commence l'enregistrement de votre trajet:
1. Activez d'abord le "Suivi en Temps Réel"
2. Cliquez sur "Démarrer Enregistrement"
3. Votre parcours sera dessiné en vert sur la carte
4. Les statistiques se mettent à jour automatiquement

**Enregistrements:**
- Point GPS toutes les 2 secondes
- Calcul automatique de distance
- Chronomètre de durée
- Compteur de points

#### ⏸️ Arrêter
Arrête l'enregistrement et affiche un résumé:
- Nombre de points
- Distance totale
- Vitesse maximale
- Durée totale

#### 🗑️ Effacer Trajet
Supprime le trajet actuel et réinitialise les statistiques.

### Fonctionnalités Avancées

#### 🔥 Heatmap (Activité)
Affiche une carte de chaleur démontrant les zones d'activité:
- Visualisation par densité
- Dégradé de couleurs (bleu → rouge)
- Zoom adaptatif
- Parfait pour analyser les zones fréquentées

#### 📌 Points d'Intérêt
Ajoute et affiche des POIs avec clustering:
- Regroupement automatique par zoom
- Catégories: Restaurants, Cafés, Hôtels, etc.
- Affichage du nombre de points par cluster
- Clic pour voir les détails

#### 📏 Mesurer Distance
Outil de mesure interactif:
1. Activez le mode mesure
2. Cliquez sur la carte pour placer des points
3. La distance totale s'affiche automatiquement
4. Les segments sont reliés par une ligne pointillée

### Statistiques

#### 📈 Graphique de Vitesse
- Graphique en temps réel de votre vitesse
- Historique des 20 dernières valeurs
- Mise à jour automatique pendant le suivi

#### 📊 Résumé des Stats
- **Vitesse Max**: Record de vitesse atteint
- **Distance Totale**: Cumul des distances parcourues
- **Temps Actif**: Durée totale de vos trajets

## 🛠️ Architecture Technique

### Technologies Utilisées

#### Frontend
- **HTML5**: Structure sémantique
- **CSS3**: Styles modernes avec animations
- **JavaScript ES6+**: Logique applicative orientée objet

#### Librairies
- **Mapbox GL JS v3.0**: Cartographie WebGL
- **Mapbox Directions Plugin**: Navigation et itinéraires
- **Chart.js v4.4**: Graphiques et visualisations

### Structure du Projet

```
FoxWiseGPS_Dev_v1.0/
│
├── index.html          # Page principale
├── styles.css          # Styles CSS
├── app.js             # Logique JavaScript
├── package.json       # Configuration du projet
└── README.md          # Documentation
```

### Classes Principales

#### `FoxWiseGPS`
Classe principale qui gère:
- Initialisation de la carte
- Géolocalisation
- Suivi GPS
- Enregistrement de trajets
- Statistiques
- Visualisations avancées

### API & Services

#### Mapbox Services Utilisés
- **Maps API**: Affichage des cartes
- **Geocoding API**: Recherche d'adresses
- **Directions API**: Calcul d'itinéraires
- **Static Images API**: Captures de cartes

## 🔒 Sécurité & Confidentialité

### Données de Localisation
- ✅ Géolocalisation avec consentement utilisateur
- ✅ Données stockées uniquement en local
- ✅ Aucune transmission à des serveurs tiers
- ✅ Suppression facile des historiques

### Clé API
- ✅ Stockage sécurisé dans LocalStorage
- ✅ Pas de transmission côté serveur
- ✅ Visible uniquement par vous
- ✅ Révocable à tout moment sur Mapbox

### Permissions Requises
- **Géolocalisation**: Nécessaire pour le GPS et le tracking
- **LocalStorage**: Pour sauvegarder la clé API

## 📱 Responsive Design

L'application s'adapte à toutes les tailles d'écran:
- 💻 **Desktop**: Sidebar complète avec tous les contrôles
- 📱 **Tablette**: Interface optimisée
- 📱 **Mobile**: Layout vertical avec carte prioritaire

### Points de Rupture
- Desktop: > 1024px
- Tablette: 768px - 1024px
- Mobile: < 768px

## 🌐 Compatibilité Navigateurs

| Navigateur | Version Min | Support |
|-----------|-------------|---------|
| Chrome    | 70+         | ✅ Complet |
| Firefox   | 65+         | ✅ Complet |
| Safari    | 12+         | ✅ Complet |
| Edge      | 79+         | ✅ Complet |
| Opera     | 60+         | ✅ Complet |

**WebGL requis**: Assurez-vous que WebGL est activé dans votre navigateur.

## 🚀 Fonctionnalités Futures (Roadmap)

- [ ] Export GPX/KML des trajets
- [ ] Sauvegarde des trajets en base de données
- [ ] Partage de trajets
- [ ] Mode hors-ligne avec cache
- [ ] Intégration météo
- [ ] Alertes de trafic
- [ ] Mode multi-utilisateurs
- [ ] Application mobile native (React Native)
- [ ] Intégration smartwatch
- [ ] Rapports PDF des statistiques

## 🐛 Dépannage

### La carte ne charge pas
- Vérifiez votre connexion internet
- Vérifiez que la clé API Mapbox est valide
- Ouvrez la console navigateur (F12) pour voir les erreurs

### Géolocalisation ne fonctionne pas
- Autorisez l'accès à la localisation dans votre navigateur
- Vérifiez que vous utilisez HTTPS (requis pour la géolocalisation)
- Sur localhost, HTTP est autorisé

### La carte est lente
- Désactivez les fonctionnalités gourmandes (3D, heatmap)
- Fermez les autres onglets
- Vérifiez que WebGL est activé et supporté

### Erreur "Failed to fetch"
- Problème de connexion internet
- API Mapbox temporairement indisponible
- Vérifiez les limites de votre quota (50k/mois gratuit)

## 📄 Licence

MIT License - Libre d'utilisation et de modification.

## 👨‍💻 Auteur

**FoxWise Development Team**

## 🤝 Contribution

Les contributions sont les bienvenues! Pour contribuer:

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📞 Support

- 📧 Email: support@foxwise.com
- 🐛 Issues: [GitHub Issues](https://github.com/foxwise/gps/issues)
- 📖 Docs: [Documentation complète](https://docs.foxwise.com)

## 🙏 Remerciements

- [Mapbox](https://www.mapbox.com/) pour leur excellente API
- [Chart.js](https://www.chartjs.org/) pour les graphiques
- La communauté open-source

---

**Fait avec ❤️ par FoxWise**

*Dernière mise à jour: 2025-11-13*
