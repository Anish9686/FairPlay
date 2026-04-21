import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatCard from '../components/StatCard';
import ScoreForm from '../components/ScoreForm';
import ScoreChart from '../components/ScoreChart';

const API = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [charities, setCharities] = useState([]);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [proofText, setProofText] = useState('');

  const fetchProfile = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(API + '/api/user/profile', config);
      setProfile(data);
    } catch (err) {
      console.error(err);
      if (err.response && (err.response.status === 401 || err.response.status === 404)) { logout(); }
    }
  };

  const fetchCharities = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(API + '/api/user/charities', config);
      setCharities(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCharities();
  }, [user]);

  const handleScoreSubmit = async (date, score) => {
    setFormError(''); setFormSuccess('');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(API + '/api/user/scores', { date, score }, config);
      setFormSuccess('Score captured successfully.');
      fetchProfile();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Must have an active subscription.');
    }
  };

  const handleCharityChange = async (charityId, charityPercentage) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(API + '/api/user/charity', { 
         charityId: charityId || profile.charityChosen?._id,
         charityPercentage: charityPercentage || profile.charityPercentage
      }, config);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(API + '/api/user/subscription/subscribe', { plan }, config);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelSub = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(API + '/api/user/subscription/cancel', {}, config);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };
  
  const submitProof = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(API + '/api/user/submit-proof', { 
         drawId: profile.winData.drawId, 
         ticketId: profile.winData.ticketId,
         proofText
      }, config);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return (
     <div className="container flex justify-center items-center" style={{ height: '100vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid hsla(var(--color-primary), 0.3)', borderTopColor: 'hsl(var(--color-primary))', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
     </div>
  );

  const chartData = profile.scores.map(s => ({
    date: new Date(s.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}),
    score: s.score
  }));

  const avgScore = profile.scores.length > 0 
    ? (profile.scores.slice(-5).reduce((acc, curr) => acc + curr.score, 0) / Math.min(profile.scores.length, 5)).toFixed(1).replace(/\.0$/, '')
    : '—';

  const getSubBadgeColor = () => {
    if (profile.subscription.status === 'active') return 'hsl(var(--color-primary))';
    if (profile.subscription.status === 'expired') return 'hsl(var(--color-error))';
    return 'hsl(var(--color-text-muted))';
  };

  const getSubBadgeText = () => {
    if (profile.subscription.status === 'active') return 'Active ✅';
    if (profile.subscription.status === 'expired') return 'Expired ❌';
    return 'Inactive ⚠️';
  };

  const displayName = profile.name ? profile.name.split(' ')[0] : profile.email.split('@')[0];

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Welcome back, {displayName} 👋</h1>
          <p>Here is your performance overview.</p>
        </div>
        <div className="flex gap-4 items-center">
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="btn btn-primary" style={{ backgroundColor: '#FFD700', color: 'black', fontWeight: 'bold' }}>
               👑 Admin Panel
            </button>
          )}
          <button onClick={logout} className="btn btn-outline">Logout</button>
        </div>
      </div>

      {profile.winData && (
        <div className="card-premium mb-6" style={{ background: 'linear-gradient(45deg, hsla(var(--color-primary), 0.2), transparent)', borderColor: 'hsl(var(--color-primary))' }}>
           <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'hsl(var(--color-primary))' }}>🏆 Congratulations! You won the {profile.winData.monthName} Draw!</h2>
           <p className="text-muted mb-4">You matched {profile.winData.tier} numbers in the latest lotto calculation!</p>
           
           <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
              <p className="text-sm font-bold uppercase tracking-widest mb-2">Claim Requirements</p>
              
              {profile.winData.verificationStatus === 'pending' ? (
                <div>
                   <p className="text-sm text-muted mb-2">To disperse your prize, please upload proof of match (mock URL / text):</p>
                   <div className="flex gap-2">
                     <input type="text" placeholder="e.g., https://my-proof-image.com" value={proofText} onChange={(e) => setProofText(e.target.value)} style={{flex: 1}} />
                     <button className="btn btn-primary" onClick={submitProof}>Submit Proof</button>
                   </div>
                   {profile.winData.proofText && <p className="text-sm text-muted mt-2">Currently under manual admin review: <i>{profile.winData.proofText}</i></p>}
                </div>
              ) : profile.winData.verificationStatus === 'approved' ? (
                 <p style={{ color: 'hsl(var(--color-primary))' }}>✅ Your proof was approved securely! The platform is now routing payment via blockchain.</p>
              ) : profile.winData.verificationStatus === 'paid' ? (
                 <p style={{ color: 'hsl(var(--color-primary))' }}>💸 Payment successfully settled to your account.</p>
              ) : (
                 <p style={{ color: 'hsl(var(--color-error))' }}>❌ Submission rejected.</p>
              )}
           </div>
        </div>
      )}

      <div className="dashboard-grid mb-6">
        <div className="card-premium">
           <h3 className="text-muted text-xs uppercase tracking-widest mb-4">Account Status</h3>
           <div className="flex justify-between items-center">
             <div>
               <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: getSubBadgeColor() }}>
                  {getSubBadgeText()}
               </h2>
               {profile.subscription.status === 'active' && (
                  <p className="text-sm text-muted mb-0">
                    <span className="badge badge-success mt-2 mb-2">🎯 Eligible for Monthly Draw</span><br/>
                    Plan: {profile.subscription.plan} | Renews: {profile.subscription.renewalDate ? new Date(profile.subscription.renewalDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                  </p>
               )}
               {profile.subscription.status !== 'active' && (
                  <p className="text-sm text-muted mb-0">You are not eligible for draws or logging scores.</p>
               )}
             </div>
             
             <div>
               {profile.subscription.status !== 'active' ? (
                 <div className="flex gap-2">
                   <button onClick={() => handleSubscribe('monthly')} className="btn btn-outline" style={{padding: '0.5rem 1rem'}}>Sub Monthly</button>
                   <button onClick={() => handleSubscribe('yearly')} className="btn btn-primary" style={{padding: '0.5rem 1rem'}}>Sub Yearly</button>
                 </div>
               ) : (
                 <button onClick={handleCancelSub} className="btn btn-outline" style={{padding: '0.5rem 1rem', borderColor: 'hsl(var(--color-error))', color: 'hsl(var(--color-error))'}}>Cancel Plan</button>
               )}
             </div>
           </div>
        </div>

        <div className="card-premium">
          <h3 className="text-muted text-xs uppercase tracking-widest mb-4">Charity Binding</h3>
          <div className="flex gap-4">
             <select 
               value={profile.charityChosen?._id || ''} 
               onChange={(e) => handleCharityChange(e.target.value, null)}
               className="w-full bg-transparent border-white"
               style={{ flex: 2 }}
             >
               <option value="" disabled className="text-black">Select a Charity to Support</option>
               {charities.map(c => (
                 <option key={c._id} value={c._id} className="text-black">{c.name}</option>
               ))}
             </select>
             
             <select 
               value={profile.charityPercentage || 10} 
               onChange={(e) => handleCharityChange(null, parseInt(e.target.value))}
               className="bg-transparent border-white"
               style={{ flex: 1 }}
             >
               <option value={10} className="text-black">10%</option>
               <option value={15} className="text-black">15%</option>
               <option value={20} className="text-black">20%</option>
             </select>
          </div>
          
          {profile.charityChosen && (
             <p className="text-sm mt-0 mb-0" style={{ color: 'hsl(var(--color-primary))' }}>
               You contribute ₹{((profile.subscription.plan === 'yearly' ? 12000 : 1000) * (profile.charityPercentage / 100)).toFixed(0)}/month to charity.
             </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <StatCard title="Average Score" value={avgScore} primary={true} />
        <StatCard title="Rounds Tracked" value={profile.scores.length} />
      </div>

      <div className="dashboard-grid">
         {profile.scores.length > 0 ? (
           <ScoreChart data={chartData} />
         ) : (
           <div className="card-premium flex flex-col items-center justify-center text-center">
              <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏌️</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No scores yet</h3>
              <p className="text-muted">Start playing and logging rounds to train your handicap and qualify strictly for the draws.</p>
           </div>
         )}
         <ScoreForm onSubmit={handleScoreSubmit} error={formError} success={formSuccess} />
      </div>
    </div>
  );
};

export default Dashboard;
