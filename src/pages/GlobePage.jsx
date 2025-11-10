import React, { useState } from 'react';
import Nebula from '../components/globe/Nebula.jsx';
import Starfield from '../components/globe/Starfield.jsx';
import GlobeCanvas from '../components/globe/GlobeCanvas.jsx';
import FiltersPanel from '../components/globe/FiltersPanel.jsx';
import ImageStrip from '../components/globe/ImageStrip.jsx';
import useRequireAuth from '../hooks/useRequireAuth';
import '../styles/globe.css';

export default function GlobePage() {
  const [showMap, setShowMap] = useState(false);
  const [images, setImages] = useState([]);
  const { loggedInUser, emailId } = useRequireAuth();
  const [filters, setFilters] = useState({ area: [0, 100], darkVessels: false, oilGasNearby: true, noSources: false });

  // Parse inputs like:
  // - "20.2802, 38.5126"
  // - "20.2802 38.5126"
  // - "20.2802° N, 38.5126° E"
  // - "38.5126°E 20.2802°N" (order-insensitive when cardinal letters present)
  function parseCoordinatePair(input) {
    if (!input) return null;
    let s = String(input).trim();
    // Normalize: remove degree symbol and non-breaking spaces
    s = s.replace(/[°º]/g, '').replace(/\s+/g, ' ').trim();

    // Split by comma or semicolon first, else fallback to whitespace
    let parts = s.split(/[;,]/).map(p => p.trim()).filter(Boolean);
    if (parts.length < 2) {
      parts = s.split(/\s+/).filter(Boolean);
    }
    if (parts.length < 2) return null;

    const parseToken = (t) => {
      // Matches number with optional sign and optional trailing/leading cardinal
      // e.g. "20.28N", "N20.28", "+20.28", "-20.28"
      const m = t.match(/^\s*([NnSsEeWw])?\s*([+-]?\d+(?:\.\d+)?)\s*([NnSsEeWw])?\s*$/);
      if (!m) return null;
      const lead = m[1];
      const numStr = m[2];
      const trail = m[3];
      let val = parseFloat(numStr);
      const dir = (trail || lead || '').toUpperCase();
      let axis = null; // 'lat' | 'lon' | null
      if (dir === 'N' || dir === 'S') axis = 'lat';
      if (dir === 'E' || dir === 'W') axis = 'lon';
      if (dir === 'S' || dir === 'W') val = -Math.abs(val);
      return { val, axis };
    };

    const t1 = parseToken(parts[0]);
    const t2 = parseToken(parts[1]);
    if (!t1 || !t2) return null;

    let lat = null, lon = null;
    // If axis indicated, use it; otherwise infer by order
    if (t1.axis === 'lat') lat = t1.val;
    if (t1.axis === 'lon') lon = t1.val;
    if (t2.axis === 'lat') lat = t2.val;
    if (t2.axis === 'lon') lon = t2.val;

    if (lat === null && lon === null) {
      // No axis hints; assume order: lat, lon
      lat = t1.val;
      lon = t2.val;
    } else if (lat === null) {
      // One axis known; assign the other
      lat = (t1.axis ? t2.val : t1.val);
    } else if (lon === null) {
      lon = (t1.axis ? t2.val : t1.val);
    }

    // Basic sanity clamps
    if (lat < -90 || lat > 90) return null;
    if (lon < -180 || lon > 180) return null;
    return { lat, lon };
  }

  const handleSearch = () => {
    const query = prompt('Enter country/ocean or coordinates (lat,lon):');
    if (!query) return;

    const trimmed = query.trim();
    // Robust coordinate parsing, including degree symbol and N/S/E/W
    const parsed = parseCoordinatePair(trimmed);
    if (parsed) {
      const { lat, lon } = parsed;
      window.location.href = `/mapview?lat=${lat}&lon=${lon}`;
      return;
    }

    // Fallback to place-name search handled by MapPage bootstrap
    window.location.href = `/mapview?search=${encodeURIComponent(trimmed)}`;
  };

  const handleFetchImages = async () => {
    try {
      const response = await fetch('/api/get-images');
      const data = await response.json();
      setImages(data.images || []);
    } catch (err) {
      console.error('Image fetch failed:', err);
    }
  };

  const handleNavigateToMap = () => {
    window.location.href = '/mapview';
  };

  if (!showMap) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <GlobeCanvas />
        <button onClick={handleSearch} className="absolute top-6 left-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg">Search Country / Ocean</button>
        <button onClick={handleNavigateToMap} className="absolute top-6 right-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg">Go to Map</button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0">
        <img src={import.meta.env.VITE_WORLD_MAP_URL} alt="World Map" className="w-full h-full object-cover opacity-90" />
      </div>

      <Nebula />
      <Starfield />

      <FiltersPanel filters={filters} setFilters={setFilters} onFetchImages={handleFetchImages} />

      <ImageStrip images={images} />
    </div>
  );
}
