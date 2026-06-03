import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://zenmenu.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass" style={{ padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <h2 className="gold-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h2>
        {error && <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #333', background: '#111', color: '#fff' }}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #333', background: '#111', color: '#fff' }}
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
