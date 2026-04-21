import React, { useState } from 'react';

const ScoreForm = ({ onSubmit, error, success }) => {
  const [dateInput, setDateInput] = useState('');
  const [scoreInput, setScoreInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(dateInput, Number(scoreInput));
    setIsSubmitting(false);
    setDateInput('');
    setScoreInput('');
  };

  return (
    <div className="card-premium">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Log New Score</h2>
      
      {error && <div className="card-premium" style={{ borderColor: 'hsl(var(--color-error))', padding: '0.75rem', marginBottom: '1rem', background: 'hsla(var(--color-error), 0.1)'}}>
        <span style={{color: 'hsl(var(--color-error))', fontSize: '0.875rem'}}>{error}</span>
      </div>}
      
      {success && <div className="card-premium" style={{ borderColor: 'hsl(var(--color-primary))', padding: '0.75rem', marginBottom: '1rem', background: 'hsla(var(--color-primary), 0.1)'}}>
        <span style={{color: 'hsl(var(--color-primary))', fontSize: '0.875rem'}}>{success}</span>
      </div>}

      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="text-muted text-xs uppercase tracking-widest mb-2">Round Date</label>
        <input 
          type="date" 
          required 
          value={dateInput} 
          onChange={e => setDateInput(e.target.value)} 
          disabled={isSubmitting}
        />
        
        <label className="text-muted text-xs uppercase tracking-widest mb-2 mt-4">Stableford Score (1-45)</label>
        <input 
          type="number" 
          min="1" max="45" 
          required 
          placeholder="e.g. 36" 
          value={scoreInput} 
          onChange={e => setScoreInput(e.target.value)} 
          disabled={isSubmitting}
        />
        
        <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
          {isSubmitting ? 'Logging...' : 'Log Score'}
        </button>
      </form>
    </div>
  );
};

export default ScoreForm;
