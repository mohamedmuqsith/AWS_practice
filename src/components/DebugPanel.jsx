import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useGrammar } from '../context/GrammarContext';

const DebugPanel = () => {
  const { steps, loading } = useGrammar();
  const [expanded, setExpanded] = useState(false);
  const [dbStatus, setDbStatus] = useState('checking');
  const [initStatus, setInitStatus] = useState('');

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    try {
      const res = await fetch('/api/grammar');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data.length > 0 ? 'connected' : 'empty');
      } else {
        setDbStatus('error');
      }
    } catch {
      setDbStatus('offline');
    }
  };

  const handleInit = async () => {
    setInitStatus('Initializing...');
    try {
      const res = await fetch('/api/init');
      if (res.ok) {
        setInitStatus('✅ Database initialized! Refreshing...');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setInitStatus('❌ Initialization failed');
      }
    } catch (err) {
      setInitStatus(`❌ Error: ${err.message}`);
    }
  };

  const statusColor = {
    connected: '#22c55e',
    empty: '#f97316',
    error: '#ef4444',
    offline: '#ef4444',
    checking: '#6b7280'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '24px',
      zIndex: 40,
      background: '#1a1a1a',
      border: '1px solid rgba(255,69,0,0.2)',
      borderRadius: '12px',
      padding: '12px',
      maxWidth: '280px',
      fontFamily: 'monospace',
      fontSize: '11px'
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'transparent',
          border: 'none',
          color: '#ff4500',
          cursor: 'pointer',
          padding: '0',
          marginBottom: expanded ? '12px' : '0'
        }}
      >
        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <span>DEBUG INFO</span>
      </button>

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#d1d5db' }}>
          {/* Status */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor[dbStatus] }} />
              <span>DB Status: {dbStatus.toUpperCase()}</span>
            </div>
            <div style={{ color: '#6b7280', fontSize: '10px' }}>
              {dbStatus === 'empty' && 'Database connected but empty'}
              {dbStatus === 'connected' && 'Database has data'}
              {dbStatus === 'error' && 'API error'}
              {dbStatus === 'offline' && 'Cannot reach API'}
              {dbStatus === 'checking' && 'Checking...'}
            </div>
          </div>

          {/* Data Stats */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
            <div>Steps: <span style={{ color: '#ff4500' }}>{steps?.length || 0}</span></div>
            <div>
              Sections: <span style={{ color: '#22c55e' }}>
                {steps?.reduce((a, s) => a + (s.sections?.length || 0), 0) || 0}
              </span>
            </div>
            <div>
              Examples: <span style={{ color: '#3b82f6' }}>
                {steps?.reduce((a, s) => a + s.sections.reduce((b, sec) => b + (sec.examples?.length || 0), 0), 0) || 0}
              </span>
            </div>
          </div>

          {/* Init Button */}
          {(dbStatus === 'empty' || dbStatus === 'offline' || dbStatus === 'error') && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
              <button
                onClick={handleInit}
                style={{
                  width: '100%',
                  padding: '6px',
                  background: 'rgba(255,69,0,0.15)',
                  border: '1px solid rgba(255,69,0,0.3)',
                  color: '#ff4500',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={10} /> Init Database
              </button>
              {initStatus && (
                <div style={{
                  marginTop: '6px',
                  padding: '6px',
                  background: '#111',
                  borderRadius: '4px',
                  color: initStatus.includes('✅') ? '#22c55e' : '#ef4444'
                }}>
                  {initStatus}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
