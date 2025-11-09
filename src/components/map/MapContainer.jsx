import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, LayerGroup, Popup, ImageOverlay, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom alert icon for markers with both ship and debris
const alertIcon = new L.DivIcon({
  html: '<div style="background-color: #dc2626; border: 3px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🚨</div>',
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// Component to handle map events
function MapEventHandler({ onMove, onClick }) {
  useMapEvents({
    mousemove(e) {
      onMove && onMove({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    click(e) {
      onClick && onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// Component to expose map instance for imperative operations
function MapController({ mapRef }) {
  const map = useMap();

  React.useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  return null;
}

const MapContainer = forwardRef(function MapContainer({ onMove: onMoveCallback, onClick: onClickCallback, onAlertClick }, ref) {
  const mapInstanceRef = useRef(null);
  const [vesselMarkers, setVesselMarkers] = useState([]);
  const [debrisMarkers, setDebrisMarkers] = useState([]);
  const [alertMarkers, setAlertMarkers] = useState([]);
  const [singleMarker, setSingleMarker] = useState(null);
  const [imageOverlays, setImageOverlays] = useState([]);
  const [showOverlays, setShowOverlays] = useState(false);

  useImperativeHandle(ref, () => ({
    setView: (lat, lng, zoom = 6) => {
      const map = mapInstanceRef.current;
      if (map) map.setView([lat, lng], zoom);
    },
    addMarker: (lat, lng, popup) => {
      setSingleMarker({ lat, lng, popup: popup || '' });
    },
    addMarkersToVessels: (items) => {
      setVesselMarkers(items.map((item, index) => ({
        ...item,
        key: `vessel-${index}`,
      })));
    },
    addMarkersToDebris: (items) => {
      setDebrisMarkers(items.map((item, index) => ({
        ...item,
        key: `debris-${index}`,
      })));
    },
    addMarkersToAlerts: (items) => {
      setAlertMarkers(items.map((item, index) => ({
        ...item,
        key: `alert-${index}`,
      })));
    },
    clearVessels: () => setVesselMarkers([]),
    clearDebris: () => setDebrisMarkers([]),
    clearAlerts: () => setAlertMarkers([]),
    clearMarkers: () => setSingleMarker(null),
    setImageOverlays: (overlays) => setImageOverlays(overlays),
    toggleOverlays: (enabled) => setShowOverlays(enabled),
    clearOverlays: () => setImageOverlays([]),
    getCenter: () => mapInstanceRef.current && mapInstanceRef.current.getCenter(),
  }));

  return (
    <LeafletMapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      id="map"
    >
      <MapController mapRef={mapInstanceRef} />
      <MapEventHandler onMove={onMoveCallback} onClick={onClickCallback} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      {/* Single marker (for search results) */}
      {singleMarker && (
        <Marker
          position={[singleMarker.lat, singleMarker.lng]}
        >
          {singleMarker.popup && (
            <Popup autoOpen>
              {singleMarker.popup}
            </Popup>
          )}
        </Marker>
      )}

      {/* Vessel markers */}
      <LayerGroup>
        {vesselMarkers.map((vessel) => (
          <Marker
            key={vessel.key}
            position={[vessel.lat, vessel.lng]}
          />
        ))}
      </LayerGroup>

      {/* Debris markers */}
      <LayerGroup>
        {debrisMarkers.map((debris) => (
          <Marker
            key={debris.key}
            position={[debris.lat, debris.lng]}
          />
        ))}
      </LayerGroup>

      {/* Alert markers (both ship and debris detected) */}
      <LayerGroup>
        {alertMarkers.map((alert) => (
          <Marker
            key={alert.key}
            position={[alert.lat, alert.lng]}
            icon={alertIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>🚨 ALERT</strong><br />
                Ships & Debris Detected<br />
                <small>{alert.lat}, {alert.lng}</small>
                {onAlertClick && (
                  <div className="mt-2">
                    <button
                      onClick={() => onAlertClick(alert)}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      View Images
                    </button>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </LayerGroup>

      {/* Satellite Image Overlays */}
      {showOverlays && (
        <LayerGroup>
          {imageOverlays.map((overlay) => (
            <ImageOverlay
              key={overlay.key}
              url={overlay.url}
              bounds={overlay.bounds}
              opacity={overlay.opacity || 0.7}
            />
          ))}
        </LayerGroup>
      )}
    </LeafletMapContainer>
  );
});

export default MapContainer;
