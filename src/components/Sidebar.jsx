import React from 'react';
import { ChevronDown, BookMarked } from 'lucide-react';

const stepColors = [
  '#3b82f6', '#22c55e', '#a855f7', '#eab308', '#ef4444',
  '#ec4899', '#6366f1', '#06b6d4', '#f97316', '#14b8a6',
];

const Sidebar = ({ steps, activeStep, onStepChange, expandedStep, onToggleStep, menuOpen, setMenuOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {menuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 40 }}
          className="lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        id="sidebar"
        className={`fixed left-0 top-0 h-screen overflow-y-auto z-40 transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: '270px', background: '#111111', borderRight: '1px solid rgba(255,255,255,0.05)', paddingTop: '90px', paddingBottom: '24px' }}
      >
        {/* Title */}
        <div style={{ padding: '0 20px', marginBottom: '20px' }}>
          <div className="flex items-center gap-2 mb-1">
            <BookMarked size={16} style={{ color: '#ff4500' }} />
            <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', color: '#ff4500' }}>Lessons</h2>
          </div>
          <div style={{ height: '2px', width: '40px', background: 'linear-gradient(90deg, #ff4500, transparent)', borderRadius: '2px' }} />
        </div>

        <div style={{ padding: '0 10px' }}>
          {steps.map((step, idx) => (
            <div key={step.id} style={{ marginBottom: '2px' }}>
              <button
                id={`sidebar-step-${step.id}`}
                onClick={() => {
                  onStepChange(step.id);
                  onToggleStep(step.id);
                }}
                className={activeStep === step.id ? 'sidebar-active' : ''}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: '10px',
                  transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: activeStep === step.id ? 'rgba(255,69,0,0.12)' : 'transparent',
                  color: activeStep === step.id ? '#fff' : '#9ca3af',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => { if (activeStep !== step.id) e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { if (activeStep !== step.id) e.target.style.background = 'transparent'; }}
              >
                <span className="flex items-center gap-3">
                  <span style={{
                    width: '30px', height: '30px', borderRadius: '8px', background: stepColors[idx],
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                    boxShadow: `0 2px 8px ${stepColors[idx]}40`
                  }}>
                    {step.icon}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{step.title}</span>
                </span>
                <ChevronDown
                  size={14}
                  style={{
                    transition: 'transform 0.3s',
                    transform: expandedStep === step.id ? 'rotate(180deg)' : 'rotate(0)',
                    color: expandedStep === step.id ? '#ff4500' : '#4b5563',
                  }}
                />
              </button>

              {/* Sub-sections */}
              <div style={{
                overflow: 'hidden', transition: 'max-height 0.4s ease, opacity 0.3s ease',
                maxHeight: expandedStep === step.id ? '400px' : '0px',
                opacity: expandedStep === step.id ? 1 : 0,
              }}>
                <div style={{ marginLeft: '24px', marginTop: '4px', marginBottom: '8px', borderLeft: '2px solid rgba(255,69,0,0.2)', paddingLeft: '0' }}>
                  {step.sections.map((section) => (
                    <button
                      key={section.id}
                      id={`sidebar-section-${section.id}`}
                      onClick={() => {
                        onStepChange(step.id, section.id);
                        if (window.innerWidth < 1024) setMenuOpen(false);
                      }}
                      style={{
                        width: '100%', textAlign: 'left', padding: '7px 12px', fontSize: '12px',
                        fontWeight: 500, color: '#6b7280', background: 'transparent', border: 'none',
                        borderRadius: '0 8px 8px 0', cursor: 'pointer', transition: 'all 0.2s',
                        fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px',
                      }}
                      onMouseEnter={(e) => { e.target.style.color = '#ff4500'; e.target.style.background = 'rgba(255,69,0,0.05)'; }}
                      onMouseLeave={(e) => { e.target.style.color = '#6b7280'; e.target.style.background = 'transparent'; }}
                    >
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,69,0,0.4)', flexShrink: 0 }} />
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div style={{
          margin: '24px 16px 0', padding: '16px', borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(255,69,0,0.08), rgba(154,52,18,0.08))',
          border: '1px solid rgba(255,69,0,0.1)',
        }}>
          <p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>Total Progress</p>
          <div className="flex items-end gap-1">
            <span className="gradient-text" style={{ fontSize: '24px', fontWeight: 800 }}>{steps.length}</span>
            <span style={{ fontSize: '11px', color: '#6b7280', marginBottom: '3px' }}>lessons available</span>
          </div>
          <div style={{ marginTop: '10px', height: '4px', background: '#0a0a0a', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '30%', background: 'linear-gradient(90deg, #ff4500, #fb923c)', borderRadius: '4px' }} />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
