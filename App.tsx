import React from 'react';
import { useNeurofeedbackSimulation } from './hooks/useNeurofeedbackSimulation';
import { Oscilloscope } from './components/Oscilloscope';
import { MetricsPanel } from './components/MetricsPanel';
import { SystemState } from './types';
import { Play, Square, Settings, Cpu } from 'lucide-react';

export default function App() {
  const { systemState, metrics, toggleSimulation } = useNeurofeedbackSimulation();

  const isRunning = systemState === SystemState.RUNNING;

  return (
    <div className="min-h-screen bg-neuro-900 text-neuro-100 p-6 md:p-12 font-sans selection:bg-accent-500/30">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-500/10 rounded-lg border border-accent-500/20">
                <Cpu className="text-accent-400" size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">NeuroSim Web</h1>
            </div>
            <p className="text-neuro-400 mt-2 text-sm max-w-md">
              Digital Twin of an EEG Neurofeedback Loop. 
              Injects synthetic Alpha waves and maps band power to non-aversive audio.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-xs text-neuro-500 uppercase font-semibold tracking-wider">System Status</div>
              <div className={`font-mono font-bold ${isRunning ? 'text-green-400' : 'text-neuro-400'}`}>
                {systemState}
              </div>
            </div>
            
            <button
              onClick={toggleSimulation}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 ${
                isRunning 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20' 
                  : 'bg-accent-500 text-white hover:bg-accent-400 border border-transparent'
              }`}
            >
              {isRunning ? (
                <>
                  <Square size={18} fill="currentColor" />
                  <span>STOP SIMULATION</span>
                </>
              ) : (
                <>
                  <Play size={18} fill="currentColor" />
                  <span>START SYSTEM</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="space-y-6">
          
          {/* Real-time Oscilloscope */}
          <section>
            <div className="flex justify-between items-end mb-3">
              <h2 className="text-sm font-semibold text-neuro-300 uppercase tracking-wide">
                Live Signal Monitoring (CH 1-4 avg)
              </h2>
              <div className="flex gap-4 text-xs font-mono text-neuro-500">
                <span>Fs: 250Hz</span>
                <span>Buffer: 2s</span>
              </div>
            </div>
            <Oscilloscope data={metrics.rawSignalSnippet} />
          </section>

          {/* Metrics & Feedback */}
          <MetricsPanel metrics={metrics} />

          {/* Controls / Instructions */}
          <section className="bg-neuro-800/50 border border-neuro-700/50 rounded-xl p-6 mt-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Settings size={20} className="text-neuro-400" />
              <span>Simulation Controls</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neuro-700 flex items-center justify-center border-b-4 border-neuro-600 font-mono text-xl font-bold text-neuro-300">
                    SPC
                  </div>
                  <div>
                    <h4 className="font-medium text-neuro-200">Trigger Alpha State</h4>
                    <p className="text-sm text-neuro-400 leading-relaxed">
                      Press and hold the <strong className="text-accent-400">SPACEBAR</strong> to inject a 10Hz sine wave into the signal, simulating a meditative state.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-neuro-400 space-y-2 bg-neuro-900/50 p-4 rounded-lg border border-neuro-800">
                <p>
                  <span className="text-neuro-300 font-medium">DSP Logic:</span> 
                  Signal is processed via a TS implementation of a Direct-Form I Biquad Filter (Bandpass 8-12Hz).
                </p>
                <p>
                  <span className="text-neuro-300 font-medium">Audio Engine:</span> 
                  Uses Web Audio API with linear gain ramping to prevent audio clicks (Non-aversive feedback).
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
