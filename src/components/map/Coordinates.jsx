import React from 'react';

export default function Coordinates({ coords }) {
  return (
    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded map-overlay">
      <div>Lat: {coords.lat ?? '—'}</div>
      <div>Lng: {coords.lng ?? '—'}</div>
    </div>
  );
}
