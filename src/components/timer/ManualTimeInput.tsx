
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ManualTimeInputProps {
  minutes: number;
  seconds: number;
  onMinutesChange: (minutes: number) => void;
  onSecondsChange: (seconds: number) => void;
}

const ManualTimeInput: React.FC<ManualTimeInputProps> = ({
  minutes,
  seconds,
  onMinutesChange,
  onSecondsChange
}) => {
  return (
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
            max="9999"
            value={minutes}
            onChange={(e) => onMinutesChange(Math.max(0, parseInt(e.target.value) || 0))}
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
            onChange={(e) => onSecondsChange(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
            className="text-center"
          />
        </div>
      </div>
    </div>
  );
};

export default ManualTimeInput;
