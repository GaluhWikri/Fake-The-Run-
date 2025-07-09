import React, { useState, useEffect } from 'react';
import { Clock, Zap, Target } from 'lucide-react';

interface PaceCalculatorProps {
  activity: 'run' | 'bike';
  distance: number;
  onPaceChange: (pace: number) => void;
}

export default function PaceCalculator({ activity, distance, onPaceChange }: PaceCalculatorProps) {
  const [paceMode, setPaceMode] = useState<'time' | 'pace'>('pace');
  const [targetTime, setTargetTime] = useState({ hours: 0, minutes: 30, seconds: 0 });
  const [averagePace, setAveragePace] = useState({ minutes: 5, seconds: 30 });
  const [pace, setPace] = useState(0);

  useEffect(() => {
    if (paceMode === 'time' && distance > 0) {
      const totalSeconds = targetTime.hours * 3600 + targetTime.minutes * 60 + targetTime.seconds;
      const pacePerKm = totalSeconds / distance;
      setPace(pacePerKm);
      onPaceChange(pacePerKm);
    } else if (paceMode === 'pace') {
      const paceInSeconds = averagePace.minutes * 60 + averagePace.seconds;
      setPace(paceInSeconds);
      onPaceChange(paceInSeconds);
    }
  }, [paceMode, targetTime, averagePace, distance, onPaceChange]);

  const formatPace = (paceInSeconds: number) => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSpeedFromPace = (paceInSeconds: number) => {
    if (paceInSeconds === 0) return 0;
    return (3600 / paceInSeconds).toFixed(1);
  };

  const calculateTotalTime = () => {
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

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
        <Target className="w-4 h-4" />
        Pace Calculator
      </h3>
      
      {/* Mode Toggle */}
      <div className="flex mb-4 bg-slate-100 rounded-lg p-1">
        <button
          onClick={() => setPaceMode('pace')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
            paceMode === 'pace'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Set Pace
        </button>
        <button
          onClick={() => setPaceMode('time')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
            paceMode === 'time'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Set Time
        </button>
      </div>
      
      <div className="space-y-4">
        {paceMode === 'pace' ? (
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">
              Average Pace (min/km)
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={averagePace.minutes}
                  onChange={(e) => setAveragePace(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  placeholder="Min"
                  min="0"
                />
                <span className="text-xs text-slate-500">min</span>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={averagePace.seconds}
                  onChange={(e) => setAveragePace(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  placeholder="Sec"
                  min="0"
                  max="59"
                />
                <span className="text-xs text-slate-500">sec</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">
              Target Time
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={targetTime.hours}
                  onChange={(e) => setTargetTime(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  placeholder="H"
                  min="0"
                />
                <span className="text-xs text-slate-500">hours</span>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={targetTime.minutes}
                  onChange={(e) => setTargetTime(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  placeholder="M"
                  min="0"
                  max="59"
                />
                <span className="text-xs text-slate-500">min</span>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={targetTime.seconds}
                  onChange={(e) => setTargetTime(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                  placeholder="S"
                  min="0"
                  max="59"
                />
                <span className="text-xs text-slate-500">sec</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-600">Current Pace</span>
            </div>
            <span className="text-sm font-medium">
              {formatPace(pace)}/km
            </span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-600">Speed</span>
            </div>
            <span className="text-sm font-medium">
              {getSpeedFromPace(pace)} km/h
            </span>
          </div>
          
          {distance > 0 && (
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600">Total Time</span>
              </div>
              <span className="text-sm font-medium text-blue-800">
                {calculateTotalTime()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}