import React, { useState, useEffect } from 'react';
import { MapIcon, Settings, Info, Sun, Moon } from 'lucide-react';
import MapCanvas from './components/MapCanvas.tsx';
import DrawingTools from './components/DrawingTools.tsx';
import ActivitySelector from './components/ActivitySelector.tsx';
import PaceCalculator from './components/PaceCalculator.tsx';
import RouteStats from './components/RouteStats.tsx';
import RouteForm from './components/RouteForm.tsx';
import { exportToGPX } from './utils/gpxExport.ts';

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
  const [pace, setPace] = useState(0); // Pace in seconds per km
  const [routeDetails, setRouteDetails] = useState({ name: '', description: '' });
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <MapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">RouteTracker</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Plan your perfect route</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <button onClick={handleThemeSwitch} className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
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
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-2 sm:p-4">
              <div className="flex items-center justify-between mb-4 px-2 sm:px-0">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Interactive Map</h2>
                <div className="text-sm text-slate-600 dark:text-slate-400">
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
                pace={pace}
                onExport={handleExport}
                showDownloadSuccess={showDownloadSuccess}
              />
              
              <RouteForm onFormChange={setRouteDetails} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600 dark:text-slate-400">
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

