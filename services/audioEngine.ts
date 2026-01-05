import { BASE_FREQ, VOLUME_RAMP_TIME } from '../constants';

export class AudioEngine {
  private context: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  constructor() {
    // Lazy initialization in start() to comply with browser autoplay policies
  }

  async start() {
    if (this.isPlaying) return;

    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create nodes
    this.oscillator = this.context.createOscillator();
    this.gainNode = this.context.createGain();

    // Config
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(BASE_FREQ, this.context.currentTime);
    
    // Start silent
    this.gainNode.gain.setValueAtTime(0, this.context.currentTime);

    // Connect
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);

    this.oscillator.start();
    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying || !this.context) return;
    
    const currTime = this.context.currentTime;
    // Ramp down to 0 before stopping to avoid click
    this.gainNode?.gain.linearRampToValueAtTime(0, currTime + 0.1);

    setTimeout(() => {
      this.oscillator?.stop();
      this.context?.close();
      this.oscillator = null;
      this.gainNode = null;
      this.context = null;
      this.isPlaying = false;
    }, 150);
  }

  setVolume(targetVolume: number) {
    if (!this.context || !this.gainNode || !this.isPlaying) return;

    // Clamp volume 0-1
    const vol = Math.max(0, Math.min(1, targetVolume));
    
    // Smooth ramp
    const currentTime = this.context.currentTime;
    
    // Cancel any scheduled changes to react immediately
    this.gainNode.gain.cancelScheduledValues(currentTime);
    
    // Ramp to new value over VOLUME_RAMP_TIME seconds
    // We use linearRampToValueAtTime. Important: it needs a start point, 
    // but setValueAtTime checks if an event is already scheduled. 
    // A safe approach for continuous updates:
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, currentTime);
    this.gainNode.gain.linearRampToValueAtTime(vol, currentTime + VOLUME_RAMP_TIME);
  }

  get isActive() {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
