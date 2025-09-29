import React, { useState } from 'react';
import { FileText, Type } from 'lucide-react';

interface RouteFormProps {
  onFormChange: (data: { name: string; description: string }) => void;
}

export default function RouteForm({ onFormChange }: RouteFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleInputChange = (field: 'name' | 'description', value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onFormChange(newData);
  };

  return (
    <div className="bg-brand-light/50 dark:bg-brand-dark/50 rounded-lg p-4 shadow-inner">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-brand-dark dark:text-brand-light mb-2">
            <Type className="w-3 h-3 inline mr-1" />
            Route Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Morning Run"
            className="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg text-sm text-brand-dark dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-brand-dark dark:text-brand-light mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your route..."
            rows={3}
            className="w-full px-3 py-2 bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg text-sm text-brand-dark dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-colors resize-none"
          />
        </div>
      </div>
      
      {(formData.name || formData.description) && (
        <div className="mt-4 p-3 bg-brand-secondary/20 rounded-lg border border-brand-secondary/50">
          <div className="text-xs text-brand-secondary font-medium mb-1">Preview:</div>
          {formData.name && (
            <div className="text-sm font-bold text-brand-secondary">{formData.name}</div>
          )}
          {formData.description && (
            <div className="text-xs text-brand-secondary mt-1">{formData.description}</div>
          )}
        </div>
      )}
    </div>
  );
}