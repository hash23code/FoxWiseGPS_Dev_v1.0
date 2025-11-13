// ==========================================
// FoxWiseGPS - Advanced GPS Application
// ==========================================

class FoxWiseGPS {
    constructor() {
        this.map = null;
        this.userMarker = null;
        this.tracking = false;
        this.recording = false;
        this.trackingPath = [];
        this.watchId = null;
        this.directions = null;
        this.heatmapLayer = null;
        this.chart = null;
        this.is3DEnabled = false;
        this.isMeasuring = false;
        this.measurePoints = [];

        // Statistics
        this.stats = {
            speed: 0,
            distance: 0,
            altitude: 0,
            maxSpeed: 0,
            totalDistance: 0,
            startTime: null,
            speedHistory: [],
            timestamps: []
        };

        // Initialize
        this.checkApiKey();
    }

    // ==========================================
    // API KEY MANAGEMENT
    // ==========================================

    checkApiKey() {
        const apiKey = localStorage.getItem('mapboxApiKey');

        if (!apiKey || !apiKey.startsWith('pk.')) {
            document.getElementById('apiKeyModal').classList.remove('hidden');
            document.getElementById('saveApiKey').addEventListener('click', () => {
                this.saveApiKey();
            });
        } else {
            mapboxgl.accessToken = apiKey;
            this.init();
        }
    }

    saveApiKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();

        if (!apiKey.startsWith('pk.')) {
            alert('❌ Clé API invalide! Elle doit commencer par "pk."');
            return;
        }

        localStorage.setItem('mapboxApiKey', apiKey);
        mapboxgl.accessToken = apiKey;
        document.getElementById('apiKeyModal').classList.add('hidden');
        this.init();
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================

    init() {
        this.initMap();
        this.initControls();
        this.initChart();
        this.getUserLocation();
    }

    initMap() {
        // Create map centered on France by default
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [2.3522, 48.8566], // Paris
            zoom: 12,
            pitch: 0,
            bearing: 0,
            antialias: true
        });

        // Add navigation controls
        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add scale control
        this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

        // Add geolocate control
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        });
        this.map.addControl(geolocate, 'top-right');

        // Map events
        this.map.on('load', () => {
            document.getElementById('loadingOverlay').classList.add('hidden');
            this.setupMapLayers();
        });

        this.map.on('mousemove', (e) => {
            const coords = `Lat: ${e.lngLat.lat.toFixed(5)}, Lng: ${e.lngLat.lng.toFixed(5)}`;
            document.getElementById('coordinates').textContent = coords;
        });

        this.map.on('click', (e) => {
            if (this.isMeasuring) {
                this.addMeasurePoint(e.lngLat);
            }
        });
    }

    setupMapLayers() {
        // Add 3D buildings layer
        this.map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#4A90E2',
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15, 0,
                    15.05, ['get', 'height']
                ],
                'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15, 0,
                    15.05, ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
            }
        });

        // Add source for tracking path
        this.map.addSource('tracking-path', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': []
                }
            }
        });

        // Add layer for tracking path
        this.map.addLayer({
            'id': 'tracking-path-layer',
            'type': 'line',
            'source': 'tracking-path',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#50C878',
                'line-width': 4,
                'line-opacity': 0.8
            }
        });
    }

    // ==========================================
    // CONTROLS & EVENT LISTENERS
    // ==========================================

    initControls() {
        // Location button
        document.getElementById('locateBtn').addEventListener('click', () => {
            this.getUserLocation();
        });

        // Tracking button
        document.getElementById('trackingBtn').addEventListener('click', () => {
            this.toggleTracking();
        });

        // Map style selector
        document.getElementById('mapStyle').addEventListener('change', (e) => {
            this.changeMapStyle(e.target.value);
        });

        // 3D toggle
        document.getElementById('toggle3D').addEventListener('click', () => {
            this.toggle3D();
        });

        // Pitch slider
        document.getElementById('pitchSlider').addEventListener('input', (e) => {
            const pitch = parseInt(e.target.value);
            document.getElementById('pitchValue').textContent = pitch;
            this.map.setPitch(pitch);
        });

        // Bearing slider
        document.getElementById('bearingSlider').addEventListener('input', (e) => {
            const bearing = parseInt(e.target.value);
            document.getElementById('bearingValue').textContent = bearing;
            this.map.setBearing(bearing);
        });

        // Routing button
        document.getElementById('routingBtn').addEventListener('click', () => {
            this.toggleRouting();
        });

        // Heatmap button
        document.getElementById('heatmapBtn').addEventListener('click', () => {
            this.toggleHeatmap();
        });

        // Cluster button
        document.getElementById('clusterBtn').addEventListener('click', () => {
            this.addPointsOfInterest();
        });

        // Measure button
        document.getElementById('measureBtn').addEventListener('click', () => {
            this.toggleMeasure();
        });

        // Recording controls
        document.getElementById('startTrackBtn').addEventListener('click', () => {
            this.startRecording();
        });

        document.getElementById('stopTrackBtn').addEventListener('click', () => {
            this.stopRecording();
        });

        document.getElementById('clearTrackBtn').addEventListener('click', () => {
            this.clearTrack();
        });

        // Info panel close
        document.getElementById('closeInfo').addEventListener('click', () => {
            document.getElementById('infoPanel').classList.remove('active');
        });
    }

    // ==========================================
    // GEOLOCATION & TRACKING
    // ==========================================

    getUserLocation() {
        if (!navigator.geolocation) {
            alert('❌ Géolocalisation non supportée par votre navigateur');
            return;
        }

        document.getElementById('loadingOverlay').classList.remove('hidden');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, altitude } = position.coords;
                this.updateLocation(latitude, longitude, altitude);
                document.getElementById('loadingOverlay').classList.add('hidden');
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('❌ Erreur de géolocalisation: ' + error.message);
                document.getElementById('loadingOverlay').classList.add('hidden');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }

    updateLocation(lat, lng, altitude = 0) {
        // Update map center
        this.map.flyTo({
            center: [lng, lat],
            zoom: 15,
            duration: 2000
        });

        // Update or create marker
        if (this.userMarker) {
            this.userMarker.setLngLat([lng, lat]);
        } else {
            const el = document.createElement('div');
            el.className = 'marker-tracking';

            this.userMarker = new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup().setHTML('<h3>📍 Votre Position</h3>'))
                .addTo(this.map);
        }

        // Update stats
        this.stats.altitude = altitude || 0;
        document.getElementById('altitude').textContent = `${Math.round(this.stats.altitude)} m`;
    }

    toggleTracking() {
        const btn = document.getElementById('trackingBtn');

        if (!this.tracking) {
            // Start tracking
            this.tracking = true;
            btn.textContent = '⏸️ Arrêter Suivi';
            btn.classList.add('btn-danger');
            btn.classList.remove('btn-secondary');

            this.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude, speed, altitude } = position.coords;
                    this.updateLocation(latitude, longitude, altitude);

                    // Update speed
                    const speedKmh = speed ? (speed * 3.6) : 0;
                    this.stats.speed = speedKmh;
                    document.getElementById('speed').textContent = `${speedKmh.toFixed(1)} km/h`;

                    // Update max speed
                    if (speedKmh > this.stats.maxSpeed) {
                        this.stats.maxSpeed = speedKmh;
                        document.getElementById('maxSpeed').textContent = `${speedKmh.toFixed(1)} km/h`;
                    }

                    // Update chart
                    this.updateChart(speedKmh);
                },
                (error) => {
                    console.error('Tracking error:', error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
                }
            );
        } else {
            // Stop tracking
            this.tracking = false;
            btn.textContent = '🎯 Suivi en Temps Réel';
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-secondary');

            if (this.watchId) {
                navigator.geolocation.clearWatch(this.watchId);
                this.watchId = null;
            }
        }
    }

    // ==========================================
    // RECORDING & TRACK MANAGEMENT
    // ==========================================

    startRecording() {
        if (!this.tracking) {
            alert('⚠️ Veuillez d\'abord activer le suivi en temps réel');
            return;
        }

        this.recording = true;
        this.stats.startTime = new Date();
        this.trackingPath = [];

        document.getElementById('startTrackBtn').disabled = true;
        document.getElementById('stopTrackBtn').disabled = false;

        // Start recording interval
        this.recordingInterval = setInterval(() => {
            if (this.userMarker) {
                const lngLat = this.userMarker.getLngLat();
                this.trackingPath.push([lngLat.lng, lngLat.lat]);

                // Update path on map
                this.updateTrackingPath();

                // Update distance
                if (this.trackingPath.length > 1) {
                    const lastTwo = this.trackingPath.slice(-2);
                    const dist = this.calculateDistance(
                        lastTwo[0][1], lastTwo[0][0],
                        lastTwo[1][1], lastTwo[1][0]
                    );
                    this.stats.totalDistance += dist;
                    document.getElementById('distance').textContent = `${this.stats.totalDistance.toFixed(2)} km`;
                    document.getElementById('totalDistance').textContent = `${this.stats.totalDistance.toFixed(2)} km`;
                }

                // Update UI
                document.getElementById('trackPoints').textContent = this.trackingPath.length;
                this.updateDuration();
            }
        }, 2000); // Record point every 2 seconds
    }

    stopRecording() {
        this.recording = false;

        if (this.recordingInterval) {
            clearInterval(this.recordingInterval);
        }

        document.getElementById('startTrackBtn').disabled = false;
        document.getElementById('stopTrackBtn').disabled = true;

        this.showInfo('Enregistrement Terminé', `
            <p>📊 Statistiques du trajet:</p>
            <ul style="margin-top: 10px;">
                <li>Points: ${this.trackingPath.length}</li>
                <li>Distance: ${this.stats.totalDistance.toFixed(2)} km</li>
                <li>Vitesse max: ${this.stats.maxSpeed.toFixed(1)} km/h</li>
                <li>Durée: ${document.getElementById('trackDuration').textContent}</li>
            </ul>
        `);
    }

    clearTrack() {
        this.trackingPath = [];
        this.stats.totalDistance = 0;
        this.stats.startTime = null;

        // Update UI
        document.getElementById('distance').textContent = '0 km';
        document.getElementById('totalDistance').textContent = '0 km';
        document.getElementById('trackPoints').textContent = '0';
        document.getElementById('trackDuration').textContent = '00:00:00';

        // Clear path on map
        this.updateTrackingPath();
    }

    updateTrackingPath() {
        if (this.map.getSource('tracking-path')) {
            this.map.getSource('tracking-path').setData({
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': this.trackingPath
                }
            });
        }
    }

    updateDuration() {
        if (!this.stats.startTime) return;

        const now = new Date();
        const diff = now - this.stats.startTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        const duration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('trackDuration').textContent = duration;

        const activeMinutes = Math.floor(diff / 60000);
        document.getElementById('activeTime').textContent = `${activeMinutes} min`;
    }

    // ==========================================
    // MAP FEATURES
    // ==========================================

    changeMapStyle(style) {
        this.map.setStyle(`mapbox://styles/mapbox/${style}`);

        // Re-add custom layers after style change
        this.map.once('style.load', () => {
            this.setupMapLayers();
        });
    }

    toggle3D() {
        const btn = document.getElementById('toggle3D');

        if (!this.is3DEnabled) {
            // Enable 3D
            this.is3DEnabled = true;
            btn.textContent = 'Désactiver 3D/Terrain';

            // Add terrain
            this.map.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
            });

            this.map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

            // Add sky layer
            this.map.addLayer({
                'id': 'sky',
                'type': 'sky',
                'paint': {
                    'sky-type': 'atmosphere',
                    'sky-atmosphere-sun': [0.0, 0.0],
                    'sky-atmosphere-sun-intensity': 15
                }
            });

            // Animate to 3D view
            this.map.easeTo({
                pitch: 60,
                bearing: 45,
                duration: 2000
            });

            document.getElementById('pitchSlider').value = 60;
            document.getElementById('pitchValue').textContent = '60';
            document.getElementById('bearingSlider').value = 45;
            document.getElementById('bearingValue').textContent = '45';
        } else {
            // Disable 3D
            this.is3DEnabled = false;
            btn.textContent = 'Activer 3D/Terrain';

            this.map.setTerrain(null);

            if (this.map.getLayer('sky')) {
                this.map.removeLayer('sky');
            }

            this.map.easeTo({
                pitch: 0,
                bearing: 0,
                duration: 2000
            });

            document.getElementById('pitchSlider').value = 0;
            document.getElementById('pitchValue').textContent = '0';
            document.getElementById('bearingSlider').value = 0;
            document.getElementById('bearingValue').textContent = '0';
        }
    }

    toggleRouting() {
        if (this.directions) {
            // Remove directions
            this.map.removeControl(this.directions);
            this.directions = null;
            document.getElementById('routingBtn').textContent = '🚗 Navigation/Itinéraire';
        } else {
            // Add directions
            this.directions = new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                unit: 'metric',
                profile: 'mapbox/driving',
                alternatives: true,
                congestion: true
            });

            this.map.addControl(this.directions, 'top-left');
            document.getElementById('routingBtn').textContent = '❌ Fermer Navigation';

            // Set origin to user location if available
            if (this.userMarker) {
                const lngLat = this.userMarker.getLngLat();
                this.directions.setOrigin([lngLat.lng, lngLat.lat]);
            }
        }
    }

    toggleHeatmap() {
        const btn = document.getElementById('heatmapBtn');

        if (this.heatmapLayer) {
            // Remove heatmap
            if (this.map.getLayer('heatmap-layer')) {
                this.map.removeLayer('heatmap-layer');
            }
            if (this.map.getSource('heatmap-source')) {
                this.map.removeSource('heatmap-source');
            }
            this.heatmapLayer = null;
            btn.textContent = '🔥 Heatmap (Activité)';
        } else {
            // Generate random activity points for demo
            const points = this.generateDemoPoints(100);

            this.map.addSource('heatmap-source', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': points
                }
            });

            this.map.addLayer({
                'id': 'heatmap-layer',
                'type': 'heatmap',
                'source': 'heatmap-source',
                'maxzoom': 15,
                'paint': {
                    'heatmap-weight': [
                        'interpolate',
                        ['linear'],
                        ['get', 'intensity'],
                        0, 0,
                        6, 1
                    ],
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 1,
                        15, 3
                    ],
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(33,102,172,0)',
                        0.2, 'rgb(103,169,207)',
                        0.4, 'rgb(209,229,240)',
                        0.6, 'rgb(253,219,199)',
                        0.8, 'rgb(239,138,98)',
                        1, 'rgb(178,24,43)'
                    ],
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 2,
                        15, 20
                    ],
                    'heatmap-opacity': 0.8
                }
            }, 'waterway-label');

            this.heatmapLayer = true;
            btn.textContent = '❌ Fermer Heatmap';
        }
    }

    addPointsOfInterest() {
        // Generate demo POIs around current location
        const center = this.map.getCenter();
        const pois = this.generateDemoPOIs(50, center);

        if (this.map.getSource('pois')) {
            this.map.removeLayer('poi-clusters');
            this.map.removeLayer('poi-cluster-count');
            this.map.removeLayer('poi-unclustered-point');
            this.map.removeSource('pois');
        }

        this.map.addSource('pois', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: pois
            },
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
        });

        // Clustered circles
        this.map.addLayer({
            id: 'poi-clusters',
            type: 'circle',
            source: 'pois',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#50C878',
                    10,
                    '#4A90E2',
                    30,
                    '#FF6B6B'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    10,
                    30,
                    30,
                    40
                ]
            }
        });

        // Cluster count
        this.map.addLayer({
            id: 'poi-cluster-count',
            type: 'symbol',
            source: 'pois',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            },
            paint: {
                'text-color': '#ffffff'
            }
        });

        // Unclustered points
        this.map.addLayer({
            id: 'poi-unclustered-point',
            type: 'circle',
            source: 'pois',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#4A90E2',
                'circle-radius': 8,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff'
            }
        });

        // Click event for POIs
        this.map.on('click', 'poi-unclustered-point', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const { name, type } = e.features[0].properties;

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(`<h3>${name}</h3><p>Type: ${type}</p>`)
                .addTo(this.map);
        });

        this.map.on('mouseenter', 'poi-clusters', () => {
            this.map.getCanvas().style.cursor = 'pointer';
        });

        this.map.on('mouseleave', 'poi-clusters', () => {
            this.map.getCanvas().style.cursor = '';
        });

        this.showInfo('Points d\'Intérêt', `${pois.length} points ajoutés avec clustering automatique`);
    }

    toggleMeasure() {
        const btn = document.getElementById('measureBtn');

        if (!this.isMeasuring) {
            this.isMeasuring = true;
            btn.textContent = '❌ Arrêter Mesure';
            btn.classList.add('btn-danger');
            this.measurePoints = [];
            this.showInfo('Mode Mesure', 'Cliquez sur la carte pour mesurer les distances');
        } else {
            this.isMeasuring = false;
            btn.textContent = '📏 Mesurer Distance';
            btn.classList.remove('btn-danger');
            this.clearMeasure();
        }
    }

    addMeasurePoint(lngLat) {
        this.measurePoints.push([lngLat.lng, lngLat.lat]);

        // Add marker
        new mapboxgl.Marker({ color: '#FF6B6B' })
            .setLngLat(lngLat)
            .addTo(this.map);

        // Draw line if we have more than one point
        if (this.measurePoints.length > 1) {
            if (!this.map.getSource('measure-line')) {
                this.map.addSource('measure-line', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: this.measurePoints
                        }
                    }
                });

                this.map.addLayer({
                    id: 'measure-line-layer',
                    type: 'line',
                    source: 'measure-line',
                    paint: {
                        'line-color': '#FF6B6B',
                        'line-width': 3,
                        'line-dasharray': [2, 2]
                    }
                });
            } else {
                this.map.getSource('measure-line').setData({
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: this.measurePoints
                    }
                });
            }

            // Calculate total distance
            let totalDist = 0;
            for (let i = 1; i < this.measurePoints.length; i++) {
                totalDist += this.calculateDistance(
                    this.measurePoints[i - 1][1], this.measurePoints[i - 1][0],
                    this.measurePoints[i][1], this.measurePoints[i][0]
                );
            }

            this.showInfo('Distance Mesurée', `
                <p>Points: ${this.measurePoints.length}</p>
                <p><strong>Distance totale: ${totalDist.toFixed(2)} km</strong></p>
            `);
        }
    }

    clearMeasure() {
        this.measurePoints = [];

        if (this.map.getLayer('measure-line-layer')) {
            this.map.removeLayer('measure-line-layer');
        }
        if (this.map.getSource('measure-line')) {
            this.map.removeSource('measure-line');
        }
    }

    // ==========================================
    // CHART & STATISTICS
    // ==========================================

    initChart() {
        const ctx = document.getElementById('statsChart').getContext('2d');

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Vitesse (km/h)',
                    data: [],
                    borderColor: '#4A90E2',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#a0a0a0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#a0a0a0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateChart(speed) {
        const now = new Date().toLocaleTimeString();

        this.stats.speedHistory.push(speed);
        this.stats.timestamps.push(now);

        // Keep only last 20 points
        if (this.stats.speedHistory.length > 20) {
            this.stats.speedHistory.shift();
            this.stats.timestamps.shift();
        }

        this.chart.data.labels = this.stats.timestamps;
        this.chart.data.datasets[0].data = this.stats.speedHistory;
        this.chart.update('none');
    }

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================

    calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    generateDemoPoints(count) {
        const center = this.map.getCenter();
        const points = [];

        for (let i = 0; i < count; i++) {
            const offsetLat = (Math.random() - 0.5) * 0.1;
            const offsetLng = (Math.random() - 0.5) * 0.1;

            points.push({
                type: 'Feature',
                properties: {
                    intensity: Math.floor(Math.random() * 6) + 1
                },
                geometry: {
                    type: 'Point',
                    coordinates: [
                        center.lng + offsetLng,
                        center.lat + offsetLat
                    ]
                }
            });
        }

        return points;
    }

    generateDemoPOIs(count, center) {
        const types = ['Restaurant', 'Café', 'Hôtel', 'Station Service', 'Parc', 'Musée'];
        const pois = [];

        for (let i = 0; i < count; i++) {
            const offsetLat = (Math.random() - 0.5) * 0.05;
            const offsetLng = (Math.random() - 0.5) * 0.05;
            const type = types[Math.floor(Math.random() * types.length)];

            pois.push({
                type: 'Feature',
                properties: {
                    name: `${type} ${i + 1}`,
                    type: type
                },
                geometry: {
                    type: 'Point',
                    coordinates: [
                        center.lng + offsetLng,
                        center.lat + offsetLat
                    ]
                }
            });
        }

        return pois;
    }

    showInfo(title, content) {
        document.getElementById('infoTitle').textContent = title;
        document.getElementById('infoContent').innerHTML = content;
        document.getElementById('infoPanel').classList.add('active');
    }
}

// ==========================================
// INITIALIZE APPLICATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    window.foxwiseGPS = new FoxWiseGPS();
});
