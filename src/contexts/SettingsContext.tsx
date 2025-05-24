
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  alarmVolume: number;
  setAlarmVolume: (volume: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alarmVolume, setAlarmVolumeState] = useState<number>(0.3);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem('alarmVolume');
    if (savedVolume !== null) {
      setAlarmVolumeState(parseFloat(savedVolume));
    }
  }, []);

  // Save to localStorage when volume changes
  const setAlarmVolume = (volume: number) => {
    setAlarmVolumeState(volume);
    localStorage.setItem('alarmVolume', volume.toString());
  };

  return (
    <SettingsContext.Provider value={{ alarmVolume, setAlarmVolume }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
