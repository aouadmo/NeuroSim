import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  SAMPLE_RATE, 
  UPDATE_RATE_MS, 
  ALPHA_FREQ, 
  BUFFER_SIZE_SECONDS,
  CHANNELS
} from '../constants';
import { 
  BiquadFilter, 
  calculateBandpassCoefficients, 
  calculateRMS, 
  generateWhiteNoise,
  calculatePearsonCorrelation
} from '../utils/dsp';
import { audioEngine } from '../services/audioEngine';
import { SimulationMetrics, SystemState } from '../types';

export const useNeurofeedbackSimulation = () => {
  const [systemState, setSystemState] = useState<SystemState>(SystemState.IDLE);
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    timestamp: 0,
    alphaPower: 0,
    coherence: 0,
    dspLatency: 0,
    rawSignalSnippet: [],
    isRelaxed: false,
    audioVolume: 0,
  });

  // REFS for High-Frequency Simulation Loop
  const requestRef = useRef<number>();
  const isSpacePressed = useRef<boolean>(false);
  const lastUpdateRef = useRef<number>(0);
  
  // DSP State
  // We need 16 independent filters for the "Montage"
  const filtersRef = useRef<BiquadFilter[]>([]); 
  
  // We track buffers for Channel 1 (Left) and Channel 5 (Right) for Coherence
  const coherenceBufferL = useRef<number[]>([]);
  const coherenceBufferR = useRef<number[]>([]);
  
  // Buffer for Visualization (Channel 1 Raw)
  const visBuffer = useRef<number[]>([]);
  
  const timeRef = useRef<number>(0); // Simulation time

  // Initialize DSP Filters (16 Channels)
  useEffect(() => {
    // 8-12Hz Bandpass coefficients
    const coeffs = calculateBandpassCoefficients(SAMPLE_RATE, ALPHA_FREQ, 2.5);
    
    // Create array of 16 filters
    filtersRef.current = Array(CHANNELS).fill(null).map(() => new BiquadFilter(coeffs));
  }, []);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') isSpacePressed.current = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') isSpacePressed.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Simulation Loop
  const animate = useCallback((timestamp: number) => {
    if (systemState !== SystemState.RUNNING) return;

    // --- Performance Telemetry Start ---
    const startDspTime = performance.now();

    // 1. Determine samples to process this frame
    const samplesPerFrame = Math.ceil(SAMPLE_RATE / 60); 

    for (let i = 0; i < samplesPerFrame; i++) {
      timeRef.current += 1 / SAMPLE_RATE;
      const t = timeRef.current;
      
      // Common sine wave for synchronized injection
      // 10Hz Alpha Wave
      const alphaSignal = 2.0 * Math.sin(2 * Math.PI * ALPHA_FREQ * t);

      // --- MULTI-CHANNEL EMITTER (16 Ch) ---
      // Channels 0-3: Left Frontal (Target)
      // Channels 4-7: Right Frontal (Target)
      // Channels 8-15: Visual (Background)
      
      // For efficiency in this loop, we specifically track processing for:
      // Ch 0 (Left Probe) & Ch 4 (Right Probe) for Coherence.
      // We assume others are processed similarly in a real C++ backend.
      
      let sampleL = generateWhiteNoise() * 0.5;
      let sampleR = generateWhiteNoise() * 0.5;
      
      if (isSpacePressed.current) {
        // High Coherence State: Inject IDENTICAL signal into both probes
        sampleL += alphaSignal;
        sampleR += alphaSignal; 
      } else {
        // Low Coherence State: Signals are just independent noise
        // (No injection, or could inject independent noise if we wanted active state but no coherence)
      }

      // --- DSP PIPELINE ---
      
      // Filter Channel 0
      let filteredL = 0;
      if (filtersRef.current[0]) {
        filteredL = filtersRef.current[0].process(sampleL);
      }

      // Filter Channel 4
      let filteredR = 0;
      if (filtersRef.current[4]) {
        filteredR = filtersRef.current[4].process(sampleR);
      }

      // Process "Phantom" channels to simulate load if needed, 
      // but for JS performance we focus on the active ones for metrics.

      // Buffer Management (Ch 0 Raw for Vis)
      visBuffer.current.push(sampleL);
      if (visBuffer.current.length > SAMPLE_RATE * BUFFER_SIZE_SECONDS) {
        visBuffer.current.shift();
      }

      // Buffer Management (Ch 0 & 4 Filtered for Coherence/RMS)
      // 500ms window for calculation
      coherenceBufferL.current.push(filteredL);
      coherenceBufferR.current.push(filteredR);
      
      if (coherenceBufferL.current.length > SAMPLE_RATE * 0.5) {
        coherenceBufferL.current.shift();
        coherenceBufferR.current.shift();
      }
    }

    // --- CALCULATE METRICS ---
    
    // 1. Alpha Power (RMS of Left Frontal)
    const currentAlphaRMS = calculateRMS(coherenceBufferL.current);
    
    // 2. Coherence (Pearson Correlation between L and R)
    // Only calc if we have enough data
    const currentCoherence = calculatePearsonCorrelation(
      coherenceBufferL.current, 
      coherenceBufferR.current
    );

    // Normalize Reward (RMS based)
    const normalizedReward = Math.min(1, Math.max(0, (currentAlphaRMS - 0.2) / 1.3));

    // --- AUDIO FEEDBACK ---
    audioEngine.setVolume(normalizedReward);

    // --- Performance Telemetry End ---
    const endDspTime = performance.now();
    const frameDuration = endDspTime - startDspTime;

    // --- UI UPDATES (Throttled) ---
    if (timestamp - lastUpdateRef.current > UPDATE_RATE_MS) {
      setMetrics({
        timestamp: timeRef.current,
        alphaPower: currentAlphaRMS,
        coherence: Math.max(0, currentCoherence), // Clamp negative correlation for simple display
        dspLatency: frameDuration,
        isRelaxed: isSpacePressed.current,
        rawSignalSnippet: visBuffer.current.slice(-50),
        audioVolume: normalizedReward
      });
      lastUpdateRef.current = timestamp;
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [systemState]);

  // Start/Stop Logic
  useEffect(() => {
    if (systemState === SystemState.RUNNING) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [systemState, animate]);

  const toggleSimulation = async () => {
    if (systemState === SystemState.IDLE) {
      await audioEngine.start();
      setSystemState(SystemState.RUNNING);
    } else {
      audioEngine.stop();
      setSystemState(SystemState.IDLE);
    }
  };

  return {
    systemState,
    metrics,
    toggleSimulation
  };
};
