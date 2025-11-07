import React from 'react';
import ActionLoader from '../../components/ActionLoader.jsx';

export default function ImagesModal({ open, images, stitching, onClose, onSend }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-[90vw] max-h-[90vh] overflow-auto p-0">
        <div className="flex justify-between items-center p-4">
          <h4 className="text-lg font-semibold">Latest Satellite Images</h4>
          <div className="flex items-center gap-2">
            <button className={`px-3 py-1 rounded text-white ${stitching ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'}`} onClick={onSend} disabled={stitching}>
              {stitching ? 'Preparing…' : 'Send Report'}
            </button>
            <button className={`px-3 py-1 rounded ${stitching ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-300'}`} onClick={() => !stitching && onClose()} disabled={stitching}>
              Close
            </button>
          </div>
        </div>

        <div className="relative">
          {stitching && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
              <ActionLoader status="loading" label="Preparing report…" />
            </div>
          )}
          <div className="grid grid-cols-4 gap-0">
            {images.map((src, i) => (
              <img key={i} src={src} alt={`record-${i}`} className="w-full h-[22vh] object-cover" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
