import React from 'react';
import { motion } from 'framer-motion';

export default function ImageStrip({ images }) {
  if (!images || images.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-xl p-4 grid grid-cols-3 gap-3 w-[90%] max-w-5xl"
    >
      {images.map((img, i) => (
        <img key={i} src={img.url || img} alt={`Aqua Image ${i}`} className="rounded-lg w-full h-32 object-cover shadow" />
      ))}
    </motion.div>
  );
}
