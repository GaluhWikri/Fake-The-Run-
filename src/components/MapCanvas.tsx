import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import LocationSearch from './LocationSearch';
import { Route, Navigation2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
}

interface MapCanvasProps {
  isDrawing: boolean;
  showWaypoints: boolean;
  onRouteChange: (points: RoutePoint[]) => void;
}

// Custom marker icons
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const waypointIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapEvents({ isDrawing, onAddPoint }: { isDrawing: boolean; onAddPoint: (point: RoutePoint) => void }) {
  useMapEvents({
    click: (e) => {
      if (isDrawing) {
        const newPoint: RoutePoint = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          timestamp: Date.now()
        };
        onAddPoint(newPoint);
      }
    }
  });
  return null;
}

export default function MapCanvas({ isDrawing, showWaypoints, onRouteChange }: MapCanvasProps) {
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [originalPoints, setOriginalPoints] = useState<RoutePoint[]>([]);
  const [isSnappedToRoads, setIsSnappedToRoads] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const [center, setCenter] = useState<[number, number]>([48.8566, 2.3522]); // Paris default
  const [zoom, setZoom] = useState(13);
  const mapRef = useRef<L.Map>(null);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Keep default location (Paris)
        }
      );
    }
  }, []);

  const handleAddPoint = async (point: RoutePoint) => {
    const newPoints = [...routePoints, point];
    setRoutePoints(newPoints);
    setOriginalPoints(newPoints);
    setIsSnappedToRoads(false);
    onRouteChange(newPoints);
  };

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setCenter([lat, lng]);
    setZoom(15);
    
    // Fly to the selected location
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 15, {
        duration: 1.5
      });
    }
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
      // Create waypoints string for OSRM API
      const coordinates = originalPoints.map(p => `${p.lng},${p.lat}`).join(';');
      
      // Use OSRM routing service to snap to roads
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/foot/${coordinates}?overview=full&geometries=geojson&steps=false`
      );
      
      if (!response.ok) {
        throw new Error('Failed to snap to roads');
      }
      
      const data = await response.json();
      
      if (data.routes && data.routes[0] && data.routes[0].geometry) {
        const geometry = data.routes[0].geometry;
        
        // Convert GeoJSON coordinates to RoutePoints
        const snappedPoints: RoutePoint[] = geometry.coordinates.map((coord: [number, number], index: number) => ({
          lat: coord[1],
          lng: coord[0],
          timestamp: Date.now() + index
        }));
        
        setRoutePoints(snappedPoints);
        setIsSnappedToRoads(true);
        onRouteChange(snappedPoints);
      }
    } catch (error) {
      console.error('Error snapping to roads:', error);
      // Show error message to user
      alert('Failed to snap route to roads. Please try again.');
    } finally {
      setIsSnapping(false);
    }
  };

  const revertToOriginal = () => {
    setRoutePoints(originalPoints);
    setIsSnappedToRoads(false);
    onRouteChange(originalPoints);
  };

  // Calculate total distance
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

  const getMarkerIcon = (index: number, total: number) => {
    if (index === 0) return startIcon;
    if (index === total - 1) return endIcon;
    return waypointIcon;
  };

  return (
    <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-20 z-[1000]">
        <LocationSearch onLocationSelect={handleLocationSelect} />
      </div>
      
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents isDrawing={isDrawing} onAddPoint={handleAddPoint} />
        
        {/* Route markers */}
        {showWaypoints && routePoints.map((point, index) => (
          <Marker
            key={`${point.lat}-${point.lng}-${index}`}
            position={[point.lat, point.lng]}
            icon={getMarkerIcon(index, routePoints.length)}
          />
        ))}
        
        {/* Route line */}
        {routePoints.length > 1 && (
          <Polyline
            positions={routePoints.map(p => [p.lat, p.lng])}
            color="#2563eb"
            weight={4}
            opacity={0.8}
          />
        )}
      </MapContainer>
      
      {/* Control buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        {originalPoints.length > 1 && (
          <div className="flex flex-col gap-2">
            {!isSnappedToRoads ? (
              <button
                onClick={snapToRoads}
                disabled={isSnapping}
                className="bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600 transition-colors shadow-lg font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isSnapping ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Snapping...
                  </>
                ) : (
                  <>
                    <Route className="w-4 h-4" />
                    Snap to Roads
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={revertToOriginal}
                className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors shadow-lg font-medium flex items-center gap-2"
              >
                <Navigation2 className="w-4 h-4" />
                Revert Original
              </button>
            )}
          </div>
        )}
        
        {routePoints.length > 0 && (
          <>
            <button
              onClick={removeLastPoint}
              className="bg-orange-500 text-white px-3 py-2 rounded-md text-sm hover:bg-orange-600 transition-colors shadow-lg font-medium"
            >
              Undo Last
            </button>
            <button
              onClick={clearRoute}
              className="bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600 transition-colors shadow-lg font-medium"
            >
              Clear Route
            </button>
          </>
        )}
      </div>
      
      {/* Route info */}
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