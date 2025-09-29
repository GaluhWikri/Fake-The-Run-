import React from 'react';
import { Bike, User } from 'lucide-react';

interface ActivitySelectorProps {
  activity: 'run' | 'bike';
  onActivityChange: (activity: 'run' | 'bike') => void;
}

export default function ActivitySelector({ activity, onActivityChange }: ActivitySelectorProps) {
  return (
    <div className="bg-brand-light/50 dark:bg-brand-dark/50 rounded-lg p-4 shadow-inner">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onActivityChange('run')}
          className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
            activity === 'run'
              ? 'border-brand-secondary bg-brand-secondary/10 text-brand-secondary'
              : 'border-black/10 dark:border-white/10 hover:border-brand-secondary/50 text-brand-dark dark:text-brand-light'
          }`}
        >
          <User className="w-5 h-5 mx-auto mb-1" />
          <span className="text-xs font-medium">Run</span>
        </button>
        
        <button
          onClick={() => onActivityChange('bike')}
          className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
            activity === 'bike'
              ? 'border-brand-secondary bg-brand-secondary/10 text-brand-secondary'
              : 'border-black/10 dark:border-white/10 hover:border-brand-secondary/50 text-brand-dark dark:text-brand-light'
          }`}
        >
          <Bike className="w-5 h-5 mx-auto mb-1" />
          <span className="text-xs font-medium">Bike</span>
        </button>
      </div>
    </div>
  );
}