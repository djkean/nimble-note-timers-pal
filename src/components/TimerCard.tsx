
import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Trash2, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Timer } from '@/pages/Index';

interface TimerCardProps {
  timer: Timer;
  onUpdate: (id: string, updates: Partial<Timer>) => void;
  onDelete: (id: string) => void;
}

const TimerCard: React.FC<TimerCardProps> = ({ timer, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(timer.name);
  const [editNotes, setEditNotes] = useState(timer.notes);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timer.duration > 0 ? ((timer.duration - timer.timeLeft) / timer.duration) * 100 : 0;

  const handlePlayPause = () => {
    if (timer.timeLeft === 0) return;
    onUpdate(timer.id, { isRunning: !timer.isRunning });
  };

  const handleReset = () => {
    onUpdate(timer.id, { 
      timeLeft: timer.duration, 
      isRunning: false, 
      isCompleted: false 
    });
  };

  const handleSaveEdit = () => {
    onUpdate(timer.id, { name: editName, notes: editNotes });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(timer.name);
    setEditNotes(timer.notes);
    setIsEditing(false);
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
      timer.isCompleted 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
        : timer.isRunning 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
        : 'bg-white border-gray-200'
    }`}>
      {timer.isRunning && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 animate-pulse" />
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          {isEditing ? (
            <div className="flex-1 space-y-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="font-semibold"
                placeholder="Timer name"
              />
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes..."
                className="min-h-[60px] resize-none"
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSaveEdit}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Save className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancelEdit}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg text-gray-800 truncate">
                  {timer.name}
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
              {timer.notes && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {timer.notes}
                </p>
              )}
            </div>
          )}
          
          {!isEditing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(timer.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-mono font-bold ${
            timer.isCompleted 
              ? 'text-green-600' 
              : timer.timeLeft <= 10 
              ? 'text-red-500 animate-pulse' 
              : timer.isRunning 
              ? 'text-blue-600' 
              : 'text-gray-700'
          }`}>
            {formatTime(timer.timeLeft)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Total: {formatTime(timer.duration)}
          </div>
        </div>

        <Progress 
          value={progress} 
          className={`h-2 ${
            timer.isCompleted 
              ? '[&>div]:bg-green-500' 
              : timer.isRunning 
              ? '[&>div]:bg-blue-500' 
              : '[&>div]:bg-gray-400'
          }`}
        />

        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            onClick={handlePlayPause}
            disabled={timer.timeLeft === 0}
            className={
              timer.isRunning 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-green-500 hover:bg-green-600'
            }
          >
            {timer.isRunning ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {timer.isCompleted && (
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✓ Completed
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimerCard;
