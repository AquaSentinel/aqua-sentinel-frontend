import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapContainer = forwardRef(function MapContainer({ onMove: onMoveCallback }, ref) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const vesselsLayerRef = useRef(null);
  const debrisLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current).setView([20, 0], 2);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    const handleMove = (e) => {
      onMoveCallback && onMoveCallback({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    map.on('mousemove', handleMove);

    vesselsLayerRef.current = L.layerGroup().addTo(map);
    debrisLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.off('mousemove', handleMove);
      vesselsLayerRef.current && vesselsLayerRef.current.clearLayers();
      debrisLayerRef.current && debrisLayerRef.current.clearLayers();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onMoveCallback]);

  useImperativeHandle(ref, () => ({
    setView: (lat, lng, zoom = 6) => {
      const map = mapInstanceRef.current;
      if (map) map.setView([lat, lng], zoom);
    },
    addMarker: (lat, lng, popup) => {
      const map = mapInstanceRef.current;
      if (map) L.marker([lat, lng]).addTo(map).bindPopup(popup || '').openPopup();
    },
    addMarkersToVessels: (items) => {
      const layer = vesselsLayerRef.current;
      if (!layer) return;
      layer.clearLayers();
      items.forEach((it) => layer.addLayer(L.marker([it.lat, it.lng])));
    },
    addMarkersToDebris: (items) => {
      const layer = debrisLayerRef.current;
      if (!layer) return;
      layer.clearLayers();
      items.forEach((it) => layer.addLayer(L.marker([it.lat, it.lng])));
    },
    clearVessels: () => vesselsLayerRef.current && vesselsLayerRef.current.clearLayers(),
    clearDebris: () => debrisLayerRef.current && debrisLayerRef.current.clearLayers(),
    getCenter: () => mapInstanceRef.current && mapInstanceRef.current.getCenter(),
  }));

  return <div ref={mapRef} id="map" style={{ height: '100%', width: '100%' }} />;
});

export default MapContainer;
