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
    const [showWaypoints, setShowWaypoints] = useState(true);
    const [activity, setActivity] = useState<'run' | 'bike'>('run');
    const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
    const [pace, setPace] = useState(360); // Default pace: 6:00/km
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
        <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Map Area */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg h-[calc(100vh-100px)] overflow-hidden">
                        <MapCanvas
                            isDrawing={isDrawing}
                            showWaypoints={showWaypoints}
                            onRouteChange={setRoutePoints}
                        />
                    </div>
                </div>

                {/* Controls Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg h-[calc(100vh-100px)] flex flex-col">
                        <div className="flex-grow p-1 overflow-y-auto">
                            <div className="p-4 space-y-6">
                                {/* Section 1: Stats & Export */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Statistik & Ekspor</h3>
                                    <RouteStats
                                        points={routePoints}
                                        activity={activity}
                                        pace={pace}
                                        onExport={handleExport}
                                        showDownloadSuccess={showDownloadSuccess}
                                    />
                                </div>

                                <hr className="border-slate-200 dark:border-slate-700" />

                                {/* Section 2: Planning Tools */}
                                <div className="space-y-4">
                                     <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Alat Perencanaan</h3>
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
                                </div>
                                
                                <hr className="border-slate-200 dark:border-slate-700" />

                                {/* Section 3: Pace */}
                                <div className="space-y-4">
                                     <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Kalkulator Kecepatan</h3>
                                    <PaceCalculator
                                        activity={activity}
                                        distance={calculateDistance()}
                                        onPaceChange={setPace}
                                    />
                                </div>

                                <hr className="border-slate-200 dark:border-slate-700" />
                                
                                {/* Section 4: Details */}
                                <div className="space-y-4">
                                     <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Detail Rute</h3>
                                    <RouteForm onFormChange={setRouteDetails} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CreateRoutePage;