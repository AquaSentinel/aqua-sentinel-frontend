import { useEffect, useRef } from 'react';

// On mount, parse URL params and trigger a one-time search on the map page.
// Supports either `?search=Hyderabad` or `?lat=17.3&lon=78.5`.
export default function SearchBootstrap({ onSearch, setSearchQuery }) {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return; // guard against double-invoke in StrictMode
    ranRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const s = params.get('search');
    const lat = params.get('lat');
    const lon = params.get('lon');

    if (lat && lon) {
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      if (!Number.isNaN(latNum) && !Number.isNaN(lonNum)) {
        onSearch && onSearch({ isCoordinate: true, lat: latNum, lon: lonNum });
        // Do not alter input value for coordinates
      }
      // Optionally clean the URL
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('lat');
        url.searchParams.delete('lon');
        window.history.replaceState({}, '', url);
      } catch {}
      return;
    }

    if (s && s.trim()) {
      setSearchQuery && setSearchQuery(s);
      onSearch && onSearch(s);
      // Clean the URL to avoid re-trigger when reloading
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('search');
        window.history.replaceState({}, '', url);
      } catch {}
    }
  }, [onSearch, setSearchQuery]);

  return null;
}
