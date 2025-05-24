
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface CustomPreset {
  id: string;
  label: string;
  name: string;
  notes: string;
  minutes: number;
  seconds: number;
}

interface CustomPresetManagerProps {
  currentName: string;
  currentNotes: string;
  currentMinutes: number;
  currentSeconds: number;
  onApplyPreset: (minutes: number, seconds: number, name?: string, notes?: string) => void;
}

const CustomPresetManager: React.FC<CustomPresetManagerProps> = ({
  currentName,
  currentNotes,
  currentMinutes,
  currentSeconds,
  onApplyPreset
}) => {
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([]);
  const [showAddPreset, setShowAddPreset] = useState(false);
  const [newPresetLabel, setNewPresetLabel] = useState('');

  // Load custom presets from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('timerCustomPresets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomPresets(parsed);
        console.log('Loaded custom presets:', parsed);
      } catch (error) {
        console.error('Error loading custom presets:', error);
        setCustomPresets([]);
      }
    }
  }, []);

  // Save custom presets to localStorage whenever they change
  useEffect(() => {
    if (customPresets.length > 0) {
      localStorage.setItem('timerCustomPresets', JSON.stringify(customPresets));
      console.log('Saved custom presets:', customPresets);
    }
  }, [customPresets]);

  const addCustomPreset = () => {
    if (newPresetLabel.trim() && (currentMinutes > 0 || currentSeconds > 0)) {
      const newPreset: CustomPreset = {
        id: Date.now().toString(),
        label: newPresetLabel.trim(),
        name: currentName.trim(),
        notes: currentNotes.trim(),
        minutes: currentMinutes,
        seconds: currentSeconds
      };
      setCustomPresets(prev => {
        const updated = [...prev, newPreset];
        console.log('Adding new preset:', newPreset);
        return updated;
      });
      setNewPresetLabel('');
      setShowAddPreset(false);
    }
  };

  const removeCustomPreset = (id: string) => {
    setCustomPresets(prev => {
      const updated = prev.filter(preset => preset.id !== id);
      // Update localStorage immediately for deletions
      if (updated.length === 0) {
        localStorage.removeItem('timerCustomPresets');
      } else {
        localStorage.setItem('timerCustomPresets', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">Duration</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddPreset(!showAddPreset)}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Preset
        </Button>
      </div>

      {/* Custom preset buttons */}
      {customPresets.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Custom presets</Label>
          <div className="grid grid-cols-3 gap-2">
            {customPresets.map((preset) => (
              <div key={preset.id} className="relative">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onApplyPreset(preset.minutes, preset.seconds, preset.name, preset.notes)}
                  className={`w-full text-xs ${
                    currentMinutes === preset.minutes && currentSeconds === preset.seconds && currentName === preset.name && currentNotes === preset.notes
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : ''
                  }`}
                  title={`Name: ${preset.name}\nNotes: ${preset.notes}\nTime: ${preset.minutes}m ${preset.seconds}s`}
                >
                  {preset.label}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomPreset(preset.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                >
                  <X className="w-2 h-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new preset form */}
      {showAddPreset && (
        <div className="p-3 border rounded-lg bg-gray-50 space-y-3">
          <Label className="text-sm font-medium">Create Custom Preset</Label>
          <Input
            value={newPresetLabel}
            onChange={(e) => setNewPresetLabel(e.target.value)}
            placeholder="Preset name (e.g., Quick break)"
            className="text-sm"
          />
          <div className="text-xs text-gray-600 mb-2">
            This will save the current timer details (name: "{currentName}", notes: "{currentNotes}", time: {currentMinutes}m {currentSeconds}s) as a reusable preset
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={addCustomPreset}
              disabled={!newPresetLabel.trim() || (currentMinutes === 0 && currentSeconds === 0)}
              className="flex-1"
            >
              Save Preset
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAddPreset(false);
                setNewPresetLabel('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPresetManager;
