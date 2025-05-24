
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import PresetButtons from '@/components/timer/PresetButtons';
import CustomPresetManager from '@/components/timer/CustomPresetManager';
import ManualTimeInput from '@/components/timer/ManualTimeInput';

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
      resetForm();
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setNotes('');
    setMinutes(5);
    setSeconds(0);
  };

  const applyPreset = (presetMinutes: number, presetSeconds: number, presetName?: string, presetNotes?: string) => {
    setMinutes(presetMinutes);
    setSeconds(presetSeconds);
    if (presetName !== undefined) {
      setName(presetName);
    }
    if (presetNotes !== undefined) {
      setNotes(presetNotes);
    }
    console.log('Applied preset:', presetMinutes, 'min', presetSeconds, 'sec', presetName, presetNotes);
  };

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
            <CustomPresetManager
              currentName={name}
              currentNotes={notes}
              currentMinutes={minutes}
              currentSeconds={seconds}
              onApplyPreset={applyPreset}
            />

            <PresetButtons
              currentMinutes={minutes}
              currentSeconds={seconds}
              onApplyPreset={applyPreset}
            />

            <ManualTimeInput
              minutes={minutes}
              seconds={seconds}
              onMinutesChange={setMinutes}
              onSecondsChange={setSeconds}
            />
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
