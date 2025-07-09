import React from 'react';
import { MapPin, Navigation, Route } from 'lucide-react';

interface DrawingToolsProps {
  isDrawing: boolean;
  onDrawingToggle: () => void;
  showWaypoints: boolean;
  onWaypointsToggle: () => void;
}

export default function DrawingTools({ 
  isDrawing,
  onDrawingToggle,
  showWaypoints, 
  onWaypointsToggle 
}: DrawingToolsProps) {

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-medium text-slate-700 mb-3">
        Route Planning Tools
      </h3>
      
      <div className="space-y-4">
        <button
          onClick={onDrawingToggle}
          className={`w-full p-3 rounded-lg border-2 transition-all hover:shadow-md ${
            isDrawing
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <Route className="w-5 h-5 mx-auto mb-1" />
          <span className="text-sm font-medium">
            {isDrawing ? 'Drawing Mode' : 'View Mode'}
          </span>
          {isDrawing && (
            <div className="text-xs text-blue-500 mt-1">
              Click map to add points
            </div>
          )}
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-600" />
          <span className="text-sm text-slate-600">Show Waypoints</span>
        </div>
        <button
          onClick={onWaypointsToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            showWaypoints ? 'bg-blue-600' : 'bg-slate-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showWaypoints ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Navigation className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">How to use:</span>
        </div>
        <ul className="text-xs text-slate-600 space-y-1">
          <li>• Search for locations using the search bar</li>
          <li>• Enable drawing mode</li>
          <li>• Click on map to add waypoints</li>
          <li>• Use "Snap to Roads" for realistic routing</li>
          <li>• Use "Undo Last" to remove points</li>
          <li>• Use "Clear Route" to start over</li>
        </ul>
      </div>
    </div>
  );
}