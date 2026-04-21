import React from 'react';

const StatCard = ({ title, value, label, primary }) => {
  return (
    <div className="card-premium">
      <h3 className="text-muted text-xs uppercase tracking-widest mb-2">{title}</h3>
      <div className="flex items-center gap-4">
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: 0, 
          color: primary ? 'hsl(var(--color-primary))' : 'inherit' 
        }}>
          {value}
        </h2>
        {label && <span className="badge badge-success">{label}</span>}
      </div>
    </div>
  );
};

export default StatCard;
