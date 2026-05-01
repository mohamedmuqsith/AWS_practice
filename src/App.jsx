import React, { useState } from 'react';
import './index.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import DebugPanel from './components/DebugPanel';
import ChatTutor from './components/ChatTutor';
import { useGrammar } from './context/GrammarContext';
import { Shield } from 'lucide-react';

function App() {
  const { steps, isAdmin, loading } = useGrammar();
  const [activeStep, setActiveStep] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleStepChange = (stepId, sectionId = null) => {
    setActiveStep(stepId);
    setActiveSection(sectionId);
    setExpandedStep(stepId);
    setShowAdmin(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleStep = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  // If admin route requested but not logged in, show login
  if (showAdmin && !isAdmin) {
    return <AdminLogin />;
  }

  // If admin is logged in and on admin route, show panel
  if (showAdmin && isAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  if (loading || !steps || steps.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="glow-dot" style={{ margin: '0 auto 16px', animation: 'glowPulse 1s ease-in-out infinite' }} />
          <p style={{ color: '#ff4500', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Loading Data...</p>
        </div>
      </div>
    );
  }

  const currentStep = steps.find((step) => step.id === activeStep);
  const currentSection = currentStep?.sections.find(
    (section) => section.id === activeSection
  );

  return (
    <div className="hero-pattern" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <Sidebar
        steps={steps}
        activeStep={activeStep}
        onStepChange={handleStepChange}
        expandedStep={expandedStep}
        onToggleStep={handleToggleStep}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main style={{ marginLeft: '0', paddingTop: '100px', paddingBottom: '48px', minHeight: '100vh' }} className="lg:!ml-[270px]">
        <div style={{ padding: '0 16px' }} className="md:!px-8 lg:!px-12">
          <ContentArea
            step={currentStep}
            section={currentSection}
            steps={steps}
            onStepChange={handleStepChange}
          />
        </div>
      </main>

      {/* Admin FAB Button */}
      <button
        id="admin-fab"
        onClick={() => setShowAdmin(true)}
        title="Admin Panel"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 50,
          width: '50px', height: '50px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #ff4500, #f97316)',
          border: 'none', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(255,69,0,0.4)',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,69,0,0.5)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,69,0,0.4)'; }}
      >
        <Shield size={22} color="#fff" />
      </button>

      {/* Chat Bot Interface */}
      <ChatTutor />

      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
}

export default App;
