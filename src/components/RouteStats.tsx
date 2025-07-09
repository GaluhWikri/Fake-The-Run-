import React from 'react';
import { Route, Clock, TrendingUp, Download, CheckCircle } from 'lucide-react';

interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
}

interface RouteStatsProps {
  points: RoutePoint[];
  activity: 'run' | 'bike';
  pace: number;
  onExport: () => void;
  showDownloadSuccess?: boolean;
}

export default function RouteStats({ points, activity, pace, onExport, showDownloadSuccess }: RouteStatsProps) {
  const calculateDistance = () => {
    if (points.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const R = 6371; // Earth's radius in km
      const dLat = (points[i].lat - points[i-1].lat) * Math.PI / 180;
      const dLng = (points[i].lng - points[i-1].lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(points[i-1].lat * Math.PI / 180) * Math.cos(points[i].lat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      totalDistance += R * c;
    }
    
    return totalDistance.toFixed(2);
  };

  const calculateEstimatedTime = () => {
    const distance = parseFloat(calculateDistance());
    if (distance === 0 || pace === 0) return '0:00';
    
    const totalSeconds = distance * pace;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateElevation = () => {
    // Simulate elevation (in real app, you'd use elevation API)
    if (points.length < 2) return 0;
    
    // Mock elevation gain based on route length
    const distance = parseFloat(calculateDistance());
    return Math.round(distance * 15); // Rough estimate: 15m elevation per km
  };

  const distance = calculateDistance();
  const estimatedTime = calculateEstimatedTime();
  const elevation = calculateElevation();

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-700">Route Statistics</h3>
        <div className="relative">
          <button
            onClick={onExport}
            disabled={points.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            Export GPX
          </button>
          
          {/* Success notification */}
          {showDownloadSuccess && (
            <div className="absolute top-full right-0 mt-2 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 animate-pulse z-10">
              <CheckCircle className="w-4 h-4" />
              GPX Downloaded!
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Route className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-slate-600">Distance</span>
          </div>
          <div className="text-lg font-semibold text-slate-800">{distance} km</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-xs text-slate-600">Est. Time</span>
          </div>
          <div className="text-lg font-semibold text-slate-800">{estimatedTime}</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-xs text-slate-600">Elevation</span>
          </div>
          <div className="text-lg font-semibold text-slate-800">{elevation} m</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs text-slate-600">Activity</span>
          </div>
          <div className="text-lg font-semibold text-slate-800 capitalize">{activity}</div>
        </div>
      </div>
    </div>
  );
}