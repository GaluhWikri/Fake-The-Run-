import React from 'react';
import { Bike, User } from 'lucide-react';

interface ActivitySelectorProps {
  activity: 'run' | 'bike';
  onActivityChange: (activity: 'run' | 'bike') => void;
}

export default function ActivitySelector({ activity, onActivityChange }: ActivitySelectorProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-medium text-slate-700 mb-3">Activity Type</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onActivityChange('run')}
          className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
            activity === 'run'
              ? 'border-green-500 bg-green-50 text-green-600'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <User className="w-5 h-5 mx-auto mb-1" />
          <span className="text-xs font-medium">Run</span>
        </button>
        
        <button
          onClick={() => onActivityChange('bike')}
          className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
            activity === 'bike'
              ? 'border-green-500 bg-green-50 text-green-600'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <Bike className="w-5 h-5 mx-auto mb-1" />
          <span className="text-xs font-medium">Bike</span>
        </button>
      </div>
    </div>
  );
}