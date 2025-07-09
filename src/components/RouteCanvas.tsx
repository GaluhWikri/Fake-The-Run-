import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  timestamp: number;
}

interface RouteCanvasProps {
  isDrawing: boolean;
  drawingTool: 'draw' | 'heart' | 'circle';
  showWaypoints: boolean;
  onRouteChange: (points: Point[]) => void;
}

export default function RouteCanvas({ 
  isDrawing, 
  drawingTool, 
  showWaypoints, 
  onRouteChange 
}: RouteCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [waypoints, setWaypoints] = useState<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    const gridSize = 20;
    
    for (let i = 0; i <= canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    
    for (let i = 0; i <= canvas.height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw route
    if (points.length > 1) {
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      ctx.stroke();
    }

    // Draw waypoints
    if (showWaypoints) {
      waypoints.forEach((waypoint, index) => {
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(waypoint.x, waypoint.y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText((index + 1).toString(), waypoint.x, waypoint.y + 4);
      });
    }
  }, [points, waypoints, showWaypoints]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const pos = getMousePos(e);
    const newPoint: Point = {
      x: pos.x,
      y: pos.y,
      timestamp: Date.now()
    };

    if (drawingTool === 'draw') {
      setIsMouseDown(true);
      setPoints([newPoint]);
    } else {
      // Add waypoint
      setWaypoints(prev => [...prev, newPoint]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isMouseDown || drawingTool !== 'draw') return;
    
    const pos = getMousePos(e);
    const newPoint: Point = {
      x: pos.x,
      y: pos.y,
      timestamp: Date.now()
    };
    
    setPoints(prev => [...prev, newPoint]);
  };

  const handleMouseUp = () => {
    if (isMouseDown) {
      setIsMouseDown(false);
      onRouteChange(points);
    }
  };

  const clearRoute = () => {
    setPoints([]);
    setWaypoints([]);
    onRouteChange([]);
  };

  return (
    <div className="relative w-full h-full bg-slate-50 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {points.length > 0 && (
        <button
          onClick={clearRoute}
          className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
        >
          Clear Route
        </button>
      )}
      
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Navigation className="w-4 h-4" />
          <span>{points.length} points</span>
          {waypoints.length > 0 && (
            <>
              <span>•</span>
              <MapPin className="w-4 h-4" />
              <span>{waypoints.length} waypoints</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}