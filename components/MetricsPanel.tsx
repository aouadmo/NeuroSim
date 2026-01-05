import React from 'react';
import { SimulationMetrics } from '../types';
import { Activity, Volume2, Brain, Zap, Network } from 'lucide-react';

interface MetricsPanelProps {
  metrics: SimulationMetrics;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics }) => {
  const powerPercentage = Math.min(100, Math.max(0, metrics.audioVolume * 100));
  const coherencePercentage = Math.min(100, Math.max(0, metrics.coherence * 100));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      
      {/* Alpha Power Card */}
      <div className="bg-neuro-800 p-4 rounded-xl border border-neuro-700 relative overflow-hidden">
        <div className="flex items-center space-x-2 mb-2 text-neuro-400">
          <Activity size={18} />
          <span className="text-xs uppercase tracking-wider font-semibold">Alpha Power</span>
        </div>
        <div className="text-3xl font-mono text-white font-bold">
          {metrics.alphaPower.toFixed(2)}
          <span className="text-sm text-neuro-500 ml-2">uV</span>
        </div>
        <div className="mt-2 text-xs text-neuro-500">
          Left Frontal (Ch 1)
        </div>
      </div>

      {/* Coherence Card (New Feature) */}
      <div className="bg-neuro-800 p-4 rounded-xl border border-neuro-700 relative overflow-hidden">
         <div className="flex items-center space-x-2 mb-2 text-neuro-400">
          <Network size={18} />
          <span className="text-xs uppercase tracking-wider font-semibold">Coherence</span>
        </div>
        <div className="text-3xl font-mono text-white font-bold">
          {Math.round(coherencePercentage)}
          <span className="text-sm text-neuro-500 ml-1">%</span>
        </div>
         <div className="w-full bg-neuro-900 rounded-full h-1.5 mt-3 overflow-hidden">
          <div 
            className="h-full bg-accent-400 transition-all duration-300"
            style={{ width: `${coherencePercentage}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-neuro-500">
          L-Frontal vs R-Frontal
        </div>
      </div>

      {/* Telemetry & Channels (New Feature) */}
      <div className="md:col-span-2 bg-neuro-800 p-4 rounded-xl border border-neuro-700 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2 text-neuro-400">
            <Zap size={18} />
            <span className="text-xs uppercase tracking-wider font-semibold">System Telemetry</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${metrics.dspLatency < 10 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
            <span className="font-mono text-xs text-neuro-300">
              {metrics.dspLatency.toFixed(2)}ms DSP
            </span>
          </div>
        </div>

        {/* 16 Channel Status Indicators */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-neuro-500 mb-1 uppercase tracking-wider">
            <span>Left Frontal</span>
            <span>Right Frontal</span>
            <span>Visual Ctx</span>
          </div>
          <div className="flex justify-between gap-1">
            {/* 16 Channels: 0-3 Active L, 4-7 Active R, 8-15 Background */}
            {Array.from({ length: 16 }).map((_, i) => {
              // Determine activity color based on state and channel group
              let isActive = false;
              if (metrics.isRelaxed) {
                if (i < 8) isActive = true; // Frontal channels active in Alpha
              }
              
              return (
                <div 
                  key={i} 
                  className={`h-6 flex-1 rounded-sm transition-all duration-300 ${
                    isActive 
                      ? 'bg-accent-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
                      : 'bg-neuro-900 border border-neuro-700'
                  }`}
                  title={`Channel ${i + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* State Card */}
      <div className={`p-4 rounded-xl border transition-colors duration-300 ${
        metrics.isRelaxed 
          ? 'bg-emerald-900/30 border-emerald-500/50' 
          : 'bg-neuro-800 border-neuro-700'
      }`}>
        <div className="flex items-center space-x-2 mb-2 text-neuro-400">
          <Brain size={18} className={metrics.isRelaxed ? "text-emerald-400" : "text-neuro-400"} />
          <span className="text-xs uppercase tracking-wider font-semibold">User State</span>
        </div>
        <div className={`text-2xl font-bold ${metrics.isRelaxed ? "text-emerald-400" : "text-neuro-300"}`}>
          {metrics.isRelaxed ? "MEDITATIVE" : "ACTIVE"}
        </div>
      </div>

      {/* Audio Feedback Card */}
      <div className="md:col-span-3 bg-neuro-800 p-4 rounded-xl border border-neuro-700">
        <div className="flex items-center space-x-2 mb-2 text-neuro-400">
          <Volume2 size={18} />
          <span className="text-xs uppercase tracking-wider font-semibold">Audio Feedback Loop</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="w-12 font-mono text-sm text-right text-neuro-300">{Math.round(powerPercentage)}%</div>
           <div className="flex-1 bg-neuro-900 rounded-full h-4 overflow-hidden border border-neuro-900">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-500 transition-all duration-100 ease-out"
              style={{ width: `${powerPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};