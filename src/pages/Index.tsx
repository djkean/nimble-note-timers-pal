import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import TimerCard from '@/components/TimerCard';
import CreateTimerDialog from '@/components/CreateTimerDialog';
import SettingsDialog from '@/components/SettingsDialog';
import { useSettings } from '@/contexts/SettingsContext';
import { playAlarmSound } from '@/utils/audioUtils';

export interface Timer {
  id: string;
  name: string;
  notes: string;
  duration: number; // in seconds
  timeLeft: number; // in seconds
  isRunning: boolean;
  isCompleted: boolean;
  createdAt: Date;
}

const Index = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { alarmVolume } = useSettings();

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => 
        prevTimers.map(timer => {
          if (timer.isRunning && timer.timeLeft > 0) {
            const newTimeLeft = timer.timeLeft - 1;
            if (newTimeLeft === 0) {
              // Timer completed - play alarm sound
              try {
                playAlarmSound(alarmVolume);
              } catch (error) {
                console.log('Could not play alarm sound:', error);
              }
              
              toast({
                title: "Timer Completed!",
                description: `${timer.name} has finished.`,
              });
              return {
                ...timer,
                timeLeft: 0,
                isRunning: false,
                isCompleted: true
              };
            }
            return { ...timer, timeLeft: newTimeLeft };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [alarmVolume]);

  const createTimer = (name: string, notes: string, minutes: number, seconds: number) => {
    const duration = minutes * 60 + seconds;
    const newTimer: Timer = {
      id: Date.now().toString(),
      name,
      notes,
      duration,
      timeLeft: duration,
      isRunning: false,
      isCompleted: false,
      createdAt: new Date()
    };
    setTimers(prev => [...prev, newTimer]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Timer Created",
      description: `${name} timer has been created.`,
    });
  };

  const updateTimer = (id: string, updates: Partial<Timer>) => {
    setTimers(prev => prev.map(timer => 
      timer.id === id ? { ...timer, ...updates } : timer
    ));
  };

  const deleteTimer = (id: string) => {
    const timer = timers.find(t => t.id === id);
    setTimers(prev => prev.filter(timer => timer.id !== id));
    toast({
      title: "Timer Deleted",
      description: `${timer?.name || 'Timer'} has been deleted.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1" />
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Multi Timer</h1>
              <p className="text-gray-600">Manage multiple timers with custom names and notes</p>
            </div>
            <div className="flex-1 flex justify-end">
              <SettingsDialog />
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Timer
          </Button>
        </div>

        {timers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-gray-300" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No timers yet</h3>
            <p className="text-gray-500">Create your first timer to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timers.map(timer => (
              <TimerCard
                key={timer.id}
                timer={timer}
                onUpdate={updateTimer}
                onDelete={deleteTimer}
              />
            ))}
          </div>
        )}

        <CreateTimerDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onCreate={createTimer}
        />
      </div>
    </div>
  );
};

export default Index;
