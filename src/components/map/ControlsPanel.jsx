import React from 'react';

export default function ControlsPanel({
  searchQuery,
  setSearchQuery,
  onSearch,
  detectionMode,
  setDetectionMode,
  onFetchLatest,
  onReset,
  monitoring,
  selectedLocation
}) {

  const parseCoordinates = (input) => {
    const coords = input.trim().split(',');
    if (coords.length === 2) {
      const lat = parseFloat(coords[0].trim());
      const lon = parseFloat(coords[1].trim());

      if (!isNaN(lat) && !isNaN(lon) &&
        lat >= -90 && lat <= 90 &&
        lon >= -180 && lon <= 180) {
        return { lat, lon, isCoordinate: true };
      }
    }
    return null;
  };

  const handleSearchSubmit = () => {
    const query = searchQuery?.trim();
    if (!query) return;

    // Check if it's coordinates
    const coordinates = parseCoordinates(query);
    if (coordinates) {
      onSearch(coordinates);
      return;
    }

    // Regular location search
    onSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <div className="absolute top-30 left-4 bg-gray-900/85 text-white p-4 rounded-lg w-80 border border-gray-600">
      <h3 className="font-semibold mb-2">🛰️ AquaSentinel Map</h3>

      {selectedLocation && (
        <div className="mb-2 text-sm bg-blue-900/50 p-2 rounded">
          📍 Selected: {selectedLocation.name}
        </div>
      )}

      <div className="flex gap-2 mb-2">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="City name or lat,lon (e.g. 15.0,-85.0)"
          className="flex-1 p-2 rounded bg-gray-800 text-white placeholder-gray-400"
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 px-3 rounded"
          onClick={handleSearchSubmit}
        >
          Go
        </button>
      </div>

      <div className="mb-2">
        <div className="text-sm mb-1">Detection Mode:</div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="detectionView"
            checked={detectionMode === 'none'}
            onChange={() => setDetectionMode('none')}
          />
          🗺️ Map View Only
        </label>
        <label className="flex items-center gap-2 mt-1 cursor-pointer">
          <input
            type="radio"
            name="detectionView"
            checked={detectionMode === 'vessels'}
            onChange={() => setDetectionMode('vessels')}
          />
          🚢 Ship Overlay
        </label>
        <label className="flex items-center gap-2 mt-1 cursor-pointer">
          <input
            type="radio"
            name="detectionView"
            checked={detectionMode === 'debris'}
            onChange={() => setDetectionMode('debris')}
          />
          🗑️ Debris Overlay
        </label>
      </div>

      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded text-sm ${monitoring || !selectedLocation ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          onClick={onFetchLatest}
          disabled={monitoring || !selectedLocation}
        >
          {monitoring ? '🔄 Loading Time Series...' : '🛰️ Time Series'}
        </button>
        <button
          className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
