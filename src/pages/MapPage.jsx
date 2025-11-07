import React, { useRef, useState, useCallback } from 'react';
import SendReport from '../components/SendReport.jsx';
import useRequireAuth from '../hooks/useRequireAuth';
import MapContainer from '../components/map/MapContainer.jsx';
import ControlsPanel from '../components/map/ControlsPanel.jsx';
import Coordinates from '../components/map/Coordinates.jsx';
import ImagesModal from '../components/map/ImagesModal.jsx';
import { stitchImages } from '../utils/imageUtils';
import { fetchOrDummy } from '../utils/fetchHelpers';
import '../styles/map.css';

export default function MapPage() {
  const mapApiRef = useRef(null);
  useRequireAuth(); // this itself runs the logic to enforce auth
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [showVessels, setShowVessels] = useState(false);
  const [showDebris, setShowDebris] = useState(false);
  const [imagesModalOpen, setImagesModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sendReportOpen, setSendReportOpen] = useState(false);
  const [combinedArtifact, setCombinedArtifact] = useState(null);
  const [stitching, setStitching] = useState(false);

  const toggleVessels = async (enabled) => {
    setShowVessels(enabled);
    if (!mapApiRef.current) return;
    if (!enabled) {
      mapApiRef.current.clearVessels();
      return;
    }
    const items = await fetchOrDummy('/api/vessels', 12);
    mapApiRef.current.addMarkersToVessels(items);
  };

  const toggleDebris = async (enabled) => {
    setShowDebris(enabled);
    if (!mapApiRef.current) return;
    if (!enabled) {
      mapApiRef.current.clearDebris();
      return;
    }
    const items = await fetchOrDummy('/api/debris', 12);
    mapApiRef.current.addMarkersToDebris(items);
  };

  const handleSearch = async (query) => {
    if (!query) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_NOMINATIM_URL}${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.length > 0) {
        const first = data[0];
        const lat = parseFloat(first.lat);
        const lon = parseFloat(first.lon);
        if (mapApiRef.current) {
          mapApiRef.current.setView(lat, lon, 6);
          mapApiRef.current.addMarker(lat, lon, first.display_name);
        }
        setCoords({ lat: lat.toFixed(6), lng: lon.toFixed(6) });
      } else {
        alert('Location not found');
      }
    } catch (err) {
      console.error('Search failed:', err);
      alert('Search failed');
    }
  };

  const fetchLatestRecord = async () => {
    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL}/api/fetch-images`);
      if (!res.ok) res = await fetch(`${import.meta.env.VITE_API_URL}/api/get-images`);
      if (!res.ok) throw new Error('no-images');
      const data = await res.json();
      const imgs = (data.images || data.records || data.items || []).slice(0, 16).map((it) => it.url || it.image || it.path || it);
      if (!imgs || imgs.length === 0) throw new Error('empty');
      while (imgs.length < 16) imgs.push(`https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/300`);
      setModalImages(imgs.slice(0, 16));
      setImagesModalOpen(true);
    } catch (err) {
      const imgs = Array.from({ length: 16 }).map((_, i) => `https://picsum.photos/seed/fallback${i}/300`);
      setModalImages(imgs);
      setImagesModalOpen(true);
    }
  };

  const handleMapMove = useCallback((p) => {
    setCoords({ lat: p.lat.toFixed(6), lng: p.lng.toFixed(6) });
  }, []);

  return (
    <div className="w-full h-screen relative">
      <MapContainer ref={mapApiRef} onMove={handleMapMove} />

      <ControlsPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        showVessels={showVessels}
        setShowVessels={toggleVessels}
        showDebris={showDebris}
        setShowDebris={toggleDebris}
        onFetchLatest={fetchLatestRecord}
        onReset={() => mapApiRef.current && mapApiRef.current.setView(20, 0, 2)}
      />

      <Coordinates coords={coords} />

      <ImagesModal
        open={imagesModalOpen}
        images={modalImages}
        stitching={stitching}
        onClose={() => setImagesModalOpen(false)}
        onSend={async () => {
          setStitching(true);
          try {
            const blob = await stitchImages(modalImages, 300, 4, 4);
            const file = new File([blob], `latest-record-${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
            setCombinedArtifact({ debrisOriginal: file });
            setImagesModalOpen(false);
            setSendReportOpen(true);
          } catch (e) {
            console.error('Stitch failed', e);
            setCombinedArtifact(null);
            setImagesModalOpen(false);
            setSendReportOpen(true);
          } finally {
            setStitching(false);
          }
        }}
      />

      <SendReport open={sendReportOpen} onClose={() => setSendReportOpen(false)} artifacts={combinedArtifact || {}} attachHints={[]} record={null} />
    </div>
  );
}
