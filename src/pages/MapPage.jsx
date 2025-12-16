import React, { useRef, useState, useEffect, useCallback } from 'react';
import useRequireAuth from '../hooks/useRequireAuth';
import MapContainer from '../components/map/MapContainer.jsx';
import ControlsPanel from '../components/map/ControlsPanel.jsx';
import Coordinates from '../components/map/Coordinates.jsx';
import SearchBootstrap from '../components/map/SearchBootstrap.jsx';
import MyNavBar from "../components/MyNavBar";
import TimeSeriesPanel from '../components/map/TimeSeriesPanel.jsx';
import { apiUrl } from "../lib/api";

import '../styles/map.css';
import useMapSearch from '../hooks/useMapSearch.js';

export default function MapPage() {
  const mapApiRef = useRef(null);
  const { loggedInUser, emailId } = useRequireAuth(); // just to enforce auth


  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [searchQuery, setSearchQuery] = useState('');


  const [detectionMode, setDetectionMode] = useState('none');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [monitoring, setMonitoring] = useState(false);
  const [alertImageModal, setAlertImageModal] = useState(null);
  const [accumulatedAlerts, setAccumulatedAlerts] = useState(() => {

    const stored = localStorage.getItem('aqua-sentinel-alerts');
    return stored ? JSON.parse(stored) : [];
  });

  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  const satelliteData = timeSeriesData[currentTimeIndex] || null;

  useEffect(() => {
    if (mapApiRef.current) {
      mapApiRef.current.clearAlerts();
      if (accumulatedAlerts.length > 0) {
        mapApiRef.current.addMarkersToAlerts(accumulatedAlerts);
      }
    }
  }, [accumulatedAlerts]);

  useEffect(() => {
    if (!mapApiRef.current || !satelliteData) return;

    if (detectionMode !== 'none') {
      const overlayType = detectionMode === 'ships' ? 'ships' :(detectionMode==='distance')?'distance' :'debris';
      const overlays = createImageOverlays(satelliteData, overlayType);
      mapApiRef.current.setImageOverlays(overlays);
      mapApiRef.current.toggleOverlays(true);
    } else {
      mapApiRef.current.toggleOverlays(false);
    }
  }, [detectionMode, satelliteData]);

  const setDetectionType = (type) => {
    setDetectionMode(type);
    if (!mapApiRef.current) return;

    mapApiRef.current.clearVessels();
    mapApiRef.current.clearDebris();
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(apiUrl("/api/logout"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const result = await response.json();
      if (result.success) {
        localStorage.clear(); // clear all
        setLoggedInUser("");  // update UI state
        navigate("/login", { replace: true }); // immediate navigation
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const { handleSearch } = useMapSearch({
    mapApiRef,
    setCoords,
    setSelectedLocation,
    nominatimUrl: import.meta.env.VITE_NOMINATIM_URL
  });

  const fetchSatelliteData = async () => {
    if (!selectedLocation?.lat || !selectedLocation?.lon) {
      console.error('No valid location selected - missing lat/lon properties:', selectedLocation);
      return;
    }

    setMonitoring(true);
    setTimeSeriesData([]);
    setCurrentTimeIndex(0);

    const timestamps = [
      [
        "2024-11-08-15-30-00",
        "2024-11-08-16-00-00",
        "2024-11-08-16-30-00"],
      ["2025-02-08-15-30-00",
        "2025-02-08-16-00-00",
        "2025-02-08-16-30-00"],
      ["2025-08-08-15-30-00",
        "2025-08-08-16-00-00",
        "2025-08-08-16-30-00"],
      ["2025-11-08-15-30-00",
        "2025-11-08-16-00-00",
        "2025-11-08-16-30-00"]
    ];

    const params = new URLSearchParams({
      baseLat: selectedLocation.lat.toString(),
      baseLon: selectedLocation.lon.toString()
    });

    try {
      const timeSeriesResults = [];

      const randBit = () => Math.floor(Math.random() * 4);
      // const dataset_no = randBit();// 0 to 3 // random dataset for demo
      const dataset_no=3; // for testing fixed dataset 
      console.log("Selected dataset no:", dataset_no);
      for (let i = 0; i < timestamps[0].length; i++) {

        const timestamp = timestamps[dataset_no][i];

        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 10000));
        }

        try {
          // Add isInitial parameter - true for first timestamp, false for others
          const isInitial = i === 0;
          params.set('isInitial', isInitial.toString());

          const response = await fetch(`${API_BASE}/api/process/${timestamp}?${params}`);
          const data = response.ok
            ? await response.json()
            : { timestamp, patches: [], alerts: [] };

          timeSeriesResults.push(data);
          setTimeSeriesData([...timeSeriesResults]);
          setCurrentTimeIndex(i);

          if (mapApiRef.current && data?.patches) {
            const alertPatches = data.patches.filter(p => p.detections?.is_alert);

            if (alertPatches.length > 0) {
              const newAlertMarkers = alertPatches.map(p => ({
                lat: p.coordinates.latitude,
                lng: p.coordinates.longitude,
                timestamp: data.timestamp,
                patch: p,
                baseLocationLat: selectedLocation.lat,
                baseLocationLon: selectedLocation.lon,
                detectedAt: new Date().toISOString()
              }));

              setAccumulatedAlerts(prevAlerts => {
                const updatedAlerts = [...prevAlerts, ...newAlertMarkers];
                localStorage.setItem('aqua-sentinel-alerts', JSON.stringify(updatedAlerts));
                return updatedAlerts;
              });


            }
          }

        } catch (fetchError) {
          console.error(`Error for timestamp ${timestamp}:`, fetchError);
          timeSeriesResults.push({ timestamp, patches: [], alerts: [] });
          setTimeSeriesData([...timeSeriesResults]);
        }
      }

    } catch (error) {
      console.error('Time series failed:', error);
    } finally {
      setMonitoring(false);
    }
  };

  const createImageOverlays = useCallback((satelliteData, overlayType = 'ships') => {
    if (!satelliteData?.patches) return [];

    const LAT_STEP = 0.017297;
    const LON_STEP = 0.017297;

    return satelliteData.patches.map((patch) => {
      const { coordinates, patch_id } = patch;
      const { latitude: lat, longitude: lon } = coordinates;

      const bounds = [
        [lat - LAT_STEP / 2, lon - LON_STEP / 2],
        [lat + LAT_STEP / 2, lon + LON_STEP / 2]
      ];

      const imageSrc = overlayType === 'debris'
        ? `${API_BASE}/api/view/${satelliteData.timestamp}/debris/${lat}/${lon}`
        : (overlayType === 'ships')? `${API_BASE}/api/view/${satelliteData.timestamp}/ship/${lat}/${lon}`
        :`${API_BASE}/api/view/${satelliteData.timestamp}/distance/${lat}/${lon}`;

      return {
        key: `overlay-${patch_id}`,
        url: imageSrc,
        bounds,
        opacity: 1.0
      };
    });
  }, [API_BASE]);

  const fetchLatestRecord = async () => {
    if (selectedLocation) {
      await fetchSatelliteData();
    }
  };

  const handleMapMove = useCallback((p) => {
    setCoords({ lat: p.lat.toFixed(6), lng: p.lng.toFixed(6) });
  }, []);

  const handleMapClick = useCallback((p) => {
    const lat = parseFloat(p.lat.toFixed(6));
    const lon = parseFloat(p.lng.toFixed(6));

    if (mapApiRef.current) {
      mapApiRef.current.addMarker(lat, lon, `Location: ${lat}, ${lon}`);
    }

    setSelectedLocation({ lat, lon, name: `${lat}, ${lon}` });
    setCoords({ lat: lat.toFixed(6), lng: p.lng.toFixed(6) });
  }, []);

  const handleAlertClick = useCallback((alertData) => {
    const { lat, lng, timestamp, detectedAt } = alertData;
    const shipImage = `${API_BASE}/api/view/${timestamp}/ship/${lat}/${lng}`;
    const debrisImage = `${API_BASE}/api/view/${timestamp}/debris/${lat}/${lng}`;
    const distanceImage = `${API_BASE}/api/view/${timestamp}/distance/${lat}/${lng}`;

    setAlertImageModal({
      lat,
      lng,
      timestamp,
      detectedAt,
      shipImage,
      debrisImage,
      distanceImage
    });
  }, []);

  const handleReset = useCallback(() => {
    if (mapApiRef.current) {
      mapApiRef.current.setView(20, 0, 2);
      mapApiRef.current.clearVessels();
      mapApiRef.current.clearDebris();
      mapApiRef.current.clearAlerts();
      mapApiRef.current.clearMarkers();
      mapApiRef.current.clearOverlays();
      mapApiRef.current.toggleOverlays(false);
    }

    setSelectedLocation(null);
    setTimeSeriesData([]);
    setCurrentTimeIndex(0);
    setDetectionMode('none');
    setCoords({ lat: null, lng: null });
    setSearchQuery('');
    setAlertImageModal(null);
    setAccumulatedAlerts([]);
    localStorage.removeItem('aqua-sentinel-alerts');

  }, []);





  return (
    <div className="w-full h-screen relative">
      <MyNavBar loggedInUser={loggedInUser} onLogout={handleLogout} />

      <SearchBootstrap onSearch={handleSearch} setSearchQuery={setSearchQuery} />
      <MapContainer ref={mapApiRef} onMove={handleMapMove} onClick={handleMapClick} onAlertClick={handleAlertClick} />

      <ControlsPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        detectionMode={detectionMode}
        setDetectionMode={setDetectionType}
        onFetchLatest={fetchLatestRecord}
        onReset={handleReset}
        monitoring={monitoring}
        selectedLocation={selectedLocation}
      />

      <Coordinates coords={coords} />



      {alertImageModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">🚨 Alert Detection</h3>
              <button
                onClick={() => setAlertImageModal(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Location: {alertImageModal.lat.toFixed(4)}, {alertImageModal.lng.toFixed(4)}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Alert from: {alertImageModal.timestamp}
              {alertImageModal.detectedAt && (
                <span className="block">Detected: {new Date(alertImageModal.detectedAt).toLocaleString()}</span>
              )}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs font-medium mb-1">🚢 Ship Detection</p>
                <img
                  src={alertImageModal.shipImage}
                  alt="Ship detection"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
              <div>
                <p className="text-xs font-medium mb-1">🗑️ Debris Detection</p>
                <img
                  src={alertImageModal.debrisImage}
                  alt="Debris detection"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
              <div>
                <p className="text-xs font-medium mb-1">📏 Distance Detection</p>
                <img
                  src={alertImageModal.distanceImage}
                  alt="Distance detection"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {timeSeriesData.length > 0 && (
        <>
          <TimeSeriesPanel
            timeSeriesData={timeSeriesData}
            currentTimeIndex={currentTimeIndex}
            setCurrentTimeIndex={setCurrentTimeIndex}
            gridType="ships"
            position="top-right"
          />
          <TimeSeriesPanel
            timeSeriesData={timeSeriesData}
            currentTimeIndex={currentTimeIndex}
            setCurrentTimeIndex={setCurrentTimeIndex}
            gridType="debris"
            position="bottom-right"
          />
          <TimeSeriesPanel
            timeSeriesData={timeSeriesData}
            currentTimeIndex={currentTimeIndex}
            setCurrentTimeIndex={setCurrentTimeIndex}
            gridType="distance"
            position="center-right"
          />
        </>
      )}
    </div>
  );
}

