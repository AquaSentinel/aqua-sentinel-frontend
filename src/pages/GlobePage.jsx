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

  const handleSearch = async () => {
    const query = prompt('Enter Country or Ocean name:');
    if (!query) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_NOMINATIM_URL}${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.length > 0) {
        setTimeout(() => setShowMap(true), 2000);
      } else {
        alert('Location not found');
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
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
