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
      const R = 6371; // Radius bumi dalam km
      const dLat = (points[i].lat - points[i - 1].lat) * Math.PI / 180;
      const dLng = (points[i].lng - points[i - 1].lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(points[i - 1].lat * Math.PI / 180) * Math.cos(points[i].lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += R * c;
    }

    return totalDistance;
  };

  const formattedDistance = calculateDistance().toFixed(2);

  const calculateEstimatedTime = () => {
    const distance = calculateDistance();
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

  // Menghitung total tanjakan agar konsisten dengan ekspor GPX
  const calculateElevationGain = () => {
    if (points.length < 2) return 0;

    const totalDistance = calculateDistance();
    if (totalDistance === 0) return 0;

    const baseElevation = 100.0;
    const numberOfHills = Math.max(1, Math.floor(totalDistance / 2));
    const hillAmplitude = 30.0;

    let elevationGain = 0;
    let lastElevation = -1;
    let cumulativeDistance = 0;

    const haversineDistance = (p1: RoutePoint, p2: RoutePoint): number => {
        const R = 6371;
        const dLat = (p2.lat - p1.lat) * Math.PI / 180;
        const dLng = (p2.lng - p1.lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    points.forEach((point, index) => {
        if (index > 0) {
            cumulativeDistance += haversineDistance(points[index - 1], point);
        }

        const progress = cumulativeDistance / totalDistance;
        const hillEffect = hillAmplitude * Math.sin(progress * numberOfHills * 2 * Math.PI);
        const variationEffect = (hillAmplitude / 4) * Math.sin(progress * numberOfHills * 8 * Math.PI);

        let currentElevation = baseElevation + hillEffect + variationEffect;
        currentElevation = Math.max(20, currentElevation);

        if (lastElevation !== -1 && currentElevation > lastElevation) {
            elevationGain += currentElevation - lastElevation;
        }
        lastElevation = currentElevation;
    });

    return Math.round(elevationGain);
  };


  const estimatedTime = calculateEstimatedTime();
  const elevation = calculateElevationGain();

  return (
    <div className="bg-brand-light/50 dark:bg-brand-dark/50 rounded-lg p-4 shadow-inner">
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <button
            onClick={onExport}
            disabled={points.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-brand-secondary text-white rounded-full text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <Download className="w-4 h-4" />
            Export GPX
          </button>

          {showDownloadSuccess && (
            <div className="absolute top-full right-0 mt-2 bg-green-500 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-medium flex items-center gap-2 animate-bounce z-10">
              <CheckCircle className="w-4 h-4" />
              GPX Downloaded!
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Route className="w-4 h-4 text-brand-secondary" />
            <span className="text-xs text-brand-secondary dark:text-gray-300">Distance</span>
          </div>
          <div className="text-lg font-semibold text-brand-dark dark:text-brand-light">{formattedDistance} km</div>
        </div>

        <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-brand-secondary" />
            <span className="text-xs text-brand-secondary dark:text-gray-300">Est. Time</span>
          </div>
          <div className="text-lg font-semibold text-brand-dark dark:text-brand-light">{estimatedTime}</div>
        </div>

        <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-brand-secondary" />
            <span className="text-xs text-brand-secondary dark:text-gray-300">Elevation</span>
          </div>
          <div className="text-lg font-semibold text-brand-dark dark:text-brand-light">{elevation} m</div>
        </div>

        <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-black/20">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs text-brand-secondary dark:text-gray-300">Activity</span>
          </div>
          <div className="text-lg font-semibold text-brand-dark dark:text-brand-light capitalize">{activity}</div>
        </div>
      </div>
    </div>
  );
}