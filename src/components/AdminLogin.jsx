import React, { useState } from 'react';
import { Lock, LogIn } from 'lucide-react';
import { useGrammar } from '../context/GrammarContext';

const AdminLogin = () => {
  const { loginAdmin } = useGrammar();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      setError('');
    } else {
      setError('Incorrect password');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0a', padding: '20px',
    }}>
      <div className="light-beams">
        {[...Array(7)].map((_, i) => <div key={i} className="light-beam" />)}
      </div>

      <div style={{
        position: 'relative', zIndex: 10, width: '100%', maxWidth: '400px',
        background: '#1a1a1a', borderRadius: '16px', padding: '40px',
        border: '1px solid rgba(255,69,0,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        animation: shake ? 'shake 0.5s ease-in-out' : undefined,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #ff4500, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(255,69,0,0.3)',
          }}>
            <Lock size={28} color="#fff" />
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>
            Admin <span className="gradient-text">Access</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>Enter password to manage content</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: '#9ca3af', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter admin password"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px',
                background: '#111', border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff4500'}
              onBlur={(e) => e.target.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.1)'}
            />
            {error && (
              <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>{error}</p>
            )}
          </div>

          <button type="submit" style={{
            width: '100%', padding: '12px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #ff4500, #f97316)', color: '#fff',
            fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
            boxShadow: '0 4px 15px rgba(255,69,0,0.3)', transition: 'all 0.3s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,69,0,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,69,0,0.3)'; }}
          >
            <LogIn size={16} /> Sign In
          </button>
        </form>

        <p style={{ fontSize: '11px', color: '#4b5563', textAlign: 'center', marginTop: '20px' }}>
          Default password: <span style={{ color: '#9ca3af' }}></span>
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
