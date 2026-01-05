export interface SimulationMetrics {
  timestamp: number;
  alphaPower: number;
  coherence: number; // New: 0.0 to 1.0
  dspLatency: number; // New: ms
  rawSignalSnippet: number[];
  isRelaxed: boolean;
  audioVolume: number;
}

export enum SystemState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  ERROR = 'ERROR'
}

export interface BiquadCoefficients {
  a0: number;
  a1: number;
  a2: number;
  b0: number;
  b1: number;
  b2: number;
}
