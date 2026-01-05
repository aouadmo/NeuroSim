export const SAMPLE_RATE = 250; // Hz
export const BUFFER_SIZE_SECONDS = 2;
export const BUFFER_LENGTH = SAMPLE_RATE * BUFFER_SIZE_SECONDS;
export const CHANNELS = 16;
export const UPDATE_RATE_MS = 250; // Update UI 4 times per second
export const ALPHA_FREQ = 10; // Hz
export const BASE_FREQ = 440; // Audio tone Hz

// Smoothing factor for audio volume to prevent clicks
export const VOLUME_RAMP_TIME = 0.1; // Seconds

// Visualizer settings
export const VISUALIZER_POINTS = 50;
