// components/HeatMap.tsx
'use client';

import React, { useEffect } from 'react';
// Only import necessary components for base map
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

// --- Icon fix code removed temporarily as no markers are being rendered ---

// Define map center (Example: Cairo)
const defaultCenter: L.LatLngExpression = [30.0444, 31.2357];
const defaultZoom = 11;

// Component to invalidate map size
function MapResizer() {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => { map.invalidateSize(); }, 100);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
}

const HeatMap = () => {
    // No markers defined for this test
    // const markers: L.LatLngExpression[] = [ ... ];

    return (
        <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', minHeight: '200px', borderRadius: 'inherit', zIndex: 0 }}
            className="map-container"
        >
            <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                maxZoom={19}
            />
            {/* No <Marker> components rendered */}
            <MapResizer />
        </MapContainer>
    );
};

export default HeatMap;