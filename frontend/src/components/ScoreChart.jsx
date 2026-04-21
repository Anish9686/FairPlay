import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ScoreChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card-premium flex items-center justify-center text-muted" style={{ height: '350px' }}>
        No scores submitted yet. Start playing!
      </div>
    );
  }

  // Calculate if improving
  const firstScore = data[0].score;
  const lastScore = data[data.length - 1].score;
  const isImproving = lastScore > firstScore && data.length > 1;

  return (
    <div className="card-premium" style={{ height: '100%' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Performance Trajectory</h2>
          <p className="text-muted text-xs uppercase tracking-widest mb-0">Latest 5 Valid Scores</p>
        </div>
        {isImproving && <span className="badge badge-success">↑ Improving</span>}
      </div>
      
      <div style={{ width: '100%', height: '280px' }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--color-primary))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--color-primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="hsla(var(--color-text), 0.3)" tick={{fill: 'hsla(var(--color-text), 0.5)', fontSize: 12}} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--color-surface))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', color: 'white' }}
              itemStyle={{ color: 'hsl(var(--color-primary))', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="hsl(var(--color-primary))" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreChart;
