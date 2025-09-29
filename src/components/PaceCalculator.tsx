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
    if (paceInSeconds === 0) return '0.0';
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
    <div className="bg-brand-light/50 dark:bg-brand-dark/50 rounded-lg p-4 shadow-inner">
      {/* Mode Toggle */}
      <div className="flex mb-4 bg-white/50 dark:bg-black/20 rounded-lg p-1">
        <button
          onClick={() => setPaceMode('pace')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
            paceMode === 'pace'
              ? 'bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light shadow-sm'
              : 'text-brand-secondary dark:text-gray-300 hover:text-brand-dark dark:hover:text-white'
          }`}
        >
          Set Pace
        </button>
        <button
          onClick={() => setPaceMode('time')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
            paceMode === 'time'
              ? 'bg-brand-light dark:bg-brand-dark text-brand-dark dark:text-brand-light shadow-sm'
              : 'text-brand-secondary dark:text-gray-300 hover:text-brand-dark dark:hover:text-white'
          }`}
        >
          Set Time
        </button>
      </div>

      <div className="space-y-4">
        {paceMode === 'pace' ? (
          <div>
            <label className="block text-xs font-medium text-brand-dark dark:text-brand-light mb-2">
              Average Pace (min/km)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={averagePace.minutes}
                onChange={(e) => setAveragePace(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                className="w-full px-2 py-1.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded text-sm text-brand-dark dark:text-brand-light"
                placeholder="Min"
                min="0"
              />
              <input
                type="number"
                value={averagePace.seconds}
                onChange={(e) => setAveragePace(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                className="w-full px-2 py-1.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded text-sm text-brand-dark dark:text-brand-light"
                placeholder="Sec"
                min="0"
                max="59"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-brand-dark dark:text-brand-light mb-2">
              Target Time
            </label>
            <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={targetTime.hours}
                  onChange={(e) => setTargetTime(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                  className="w-full px-2 py-1.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded text-sm text-brand-dark dark:text-brand-light"
                  placeholder="H"
                  min="0"
                />
                <input
                  type="number"
                  value={targetTime.minutes}
                  onChange={(e) => setTargetTime(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                  className="w-full px-2 py-1.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded text-sm text-brand-dark dark:text-brand-light"
                  placeholder="M"
                  min="0"
                  max="59"
                />
                <input
                  type="number"
                  value={targetTime.seconds}
                  onChange={(e) => setTargetTime(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                  className="w-full px-2 py-1.5 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded text-sm text-brand-dark dark:text-brand-light"
                  placeholder="S"
                  min="0"
                  max="59"
                />
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-secondary" />
              <span className="text-sm text-brand-dark dark:text-brand-light">Current Pace</span>
            </div>
            <span className="text-sm font-medium text-brand-dark dark:text-brand-light">
              {formatPace(pace)}/km
            </span>
          </div>

          <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-secondary" />
              <span className="text-sm text-brand-dark dark:text-brand-light">Speed</span>
            </div>
            <span className="text-sm font-medium text-brand-dark dark:text-brand-light">
              {getSpeedFromPace(pace)} km/h
            </span>
          </div>

          {distance > 0 && (
            <div className="flex items-center justify-between p-2 bg-brand-secondary/20 rounded border border-brand-secondary/50">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-secondary" />
                <span className="text-sm text-brand-secondary font-medium">Total Time</span>
              </div>
              <span className="text-sm font-bold text-brand-secondary">
                {calculateTotalTime()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}