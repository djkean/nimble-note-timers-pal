
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface CreateTimerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, notes: string, minutes: number, seconds: number) => void;
}

interface CustomPreset {
  id: string;
  label: string;
  minutes: number;
  seconds: number;
}

const CreateTimerDialog: React.FC<CreateTimerDialogProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && (minutes > 0 || seconds > 0)) {
      onCreate(name.trim(), notes.trim(), minutes, seconds);
      // Reset form
      setName('');
      setNotes('');
      setMinutes(5);
      setSeconds(0);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setName('');
    setNotes('');
    setMinutes(5);
    setSeconds(0);
    setShowAddPreset(false);
    setNewPresetLabel('');
  };

  const addCustomPreset = () => {
    if (newPresetLabel.trim() && (minutes > 0 || seconds > 0)) {
      const newPreset: CustomPreset = {
        id: Date.now().toString(),
        label: newPresetLabel.trim(),
        minutes,
        seconds
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

  const applyPreset = (presetMinutes: number, presetSeconds: number) => {
    setMinutes(presetMinutes);
    setSeconds(presetSeconds);
    console.log('Applied preset:', presetMinutes, 'min', presetSeconds, 'sec');
  };

  const presetTimes = [
    { label: '1 min', minutes: 1, seconds: 0 },
    { label: '5 min', minutes: 5, seconds: 0 },
    { label: '10 min', minutes: 10, seconds: 0 },
    { label: '15 min', minutes: 15, seconds: 0 },
    { label: '25 min', minutes: 25, seconds: 0 },
    { label: '30 min', minutes: 30, seconds: 0 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-800">
            Create New Timer
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="timer-name" className="text-sm font-medium text-gray-700">
              Timer Name *
            </Label>
            <Input
              id="timer-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Workout break, Cooking pasta..."
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timer-notes" className="text-sm font-medium text-gray-700">
              Notes (optional)
            </Label>
            <Textarea
              id="timer-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details or reminders..."
              className="w-full min-h-[80px] resize-none"
            />
          </div>

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
            
            {/* Default preset buttons */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Quick presets</Label>
              <div className="grid grid-cols-3 gap-2">
                {presetTimes.map((preset) => (
                  <Button
                    key={preset.label}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset.minutes, preset.seconds)}
                    className={`${
                      minutes === preset.minutes && seconds === preset.seconds
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : ''
                    }`}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
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
                        onClick={() => applyPreset(preset.minutes, preset.seconds)}
                        className={`w-full text-xs ${
                          minutes === preset.minutes && seconds === preset.seconds
                            ? 'bg-green-50 border-green-300 text-green-700'
                            : ''
                        }`}
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
                  This will save the current time ({minutes}m {seconds}s) as a reusable preset
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={addCustomPreset}
                    disabled={!newPresetLabel.trim() || (minutes === 0 && seconds === 0)}
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

            {/* Manual time input */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Manual input</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="minutes" className="text-xs text-gray-600">
                    Minutes
                  </Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="999"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="text-center"
                  />
                </div>
                <div className="text-gray-400 mt-6">:</div>
                <div className="flex-1">
                  <Label htmlFor="seconds" className="text-xs text-gray-600">
                    Seconds
                  </Label>
                  <Input
                    id="seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || (minutes === 0 && seconds === 0)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              Create Timer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTimerDialog;
