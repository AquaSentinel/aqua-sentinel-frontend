export async function fetchOrDummy(url, fallbackCount = 8) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('bad');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    if (data.items && Array.isArray(data.items) && data.items.length) return data.items;
    if (data.records && Array.isArray(data.records) && data.records.length) return data.records;
    return createRandomMarkers(fallbackCount);
  } catch (err) {
    return createRandomMarkers(fallbackCount);
  }
}

function createRandomMarkers(count = 8) {
  // create placeholder markers near [0,0]
  const markers = [];
  for (let i = 0; i < count; i++) {
    const lat = (Math.random() - 0.5) * 40;
    const lng = (Math.random() - 0.5) * 80;
    markers.push({ lat, lng, label: `Demo ${i + 1}` });
  }
  return markers;
}
