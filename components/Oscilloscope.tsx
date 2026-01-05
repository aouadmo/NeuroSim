import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface OscilloscopeProps {
  data: number[];
}

export const Oscilloscope: React.FC<OscilloscopeProps> = ({ data }) => {
  const chartData = data.map((val, idx) => ({ i: idx, v: val }));

  return (
    <div className="h-48 w-full bg-neuro-900/50 rounded-lg border border-neuro-700 overflow-hidden relative">
      <div className="absolute top-2 left-2 text-xs text-neuro-400 font-mono z-10">
        CHANNEL_01 (RAW)
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <YAxis domain={[-3, 3]} hide />
          <Area 
            type="monotone" 
            dataKey="v" 
            stroke="#60a5fa" 
            strokeWidth={2}
            fill="#3b82f6" 
            fillOpacity={0.1} 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none" 
           style={{
             background: 'linear-gradient(90deg, rgba(15,23,42,1) 0%, rgba(15,23,42,0) 10%, rgba(15,23,42,0) 90%, rgba(15,23,42,1) 100%)'
           }}>
      </div>
    </div>
  );
};
