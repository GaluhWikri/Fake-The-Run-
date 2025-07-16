import React, { useState } from 'react';
import { MapIcon, Settings, Info } from 'lucide-react';
import MapCanvas from './components/MapCanvas';
import DrawingTools from './components/DrawingTools';
import ActivitySelector from './components/ActivitySelector';
import PaceCalculator from './components/PaceCalculator';
import RouteStats from './components/RouteStats';
import RouteForm from './components/RouteForm';
import { exportToGPX } from './utils/gpxExport';

interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
}

function App() {
  const [isDrawing, setIsDrawing] = useState(true);
  const [showWaypoints, setShowWaypoints] = useState(false);
  const [activity, setActivity] = useState<'run' | 'bike'>('run');
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [pace, setPace] = useState(0); // Ini adalah pace (detik per km) dari PaceCalculator
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
    // Meneruskan nilai 'pace' ke fungsi exportToGPX
    exportToGPX(routePoints, activity, routeDetails, pace);
    
    // Show success notification
    setShowDownloadSuccess(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowDownloadSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <MapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">RouteTracker</h1>
                <p className="text-sm text-slate-600">Plan your perfect route</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors">
                <Info className="w-4 h-4" />
                Help
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Interactive Map</h2>
                <div className="text-sm text-slate-600">
                  {isDrawing ? 'Click to add waypoints' : 'View mode'}
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
                pace={pace} // Pace passed to RouteStats for display
                onExport={handleExport}
                showDownloadSuccess={showDownloadSuccess}
              />
              
              <RouteForm onFormChange={setRouteDetails} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p className="text-sm">
              Create, plan, and export your routes for Strava and other fitness apps
            </p>
            <p className="text-xs mt-2">
              Compatible with GPX format • Export ready for Strava upload
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;