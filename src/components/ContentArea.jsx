import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Copy, Check, ChevronRight, Zap, ArrowRight } from 'lucide-react';

const ContentArea = ({ step, section, steps, onStepChange }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const observerRef = useRef(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, String(entry.target.dataset.index)]));
          }
        });
      },
      { threshold: 0.1 }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    setVisibleCards(new Set());
    setTimeout(() => {
      const cards = document.querySelectorAll('.example-card');
      cards.forEach((card) => observerRef.current?.observe(card));
    }, 100);
    return () => observerRef.current?.disconnect();
  }, [step, section]);

  // ===== WELCOME HERO =====
  if (!step) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div className="light-beams">
          {[...Array(7)].map((_, i) => <div key={i} className="light-beam" />)}
        </div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 20px', maxWidth: '700px' }}>
          <div className="animate-fade-in-up stagger-1">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', background: 'rgba(255,69,0,0.1)', border: '1px solid rgba(255,69,0,0.2)',
              borderRadius: '50px', marginBottom: '24px',
            }}>
              <Zap size={14} style={{ color: '#ff4500' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#ff4500' }}>Interactive Learning Platform</span>
            </div>
          </div>

          <h1 className="animate-fade-in-up stagger-2" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '16px', color: '#fff' }}>
            Master <span className="gradient-text">English</span><br />Grammar
          </h1>

          <p className="animate-fade-in-up stagger-3" style={{ fontSize: '16px', color: '#9ca3af', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Learn step by step with interactive examples, patterns, and practice exercises
          </p>

          {/* Stats */}
          <div className="animate-fade-in-up stagger-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '400px', margin: '0 auto 40px' }}>
            {[
              { num: '10', label: 'Lessons' },
              { num: '50+', label: 'Topics' },
              { num: '200+', label: 'Examples' },
            ].map((stat, i) => (
              <div key={i} className="card-hover" style={{ padding: '16px', borderRadius: '12px', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="gradient-text" style={{ fontSize: '22px', fontWeight: 800 }}>{stat.num}</div>
                <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="animate-fade-in-up stagger-5">
            <button
              onClick={() => onStepChange && onStepChange(1)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 32px', background: 'linear-gradient(135deg, #ff4500, #f97316)',
                color: '#fff', borderRadius: '12px', fontWeight: 700, fontSize: '16px',
                textTransform: 'uppercase', letterSpacing: '1px', border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(255,69,0,0.3)', transition: 'all 0.3s', fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 12px 40px rgba(255,69,0,0.4)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 8px 30px rgba(255,69,0,0.3)'; }}
            >
              Start Learning <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== LESSON CONTENT =====
  const currentSection = section || (step?.sections && step.sections.length > 0 ? step.sections[0] : null);

  if (!currentSection) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9ca3af', fontSize: '16px' }}>No sections available. Please initialize the database.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>

      {/* ===== HERO BANNER ===== */}
      <div className="animate-fade-in-up" style={{
        position: 'relative', overflow: 'hidden', borderRadius: '16px', marginBottom: '28px',
        background: 'linear-gradient(135deg, #ff4500, #ea580c, #c2410c)',
      }}>
        <div className="light-beams" style={{ opacity: 0.3 }}>
          {[...Array(5)].map((_, i) => <div key={i} className="light-beam" />)}
        </div>

        {/* Large background number */}
        <div style={{
          position: 'absolute', right: '-10px', bottom: '-20px',
          fontSize: '10rem', fontWeight: 900, color: 'rgba(255,255,255,0.07)',
          lineHeight: 1, pointerEvents: 'none', fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {String(step.id).padStart(2, '0')}
        </div>

        <div style={{ position: 'relative', zIndex: 10, padding: '32px' }}>
          <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
            <span className="animate-float" style={{ fontSize: '52px' }}>{step.icon}</span>
            <div>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '4px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '6px' }}>
                Lesson {step.id} of {steps?.length || 10}
              </p>
              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px', color: '#fff',
              }}>
                {step.title}
              </h1>
              <div className="flex items-center gap-2" style={{ marginTop: '8px' }}>
                <ChevronRight size={14} style={{ color: 'rgba(255,237,213,0.8)' }} />
                <p style={{ fontSize: '14px', color: '#fed7aa', fontWeight: 500 }}>{currentSection.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION TABS ===== */}
      <div className="animate-fade-in-up stagger-1" style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '6px' }}>
        {step.sections.map((sec) => (
          <button
            key={sec.id}
            id={`tab-${sec.id}`}
            onClick={() => onStepChange && onStepChange(step.id, sec.id)}
            style={{
              whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '8px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none',
              transition: 'all 0.3s', fontFamily: 'inherit',
              background: currentSection.id === sec.id ? '#ff4500' : '#1a1a1a',
              color: currentSection.id === sec.id ? '#fff' : '#9ca3af',
              boxShadow: currentSection.id === sec.id ? '0 4px 15px rgba(255,69,0,0.3)' : 'none',
            }}
            onMouseEnter={(e) => { if (currentSection.id !== sec.id) { e.target.style.background = '#222'; e.target.style.color = '#fff'; } }}
            onMouseLeave={(e) => { if (currentSection.id !== sec.id) { e.target.style.background = '#1a1a1a'; e.target.style.color = '#9ca3af'; } }}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* ===== PATTERN CARD ===== */}
      {currentSection.pattern && (
        <div className="animate-fade-in-up stagger-2 shimmer-bg" style={{
          marginBottom: '20px', padding: '24px', borderRadius: '12px',
          background: '#1a1a1a', border: '1px solid rgba(255,69,0,0.2)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', background: 'linear-gradient(180deg, #ff4500, #ea580c)' }} />
          <div style={{ position: 'relative', zIndex: 10, paddingLeft: '12px' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
              <Zap size={14} style={{ color: '#ff4500' }} />
              <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', color: '#ff4500' }}>Pattern / அமைப்பு</h2>
            </div>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
              {currentSection.pattern}
            </p>
          </div>
        </div>
      )}

      {/* ===== EXPLANATION CARD ===== */}
      {currentSection.content && (
        <div className="animate-fade-in-up stagger-2" style={{
          marginBottom: '28px', padding: '24px', borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.05))',
          border: '1px solid rgba(34,197,94,0.15)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', background: 'linear-gradient(180deg, #22c55e, #10b981)' }} />
          <div style={{ position: 'relative', zIndex: 10, paddingLeft: '12px' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <BookOpen size={14} style={{ color: '#22c55e' }} />
              <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', color: '#22c55e' }}>Explanation / விளக்கம்</h2>
            </div>
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#d1d5db', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {currentSection.content}
            </p>
          </div>
        </div>
      )}

      {/* ===== EXAMPLES ===== */}
      {currentSection.examples && currentSection.examples.length > 0 && (
        <div className="animate-fade-in-up stagger-3">
          {/* Section header */}
          <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,69,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px' }}>📝</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Space Grotesk', sans-serif" }}>
              Examples
            </h2>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(255,69,0,0.3), transparent)' }} />
          </div>

          {/* Example cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentSection.examples.map((example, index) => (
              <div
                key={`${currentSection.id}-${index}`}
                data-index={index}
                className="example-card card-hover"
                style={{
                  padding: '16px 20px', borderRadius: '12px', background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden',
                  transition: 'all 0.5s ease', cursor: 'default',
                  opacity: visibleCards.has(String(index)) ? 1 : 0,
                  transform: visibleCards.has(String(index)) ? 'translateY(0)' : 'translateY(15px)',
                  transitionDelay: `${index * 60}ms`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                    {/* Number badge */}
                    <span style={{
                      flexShrink: 0, width: '30px', height: '30px', borderRadius: '8px',
                      background: 'rgba(255,69,0,0.1)', border: '1px solid rgba(255,69,0,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 700, color: '#ff4500',
                    }}>
                      {index + 1}
                    </span>
                    {/* Example text */}
                    <p style={{ fontSize: '15px', fontWeight: 500, color: '#e5e7eb', lineHeight: 1.6, paddingTop: '4px' }}>
                      {example}
                    </p>
                  </div>
                  {/* Copy button */}
                  <button
                    onClick={() => copyToClipboard(example, index)}
                    style={{
                      flexShrink: 0, padding: '6px', borderRadius: '6px', background: 'transparent',
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    title="Copy to clipboard"
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,69,0,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    {copiedIndex === index ? (
                      <Check size={15} style={{ color: '#22c55e' }} />
                    ) : (
                      <Copy size={15} style={{ color: '#6b7280' }} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== BOTTOM NAV ===== */}
      <div className="animate-fade-in-up" style={{
        marginTop: '48px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
          Lesson <span style={{ color: '#ff4500', fontWeight: 700 }}>{step.id}</span> of {steps?.length || 10}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {Array.from({ length: steps?.length || 10 }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => onStepChange && onStepChange(i + 1)}
              style={{
                width: i + 1 === step.id ? '20px' : '8px', height: '8px', borderRadius: '4px',
                background: i + 1 === step.id ? '#ff4500' : 'rgba(255,255,255,0.1)',
                border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                boxShadow: i + 1 === step.id ? '0 0 8px rgba(255,69,0,0.4)' : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentArea;
