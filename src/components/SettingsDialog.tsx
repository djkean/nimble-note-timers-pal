
import React from 'react';
import { Settings, Volume2, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/contexts/SettingsContext';
import { playAlarmSound } from '@/utils/audioUtils';
import DarkModeToggle from './DarkModeToggle';

const SettingsDialog = () => {
  const { alarmVolume, setAlarmVolume } = useSettings();

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setAlarmVolume(newVolume);
  };

  const testAlarm = () => {
    try {
      playAlarmSound(alarmVolume);
    } catch (error) {
      console.log('Could not play test alarm:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 hover:bg-white shadow-lg dark:bg-gray-800/80 dark:hover:bg-gray-800"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium">Theme</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Dark Mode
              </span>
              <DarkModeToggle />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium">Alarm Volume</span>
            </div>
            
            <div className="space-y-3">
              <Slider
                value={[alarmVolume]}
                onValueChange={handleVolumeChange}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(alarmVolume * 100)}%
                </span>
                <Button
                  onClick={testAlarm}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Test Alarm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
