
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CreateTimerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, notes: string, minutes: number, seconds: number) => void;
}

const CreateTimerDialog: React.FC<CreateTimerDialogProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

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
            <Label className="text-sm font-medium text-gray-700">Duration</Label>
            
            <div className="grid grid-cols-3 gap-2">
              {presetTimes.map((preset) => (
                <Button
                  key={preset.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMinutes(preset.minutes);
                    setSeconds(preset.seconds);
                  }}
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
