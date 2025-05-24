
export const playAlarmSound = () => {
  // Create audio context for better browser compatibility
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create a simple beep sound using Web Audio API
  const createBeep = (frequency: number, duration: number, delay: number = 0) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
    
    oscillator.start(audioContext.currentTime + delay);
    oscillator.stop(audioContext.currentTime + delay + duration);
  };
  
  // Play a sequence of beeps to create an alarm pattern
  createBeep(800, 0.2, 0);     // First beep
  createBeep(800, 0.2, 0.3);   // Second beep
  createBeep(800, 0.2, 0.6);   // Third beep
  createBeep(1000, 0.4, 0.9);  // Final longer beep at higher pitch
};
