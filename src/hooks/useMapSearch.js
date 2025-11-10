import { useCallback } from 'react';

// Shared hook to provide a memoized handleSearch for the map.
// Supports either a place-name string or an object { isCoordinate, lat, lon }.
export default function useMapSearch({ mapApiRef, setCoords, setSelectedLocation, nominatimUrl }) {
  const handleSearch = useCallback(async (query) => {
    if (!query) return;

    // Coordinate object path
    if (typeof query === 'object' && query.isCoordinate) {
      const { lat, lon } = query;

      if (mapApiRef?.current) {
        mapApiRef.current.setView(lat, lon, 8);
        mapApiRef.current.addMarker(lat, lon, `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
      }

      setCoords?.({ lat: lat.toFixed(6), lng: lon.toFixed(6) });
      setSelectedLocation?.({ lat, lon, name: `${lat.toFixed(4)}, ${lon.toFixed(4)}` });
      return;
    }

    // String path - place name search via Nominatim
    if (typeof query === 'string' && !query.trim()) return;

    try {
      const base = nominatimUrl || import.meta.env.VITE_NOMINATIM_URL;
      const res = await fetch(`${base}${encodeURIComponent(query)}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const location = data[0];
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);

        if (mapApiRef?.current) {
          mapApiRef.current.setView(lat, lon, 6);
          mapApiRef.current.addMarker(lat, lon, location.display_name);
        }

        setCoords?.({ lat: lat.toFixed(6), lng: lon.toFixed(6) });
        setSelectedLocation?.({ lat, lon, name: `${lat.toFixed(4)}, ${lon.toFixed(4)}` });
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  }, [mapApiRef, setCoords, setSelectedLocation, nominatimUrl]);

  return { handleSearch };
}
