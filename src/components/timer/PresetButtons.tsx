
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PresetButtonsProps {
  currentMinutes: number;
  currentSeconds: number;
  onApplyPreset: (minutes: number, seconds: number) => void;
}

const PresetButtons: React.FC<PresetButtonsProps> = ({ 
  currentMinutes, 
  currentSeconds, 
  onApplyPreset 
}) => {
  const presetTimes = [
    { label: '1 min', minutes: 1, seconds: 0 },
    { label: '5 min', minutes: 5, seconds: 0 },
    { label: '10 min', minutes: 10, seconds: 0 },
    { label: '15 min', minutes: 15, seconds: 0 },
    { label: '25 min', minutes: 25, seconds: 0 },
    { label: '30 min', minutes: 30, seconds: 0 },
  ];

  return (
    <div className="space-y-2">
      <Label className="text-xs text-gray-500">Quick presets</Label>
      <div className="grid grid-cols-3 gap-2">
        {presetTimes.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onApplyPreset(preset.minutes, preset.seconds)}
            className={`${
              currentMinutes === preset.minutes && currentSeconds === preset.seconds
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : ''
            }`}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PresetButtons;
