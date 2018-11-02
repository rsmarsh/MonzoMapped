let mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
mapboxgl.accessToken = 'pk.eyJ1IjoicnNtYXJzaCIsImEiOiJjam1pMGhzaXMwMDBvM2tydnZmYnNkN2NxIn0.Ib5AW3RKRxmsHBIjlDVflw';

let map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/streets-v10'
});

