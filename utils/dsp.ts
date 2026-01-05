import { BiquadCoefficients } from '../types';

/**
 * Generates White Noise
 */
export const generateWhiteNoise = (): number => {
  return Math.random() * 2 - 1;
};

/**
 * Calculates Pearson Correlation Coefficient between two signals
 * Used as a time-domain proxy for Coherence.
 */
export const calculatePearsonCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  // Safety check
  if (n !== y.length || n === 0) return 0;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (let i = 0; i < n; i++) {
    const valX = x[i];
    const valY = y[i];
    sumX += valX;
    sumY += valY;
    sumXY += valX * valY;
    sumX2 += valX * valX;
    sumY2 += valY * valY;
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  return numerator / denominator;
};

/**
 * Simple Biquad Filter implementation (Direct Form I)
 * Adapted for real-time stream processing.
 */
export class BiquadFilter {
  private x1 = 0;
  private x2 = 0;
  private y1 = 0;
  private y2 = 0;
  private coeffs: BiquadCoefficients;

  constructor(coeffs: BiquadCoefficients) {
    this.coeffs = coeffs;
  }

  process(input: number): number {
    const { b0, b1, b2, a1, a2 } = this.coeffs;
    
    // Direct Form I difference equation
    const output = 
      b0 * input + 
      b1 * this.x1 + 
      b2 * this.x2 - 
      a1 * this.y1 - 
      a2 * this.y2;

    // Shift delays
    this.x2 = this.x1;
    this.x1 = input;
    this.y2 = this.y1;
    this.y1 = output;

    return output;
  }
}

/**
 * Calculates Bandpass coefficients for a 2nd order Butterworth filter.
 */
export const calculateBandpassCoefficients = (
  sampleRate: number,
  centerFreq: number,
  qFactor: number
): BiquadCoefficients => {
  const w0 = (2 * Math.PI * centerFreq) / sampleRate;
  const alpha = Math.sin(w0) / (2 * qFactor);
  const cosw0 = Math.cos(w0);

  const a0 = 1 + alpha;
  
  return {
    a0: a0,
    a1: (-2 * cosw0) / a0,
    a2: (1 - alpha) / a0,
    b0: alpha / a0,
    b1: 0,
    b2: -alpha / a0
  };
};

/**
 * Calculates RMS (Root Mean Square) of a signal buffer
 */
export const calculateRMS = (buffer: number[]): number => {
  if (buffer.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
};
