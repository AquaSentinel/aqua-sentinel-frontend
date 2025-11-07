import React from 'react';
import { motion } from 'framer-motion';

export default function FiltersPanel({ filters, setFilters, onFetchImages }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-5 left-5 bg-gray-800/80 p-5 rounded-2xl shadow-lg w-80"
    >
      <h2 className="text-xl font-bold mb-3">AquaSentinel Filters</h2>

      <div className="space-y-3">
        <label className="flex justify-between items-center">
          <span>Area (km²)</span>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.area[1]}
            onChange={(e) => setFilters({ ...filters, area: [0, parseInt(e.target.value, 10)] })}
            className="w-32"
          />
        </label>

        <label className="flex justify-between items-center">
          <span>Dark Vessels</span>
          <input
            type="checkbox"
            checked={filters.darkVessels}
            onChange={(e) => setFilters({ ...filters, darkVessels: e.target.checked })}
          />
        </label>

        <label className="flex justify-between items-center">
          <span>Oil/Gas Nearby</span>
          <input
            type="checkbox"
            checked={filters.oilGasNearby}
            onChange={(e) => setFilters({ ...filters, oilGasNearby: e.target.checked })}
          />
        </label>

        <label className="flex justify-between items-center">
          <span>No Sources</span>
          <input
            type="checkbox"
            checked={filters.noSources}
            onChange={(e) => setFilters({ ...filters, noSources: e.target.checked })}
          />
        </label>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onFetchImages}
        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-md"
      >
        Click Me
      </motion.button>
    </motion.div>
  );
}
