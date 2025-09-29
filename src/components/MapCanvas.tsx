import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import LocationSearch from './LocationSearch';
import { Route, Navigation2, RotateCcw, Trash2, Plus, Minus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Custom Components ---
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const waypointIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

function MapEvents({ isDrawing, onAddPoint }: { isDrawing: boolean; onAddPoint: (point: any) => void }) {
  useMapEvents({
    click: (e) => {
      if (isDrawing) {
        onAddPoint({ lat: e.latlng.lat, lng: e.latlng.lng, timestamp: Date.now() });
      }
    }
  });
  return null;
}

// --- Main Map Canvas Component ---
export default function MapCanvas({ isDrawing, showWaypoints, onRouteChange }: any) {
  const [routePoints, setRoutePoints] = useState<any[]>([]);
  const [originalPoints, setOriginalPoints] = useState<any[]>([]);
  const [isSnappedToRoads, setIsSnappedToRoads] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const [center, setCenter] = useState<[number, number]>([48.8566, 2.3522]);
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => setCenter([coords.latitude, coords.longitude]),
      (err) => console.log(err)
    );
  }, []);

  const handleAddPoint = (point: any) => {
    const newPoints = [...routePoints, point];
    setRoutePoints(newPoints);
    setOriginalPoints(newPoints);
    setIsSnappedToRoads(false);
    onRouteChange(newPoints);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    mapRef.current?.flyTo([lat, lng], 15, { duration: 1.5 });
  };
  
  const clearRoute = () => {
    setRoutePoints([]);
    setOriginalPoints([]);
    setIsSnappedToRoads(false);
    onRouteChange([]);
  };

  const removeLastPoint = () => {
    const newPoints = originalPoints.slice(0, -1);
    setRoutePoints(newPoints);
    setOriginalPoints(newPoints);
    setIsSnappedToRoads(false);
    onRouteChange(newPoints);
  };

  const snapToRoads = async () => {
    if (originalPoints.length < 2) return;
    setIsSnapping(true);
    try {
      const coordinates = originalPoints.map(p => `${p.lng},${p.lat}`).join(';');
      const response = await fetch(`https://router.project-osrm.org/route/v1/foot/${coordinates}?overview=full&geometries=geojson&steps=false`);
      if (!response.ok) throw new Error('Failed to snap');
      const data = await response.json();
      if (data.routes?.[0]?.geometry) {
        const snapped = data.routes[0].geometry.coordinates.map((c: [number, number], i: number) => ({
          lat: c[1], lng: c[0], timestamp: Date.now() + i
        }));
        setRoutePoints(snapped);
        setIsSnappedToRoads(true);
        onRouteChange(snapped);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to snap route. Please try again.');
    } finally {
      setIsSnapping(false);
    }
  };

  const revertToOriginal = () => {
    setRoutePoints(originalPoints);
    setIsSnappedToRoads(false);
    onRouteChange(originalPoints);
  };

  const calculateDistance = () => {
    if (routePoints.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < routePoints.length; i++) {
      const p1 = routePoints[i-1], p2 = routePoints[i], R = 6371;
      const dLat = (p2.lat - p1.lat) * Math.PI / 180;
      const dLng = (p2.lng - p1.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(p1.lat*Math.PI/180) * Math.cos(p2.lat*Math.PI/180) * Math.sin(dLng/2)**2;
      total += R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    }
    return total;
  };

  const getMarkerIcon = (index: number, total: number) => {
    if (index === 0) return startIcon;
    if (index === total - 1) return endIcon;
    return waypointIcon;
  };

  return (
    <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden">
      <MapContainer center={center} zoom={13} className="w-full h-full" ref={mapRef} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
        <MapEvents isDrawing={isDrawing} onAddPoint={handleAddPoint} />
        {showWaypoints && routePoints.map((p, i) => <Marker key={i} position={[p.lat, p.lng]} icon={getMarkerIcon(i, routePoints.length)} />)}
        {routePoints.length > 1 && <Polyline positions={routePoints.map(p => [p.lat, p.lng])} color="#E5533D" weight={4} opacity={0.9} />}
      </MapContainer>

      {/* Top Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-3">
        <LocationSearch onLocationSelect={handleLocationSelect} />
        <div className="mt-3 flex justify-between items-start">
          {/* Left Side: Zoom Controls */}
          <div className="bg-brand-light/90 dark:bg-brand-dark/90 p-1.5 rounded-lg shadow-lg flex flex-col">
            <button onClick={() => mapRef.current?.zoomIn()} className="p-2 group" title="Zoom in">
              <Plus className="w-5 h-5 text-brand-dark dark:text-brand-light group-hover:text-brand-secondary" />
            </button>
            <div className="h-px bg-black/10 dark:bg-white/10 my-1"></div>
            <button onClick={() => mapRef.current?.zoomOut()} className="p-2 group" title="Zoom out">
              <Minus className="w-5 h-5 text-brand-dark dark:text-brand-light group-hover:text-brand-secondary" />
            </button>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="bg-brand-light/90 dark:bg-brand-dark/90 p-2 rounded-lg shadow-lg flex flex-col gap-2">
            {originalPoints.length > 1 && (
              isSnappedToRoads ? (
                <button onClick={revertToOriginal} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 font-semibold transition-colors">
                  <Navigation2 className="w-4 h-4" /> Revert
                </button>
              ) : (
                <button onClick={snapToRoads} disabled={isSnapping} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 font-semibold transition-colors disabled:opacity-50">
                  {isSnapping ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div> : <Route className="w-4 h-4" />} Snap to roads
                </button>
              )
            )}
            {routePoints.length > 0 && (
              <>
                <button onClick={removeLastPoint} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 font-semibold transition-colors">
                  <RotateCcw className="w-4 h-4" /> Undo Last
                </button>
                <button onClick={clearRoute} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 font-semibold transition-colors">
                  <Trash2 className="w-4 h-4" /> Clear Route
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom-Right Info Panel */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg z-[1000]">
        {isSnappedToRoads && (
          <div className="mb-2 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
            <Route className="w-3 h-3" />
            <span>Route snapped to roads</span>
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Start
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            Waypoint
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            End
          </span>
        </div>
        <div className="mt-2 text-sm font-medium text-slate-800">
          {originalPoints.length} waypoints • {routePoints.length} route points • {calculateDistance().toFixed(2)} km
        </div>
        {isDrawing && (
          <div className="mt-1 text-xs text-blue-600">
            Click on map to add waypoints
          </div>
        )}
      </div>
    </div>
  );
}