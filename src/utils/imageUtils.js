export async function stitchImages(urls = [], tileSize = 300, cols = 4, rows = 4) {
  const total = cols * rows;
  const imgs = urls.slice(0, total).concat(Array.from({ length: Math.max(0, total - urls.length) }).map((_, i) => `https://picsum.photos/seed/stub${i}/300`));

  const canvas = document.createElement('canvas');
  canvas.width = cols * tileSize;
  canvas.height = rows * tileSize;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < total; i++) {
    const url = imgs[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * tileSize;
    const y = row * tileSize;
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error('fetch failed');
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);
      ctx.drawImage(bitmap, x, y, tileSize, tileSize);
      bitmap.close && bitmap.close();
    } catch (e) {
      ctx.fillStyle = '#222';
      ctx.fillRect(x, y, tileSize, tileSize);
      ctx.fillStyle = '#666';
      ctx.fillRect(x + 4, y + 4, tileSize - 8, tileSize - 8);
    }
  }

  return await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92);
  });
}
