import React from 'react';

export default function ControlsPanel({ searchQuery, setSearchQuery, onSearch, showVessels, setShowVessels, showDebris, setShowDebris, onFetchLatest, onReset }) {
  return (
    <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg w-80 map-overlay">
      <h3 className="font-semibold mb-2">Interactive Map</h3>
      <div className="flex gap-2 mb-2">
        <input
          id="map-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search country or place"
          className="flex-1 p-2 rounded text-black"
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch && onSearch(searchQuery);
          }}
        />
        <button className="bg-blue-600 px-3 rounded" onClick={() => onSearch && onSearch(searchQuery)}>
          Go
        </button>
      </div>

      <div className="mb-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showVessels} onChange={(e) => setShowVessels(e.target.checked)} />
          Show Vessels
        </label>
        <label className="flex items-center gap-2 mt-2">
          <input type="checkbox" checked={showDebris} onChange={(e) => setShowDebris(e.target.checked)} />
          Show Marine Debris
        </label>
      </div>

      <div className="flex gap-2">
        <button className="bg-green-600 px-3 py-1 rounded" onClick={onFetchLatest}>Fetch latest images</button>
        <button className="bg-gray-700 px-3 py-1 rounded" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}
