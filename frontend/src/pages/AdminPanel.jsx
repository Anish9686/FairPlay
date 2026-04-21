import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalUsers: 0, activeSubscribers: 0, users: [] });
  const [history, setHistory] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(API + '/api/admin/stats', config);
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(API + '/api/admin/draw-history', config);
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, [user]);

  const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  // Disable if history contains an entry for next month already
  const isAlreadyDrawn = history.some(d => d.monthName === nextMonth && d.year === currentYear);

  const handleDraw = async () => {
    setIsDrawing(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(API + '/api/admin/execute-draw', {
        monthName: nextMonth,
        year: currentYear
      }, config);
      fetchHistory(); // refresh UI
    } catch (err) {
      setError(err.response?.data?.message || 'Error executing draw');
    }
    setIsDrawing(false);
  };

  const verifyWinner = async (drawId, winnerId, verificationStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(API + '/api/admin/verify-winner', {
        drawId, winnerId, verificationStatus
      }, config);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem' }}>
       <div className="flex justify-between items-center mb-6">
         <div>
            <h1>Admin Control Panel</h1>
            <p>System overview and lottery mechanics.</p>
         </div>
       </div>

       <div className="grid grid-cols-2 gap-6">
         <div className="card-premium">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>Database Metrics</h2>
            <div className="flex justify-between">
               <div className="text-center">
                  <h3 style={{fontSize: '2.5rem', marginBottom: '0'}}>{stats.totalUsers}</h3>
                  <p className="text-muted text-xs uppercase tracking-widest mt-1">Total Registered</p>
               </div>
               <div className="text-center">
                  <h3 style={{fontSize: '2.5rem', color: 'hsl(var(--color-primary))', marginBottom: '0'}}>{stats.activeSubscribers}</h3>
                  <p className="text-muted text-xs uppercase tracking-widest mt-1">Eligible Subs (Paid & Active)</p>
               </div>
            </div>
         </div>

         <div className="card-premium text-center">
            <h2 style={{ fontSize: '1.25rem' }}>Monthly Draw Engine</h2>
            <p className="text-sm text-muted mt-2">Target execution: {nextMonth} {currentYear}</p>
            <button 
              onClick={handleDraw} 
              disabled={isDrawing || stats.activeSubscribers === 0 || isAlreadyDrawn}
              className={`btn mt-4 ${isAlreadyDrawn ? 'btn-outline' : 'btn-primary'}`}
              style={{ width: '100%', fontSize: '1.25rem', padding: '1rem', borderColor: isAlreadyDrawn ? 'gray': undefined, color: isAlreadyDrawn ? 'gray': undefined }}
            >
              {isDrawing ? 'Calculating...' : (isAlreadyDrawn ? 'ALREADY EXECUTED' : 'TRIGGER DRAW')}
            </button>
            {error && <div className="error-text mt-4">{error}</div>}
         </div>
       </div>

       <div className="card-premium mt-6">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'hsl(var(--color-primary))' }}>Draw History & Verification</h2>
          {history.length === 0 ? (
            <p className="text-muted">No draws executed yet.</p>
          ) : (
              history.map(draw => (
               <div key={draw._id} style={{ padding: '1rem', background: 'hsla(var(--color-primary), 0.05)', borderRadius: '12px', marginBottom: '1rem' }}>
                  <h3 style={{ marginBottom: '0.25rem' }}>{draw.monthName} {draw.year}</h3>
                  <p className="text-muted text-sm mb-4">Executed on: {new Date(draw.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <div className="table-responsive">
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '0.5rem' }}>Tier</th>
                        <th style={{ padding: '0.5rem' }}>Winner</th>
                        <th style={{ padding: '0.5rem' }}>Proof Supplied</th>
                        <th style={{ padding: '0.5rem' }}>Status</th>
                        <th style={{ padding: '0.5rem' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {draw.winners.map(w => (
                        <tr key={w._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.5rem' }}>{w.tier}-Match</td>
                          <td style={{ padding: '0.5rem' }}>{w.user?.name || w.user?.email || 'Anonymous User'}</td>
                          <td style={{ padding: '0.5rem' }}>
                             {w.proofText ? <span style={{color: 'white', wordBreak: 'break-all'}}>{w.proofText}</span> : <span className="text-muted">No</span>}
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            <span className={`badge ${w.verificationStatus === 'approved' ? 'badge-success' : w.verificationStatus === 'rejected' ? 'badge-error' : ''}`} style={{ borderColor: w.verificationStatus === 'pending' ? '#f59e0b': w.verificationStatus === 'rejected' ? 'hsl(var(--color-error))' : undefined, color: w.verificationStatus === 'pending' ? '#f59e0b': w.verificationStatus === 'rejected' ? 'hsl(var(--color-error))' : undefined }}>
                              {w.verificationStatus}
                            </span>
                          </td>
                          <td style={{ padding: '0.5rem' }}>
                            {w.verificationStatus === 'pending' && w.proofText && (
                               <div className="flex gap-2">
                                 <button className="btn btn-primary" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem'}} onClick={() => verifyWinner(draw._id, w._id, 'approved')}>Approve</button>
                                 <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderColor: 'hsl(var(--color-error))', color: 'hsl(var(--color-error))'}} onClick={() => verifyWinner(draw._id, w._id, 'rejected')}>Reject</button>
                               </div>
                            )}
                            {w.verificationStatus === 'approved' && (
                               <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderColor: 'hsl(var(--color-primary))', color: 'hsl(var(--color-primary))'}} onClick={() => verifyWinner(draw._id, w._id, 'paid')}>Mark Paid</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
               </div>
             ))
          )}
       </div>

       <div className="card-premium mt-6 mb-12">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>User Directory</h2>
          <div className="table-responsive">
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '1rem', color: 'hsl(var(--color-text-muted))' }}>Name</th>
                <th style={{ padding: '1rem', color: 'hsl(var(--color-text-muted))' }}>Email</th>
                <th style={{ padding: '1rem', color: 'hsl(var(--color-text-muted))' }}>Sub Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{u.name || 'Anonymous User'}</td>
                  <td style={{ padding: '1rem' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${u.subscription?.status === 'active' ? 'badge-success' : ''}`} style={{
                      borderColor: u.subscription?.status !== 'active' ? 'gray' : undefined,
                      color: u.subscription?.status !== 'active' ? 'gray' : undefined
                    }}>
                      {u.subscription?.status || 'inactive *'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
       </div>
    </div>
  );
};

export default AdminPanel;
