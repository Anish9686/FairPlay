import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    if (isLogin) {
      const res = await login(email, password);
      if (res.success) navigate('/dashboard');
      else setError(res.error);
    } else {
      const res = await register(name, email, password);
      if (res.success) navigate('/dashboard');
      else setError(res.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="split-layout">
      <div className="split-left animate-fade-in">
        <h1 style={{ fontSize: '4rem', color: 'hsl(var(--color-primary))', marginBottom: '0.5rem' }}>FairPlay</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: 300, color: 'white' }}>Elevate your game.<br/>Empower your community.</p>
      </div>

      <div className="split-right">
        <div style={{ maxWidth: '400px', width: '100%' }} className="animate-fade-in">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{isLogin ? 'Welcome Back' : 'Join the Club'}</h2>
          <p className="mb-6">{isLogin ? 'Enter your details to access your dashboard' : 'Create an account to start tracking.'}</p>
          
          {error && <div className="card-premium" style={{ borderColor: 'hsl(var(--color-error))', padding: '1rem', marginBottom: '1.5rem', background: 'hsla(var(--color-error), 0.1)'}}>
            <span style={{color: 'hsl(var(--color-error))'}}>{error}</span>
          </div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col">
            
            {!isLogin && (
              <>
                <label className="text-muted text-xs uppercase tracking-widest mb-2">First Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tiger"
                  disabled={isSubmitting}
                />
              </>
            )}

            <label className="text-muted text-xs uppercase tracking-widest mb-2 mt-2">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="golfer@example.com"
              disabled={isSubmitting}
            />
            
            <label className="text-muted text-xs uppercase tracking-widest mb-2 mt-2">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
            />
            
            <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting} style={{ padding: '1rem' }}>
              {isSubmitting ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
          
          <p className="mt-4 text-center">
            <span className="text-muted">{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
            <span 
              style={{ color: 'hsl(var(--color-primary))', cursor: 'pointer', fontWeight: '700' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
