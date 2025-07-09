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
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Route Details
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            <Type className="w-3 h-3 inline mr-1" />
            Route Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter route name..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your route..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          />
        </div>
      </div>
      
      {(formData.name || formData.description) && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-600 font-medium mb-1">Preview:</div>
          {formData.name && (
            <div className="text-sm font-medium text-blue-800">{formData.name}</div>
          )}
          {formData.description && (
            <div className="text-xs text-blue-600 mt-1">{formData.description}</div>
          )}
        </div>
      )}
    </div>
  );
}