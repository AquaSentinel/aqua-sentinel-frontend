import React from 'react';

export default function TimeSeriesPanel({
    timeSeriesData,
    currentTimeIndex,
    setCurrentTimeIndex,
    gridType,
    position = 'top-right'
}) {
    const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    if (!timeSeriesData?.length) return null;

    const currentData = timeSeriesData[currentTimeIndex];
    if (!currentData?.patches) return null;

    const positionClass = position === 'bottom-right' ? 'absolute bottom-4 right-4' : position === 'center-right'?'absolute bottom-80 right-4': 'absolute top-4 right-4';

    const renderGrid = () => {
        const gridRows = [];
        for (let gridRow = 0; gridRow < 4; gridRow++) {
            const gridCols = [];
            for (let gridCol = 0; gridCol < 4; gridCol++) {
                const patchIndex = gridRow * 4 + gridCol;
                const patch = currentData.patches[patchIndex];

                if (!patch) {
                    gridCols.push(
                        <div key={`missing-${patchIndex}`} className="w-12 h-12 bg-gray-200">
                        </div>
                    );
                    continue;
                }

                const { patch_id, coordinates } = patch;
                const { latitude: lat, longitude: lon } = coordinates;
                const timestamp = currentData.timestamp;

                const imageSrc = gridType === 'debris'
                    ? `${API_BASE}/api/view/${timestamp}/debris/${lat}/${lon}`
                    : gridType === 'ships'?`${API_BASE}/api/view/${timestamp}/ship/${lat}/${lon}`:`${API_BASE}/api/view/${timestamp}/distance/${lat}/${lon}`;

                gridCols.push(
                    <div key={patch_id} className="w-12 h-12">
                        <img
                            src={imageSrc}
                            alt={`Satellite ${patch_id}`}
                            className="w-full h-full object-cover block"
                        />
                    </div>
                );
            }

            gridRows.push(
                <div key={gridRow} className="flex">
                    {gridCols}
                </div>
            );
        }

        return <div className="flex flex-col">{gridRows}</div>;
    };

    return (
        <div className={`${positionClass} bg-black/80 text-white p-3 rounded-lg border border-gray-600 z-50`}>
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold">
                    {gridType === 'debris' ? '🗑️ Debris' :gridType==='ships' ?'🚢 Ship':'Combined'} Timeline
                </h4>
                <div className="flex items-center gap-1">
                    <button
                        className="px-1 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                        onClick={() => setCurrentTimeIndex(Math.max(0, currentTimeIndex - 1))}
                        disabled={currentTimeIndex === 0}
                    >
                        ◀
                    </button>
                    <span className="text-xs px-2">
                        T{currentTimeIndex + 1}/{timeSeriesData.length}
                    </span>
                    <button
                        className="px-1 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                        onClick={() => setCurrentTimeIndex(Math.min(timeSeriesData.length - 1, currentTimeIndex + 1))}
                        disabled={currentTimeIndex === timeSeriesData.length - 1}
                    >
                        ▶
                    </button>
                </div>
            </div>

            {renderGrid()}

            <div className="mt-2 text-xs text-gray-300">
                {currentData.timestamp}
            </div>
        </div>
    );
}