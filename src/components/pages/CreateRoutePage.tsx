import React, { useState } from 'react';
import MapCanvas from '../MapCanvas';
import DrawingTools from '../DrawingTools';
import ActivitySelector from '../ActivitySelector';
import PaceCalculator from '../PaceCalculator';
import RouteStats from '../RouteStats';
import RouteForm from '../RouteForm';
import { exportToGPX } from '../../utils/gpxExport';

interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
}

const CreateRoutePage = () => {
    const [isDrawing, setIsDrawing] = useState(true);
    const [showWaypoints, setShowWaypoints] = useState(false);
    const [activity, setActivity] = useState<'run' | 'bike'>('run');
    const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
    const [pace, setPace] = useState(0); // Pace in seconds per km
    const [routeDetails, setRouteDetails] = useState({ name: '', description: '' });
    const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  
    const calculateDistance = () => {
      if (routePoints.length < 2) return 0;
  
      let totalDistance = 0;
      for (let i = 1; i < routePoints.length; i++) {
        const R = 6371; // Earth's radius in km
        const dLat = (routePoints[i].lat - routePoints[i-1].lat) * Math.PI / 180;
        const dLng = (routePoints[i].lng - routePoints[i-1].lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(routePoints[i-1].lat * Math.PI / 180) * Math.cos(routePoints[i].lat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        totalDistance += R * c;
      }
      return totalDistance;
    };
  
    const handleExport = () => {
      exportToGPX(routePoints, activity, routeDetails, pace);
      
      setShowDownloadSuccess(true);
      setTimeout(() => {
        setShowDownloadSuccess(false);
      }, 3000);
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <DrawingTools
              isDrawing={isDrawing}
              onDrawingToggle={() => setIsDrawing(!isDrawing)}
              showWaypoints={showWaypoints}
              onWaypointsToggle={() => setShowWaypoints(!showWaypoints)}
            />
            
            <ActivitySelector
              activity={activity}
              onActivityChange={setActivity}
            />
            
            <PaceCalculator
              activity={activity}
              distance={calculateDistance()}
              onPaceChange={setPace}
            />
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-2 sm:p-4">
              <div className="flex items-center justify-between mb-4 px-2 sm:px-0">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Peta Interaktif</h2>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {isDrawing ? 'Klik untuk menambahkan titik jalan' : 'Mode tampilan'}
                </div>
              </div>
              
              <div className="h-96 lg:h-[500px]">
                <MapCanvas
                  isDrawing={isDrawing}
                  showWaypoints={showWaypoints}
                  onRouteChange={setRoutePoints}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <RouteStats
                points={routePoints}
                activity={activity}
                pace={pace}
                onExport={handleExport}
                showDownloadSuccess={showDownloadSuccess}
              />
              
              <RouteForm onFormChange={setRouteDetails} />
            </div>
          </div>
        </div>
      </main>
    )
}

export default CreateRoutePage;

