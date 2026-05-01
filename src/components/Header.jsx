import React from 'react';
import { BookOpen, Menu, X, Sparkles } from 'lucide-react';

const Header = ({ menuOpen, setMenuOpen }) => {
  return (
    <header id="main-header" className="fixed top-0 left-0 right-0 z-50 glass-header">
      {/* Orange accent line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #ea580c, #ff4500, #fb923c)' }} />

      {/* Glow dots */}
      <div className="hidden md:flex justify-center gap-16 py-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
        {[...Array(7)].map((_, i) => (
          <div key={i} className="glow-dot" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>

      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff4500, #fb923c)', boxShadow: '0 4px 15px rgba(255,69,0,0.3)' }}>
              <BookOpen size={20} color="#fff" />
            </div>
            <Sparkles size={12} className="absolute -top-1 -right-1 animate-float" style={{ color: '#fb923c' }} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#fff' }}>
              ENGLISH <span className="gradient-text">GRAMMAR</span>
            </h1>
            <p style={{ fontSize: '9px', letterSpacing: '3px', color: 'rgba(251,146,60,0.7)', textTransform: 'uppercase', fontWeight: 500 }}>Master the Language</p>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          id="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg"
          style={{ color: '#fff' }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
