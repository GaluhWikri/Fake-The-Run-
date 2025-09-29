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
    <div className="bg-brand-light/50 dark:bg-brand-dark/50 rounded-lg p-4 shadow-inner">
      <div className="space-y-4">
        <button
          onClick={onDrawingToggle}
          className={`w-full p-3 rounded-lg border-2 transition-all hover:shadow-md ${
            isDrawing
              ? 'border-brand-secondary bg-brand-secondary/10 text-brand-secondary'
              : 'border-black/10 dark:border-white/10 hover:border-brand-secondary/50'
          }`}
        >
          <Route className="w-5 h-5 mx-auto mb-1" />
          <span className="text-sm font-medium">
            {isDrawing ? 'Drawing Mode' : 'View Mode'}
          </span>
          {isDrawing && (
            <div className="text-xs mt-1">
              Click map to add points
            </div>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-dark dark:text-brand-light" />
          <span className="text-sm text-brand-dark dark:text-brand-light">Show Waypoints</span>
        </div>
        <button
          onClick={onWaypointsToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            showWaypoints ? 'bg-brand-secondary' : 'bg-black/20 dark:bg-white/20'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showWaypoints ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Navigation className="w-4 h-4 text-brand-secondary" />
          <span className="text-sm font-medium text-brand-dark dark:text-brand-light">How to use:</span>
        </div>
        <ul className="text-xs text-brand-secondary dark:text-gray-300 space-y-1 pl-1">
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