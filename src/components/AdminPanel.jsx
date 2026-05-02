import React, { useState } from 'react';
import {
  Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronRight,
  LogOut, RotateCcw, BookOpen, Layers, FileText, Sparkles, GripVertical,
  MousePointerClick,
} from 'lucide-react';
import { useGrammar } from '../context/GrammarContext';

const EMOJIS = ['🎯','⏱️','📅','🚀','❓','🎤','📍','🔗','🎲','⚡','📚','💡','🔥','✨','🌟','💪','📖','🎓','🧠','💬'];

const AdminPanel = ({ onBack }) => {
  const {
    steps, logoutAdmin, addStep, updateStep, deleteStep,
    addSection, updateSection, deleteSection,
    addExample, updateExample, deleteExample, resetToDefault,
  } = useGrammar();

  const [expandedStep, setExpandedStep] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [editingStep, setEditingStep] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingExample, setEditingExample] = useState(null);
  const [showAddStep, setShowAddStep] = useState(false);
  const [showAddSection, setShowAddSection] = useState(null);
  const [showAddExample, setShowAddExample] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // 'content' or 'seo'
  const [seoKeyword, setSeoKeyword] = useState('');
  const [seoResults, setSeoResults] = useState(null);
  const [loadingSeo, setLoadingSeo] = useState(false);

  const handleAnalyzeSeo = async () => {
    if (!seoKeyword.trim()) return;
    setLoadingSeo(true);
    try {
      const response = await fetch('/api/seo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: seoKeyword.trim() })
      });
      const data = await response.json();
      setSeoResults(data);
    } catch (error) {
      console.error('SEO analysis failed:', error);
      alert('Failed to analyze SEO. Please try again.');
    } finally {
      setLoadingSeo(false);
    }
  };

  // Form states
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepIcon, setNewStepIcon] = useState('📚');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionPattern, setNewSectionPattern] = useState('');
  const [newExample, setNewExample] = useState('');
  const [editValue, setEditValue] = useState('');
  const [isAdvancedAdd, setIsAdvancedAdd] = useState(false);

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    background: '#111', border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit',
  };

  const btnPrimary = {
    padding: '8px 16px', borderRadius: '8px',
    background: 'linear-gradient(135deg, #ff4500, #f97316)',
    color: '#fff', fontWeight: 600, fontSize: '13px',
    border: 'none', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    fontFamily: 'inherit', transition: 'all 0.3s',
  };

  const btnDanger = {
    padding: '6px 12px', borderRadius: '6px',
    background: 'rgba(239,68,68,0.15)', color: '#ef4444',
    fontWeight: 600, fontSize: '12px',
    border: '1px solid rgba(239,68,68,0.2)',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px',
    fontFamily: 'inherit',
  };

  const btnGhost = {
    padding: '6px 12px', borderRadius: '6px',
    background: 'rgba(255,255,255,0.05)', color: '#9ca3af',
    fontWeight: 600, fontSize: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '2px',
    color: '#9ca3af', marginBottom: '6px',
  };

  // ===== MODAL OVERLAY =====
  const renderModal = (title, content, onClose) => (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#1a1a1a', borderRadius: '16px', padding: '28px',
        maxWidth: '500px', width: '100%',
        border: '1px solid rgba(255,69,0,0.25)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ff4500', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h3>
          <button onClick={onClose} style={{ ...btnGhost, padding: '4px 8px' }}><X size={14} /></button>
        </div>
        {content}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>

      {/* ===== ADMIN HEADER ===== */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #ea580c, #ff4500, #fb923c)' }} />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', maxWidth: '1200px', margin: '0 auto',
          flexWrap: 'wrap', gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #ff4500, #fb923c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                ADMIN <span className="gradient-text">PANEL</span>
              </h1>
              <p style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '2px', textTransform: 'uppercase' }}>
                {activeTab === 'content' ? 'Content Management' : 'SEO Optimization'}
              </p>
            </div>
          </div>
          
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px' }}>
            <button 
              onClick={() => setActiveTab('content')}
              style={{
                ...btnGhost,
                background: activeTab === 'content' ? 'rgba(255,69,0,0.1)' : 'transparent',
                color: activeTab === 'content' ? '#ff4500' : '#9ca3af',
                border: 'none', padding: '6px 16px', borderRadius: '8px'
              }}
            >
              <Layers size={14} /> Content
            </button>
            <button 
              onClick={() => setActiveTab('seo')}
              style={{
                ...btnGhost,
                background: activeTab === 'seo' ? 'rgba(255,69,0,0.1)' : 'transparent',
                color: activeTab === 'seo' ? '#ff4500' : '#9ca3af',
                border: 'none', padding: '6px 16px', borderRadius: '8px'
              }}
            >
              <Sparkles size={14} /> SEO Tools
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setConfirmReset(true)} style={btnGhost}>
              <RotateCcw size={12} /> Reset
            </button>
            <button onClick={onBack} style={btnGhost}>
              <BookOpen size={12} /> View Site
            </button>
            <button onClick={logoutAdmin} style={btnDanger}>
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* ===== RESET CONFIRM MODAL ===== */}
      {confirmReset && renderModal('Reset All Data?', (
        <div>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
            This will restore all lessons to default. Your custom changes will be lost.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setConfirmReset(false)} style={btnGhost}><X size={12} /> Cancel</button>
            <button onClick={() => { resetToDefault(); setConfirmReset(false); }} style={btnDanger}><RotateCcw size={12} /> Reset</button>
          </div>
        </div>
      ), () => setConfirmReset(false))}

      {/* ===== ADD LESSON MODAL ===== */}
      {showAddStep && renderModal(isAdvancedAdd ? 'Create Complete Lesson' : 'Add New Lesson', (
        <div style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '4px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Lesson Title</label>
            <input
              value={newStepTitle}
              onChange={(e) => setNewStepTitle(e.target.value)}
              placeholder="e.g. Articles, Prepositions, Conditionals"
              style={inputStyle}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Choose Icon</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setNewStepIcon(e)} style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  border: 'none', cursor: 'pointer', fontSize: '18px',
                  background: newStepIcon === e ? 'rgba(255,69,0,0.25)' : '#111',
                  outline: newStepIcon === e ? '2px solid #ff4500' : '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.2s',
                }}>{e}</button>
              ))}
            </div>
          </div>

          <div style={{ 
            marginBottom: '20px', padding: '16px', 
            background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff4500', textTransform: 'uppercase' }}>Initial Content (Optional)</span>
              <button 
                onClick={() => setIsAdvancedAdd(!isAdvancedAdd)}
                style={{ ...btnGhost, padding: '4px 8px', fontSize: '10px' }}
              >
                {isAdvancedAdd ? 'Simple Add' : 'Add Section & Example'}
              </button>
            </div>

            {isAdvancedAdd && (
              <div className="animate-fade-in-up">
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ ...labelStyle, fontSize: '10px' }}>First Section Title</label>
                  <input
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="e.g. Usage & Rules"
                    style={{ ...inputStyle, padding: '8px 12px' }}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ ...labelStyle, fontSize: '10px' }}>Grammar Pattern</label>
                  <input
                    value={newSectionPattern}
                    onChange={(e) => setNewSectionPattern(e.target.value)}
                    placeholder="e.g. Subject + Verb"
                    style={{ ...inputStyle, padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: '10px' }}>Example Sentence</label>
                  <input
                    value={newExample}
                    onChange={(e) => setNewExample(e.target.value)}
                    placeholder="e.g. I am a student."
                    style={{ ...inputStyle, padding: '8px 12px' }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button onClick={() => setShowAddStep(false)} style={btnGhost}><X size={12} /> Cancel</button>
            <button onClick={async () => {
              if (newStepTitle.trim()) {
                // 1. Add the step
                const newStep = await addStep({ 
                  title: newStepTitle.trim(), 
                  icon: newStepIcon, 
                  color: 'from-orange-400 to-orange-600' 
                });
                
                if (newStep && isAdvancedAdd && newSectionTitle.trim()) {
                  // 2. Add the section
                  const newSec = await addSection(newStep.id, { 
                    title: newSectionTitle.trim(), 
                    pattern: newSectionPattern.trim() 
                  });
                  
                  if (newSec && newExample.trim()) {
                    // 3. Add the example
                    await addExample(newStep.id, newSec.id, newExample.trim());
                  }
                }
                
                // Reset and close
                setNewStepTitle('');
                setNewStepIcon('📚');
                setNewSectionTitle('');
                setNewSectionPattern('');
                setNewExample('');
                setShowAddStep(false);
                setIsAdvancedAdd(false);
                if (newStep) setExpandedStep(newStep.id);
              }
            }} style={btnPrimary}><Save size={12} /> Save Lesson</button>
          </div>
        </div>
      ), () => setShowAddStep(false))}

      {/* ===== SEO TAB CONTENT ===== */}
      {activeTab === 'seo' && (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
          <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,69,0,0.15)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>SEO <span className="gradient-text">ANALYZER</span></h2>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>Analyze keywords and search trends using the Serper API to improve your content's visibility.</p>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <input 
                value={seoKeyword}
                onChange={(e) => setSeoKeyword(e.target.value)}
                placeholder="Enter keyword (e.g. English Grammar Tenses)"
                style={inputStyle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAnalyzeSeo();
                }}
              />
              <button 
                onClick={handleAnalyzeSeo}
                disabled={loadingSeo || !seoKeyword.trim()}
                style={{ ...btnPrimary, padding: '0 24px', height: '42px', opacity: loadingSeo ? 0.6 : 1 }}
              >
                {loadingSeo ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>

            {seoResults && (
              <div className="animate-fade-in">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                  {/* Organic Results */}
                  <div>
                    <h3 style={labelStyle}>Top Search Results</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {seoResults.organic?.map((res, i) => (
                        <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <a href={res.link} target="_blank" rel="noreferrer" style={{ color: '#ff4500', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>{res.title}</a>
                          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', lineHeight: '1.4' }}>{res.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* People Also Ask & Related */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {seoResults.peopleAlsoAsk && seoResults.peopleAlsoAsk.length > 0 && (
                      <div>
                        <h3 style={labelStyle}>People Also Ask</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {seoResults.peopleAlsoAsk.map((q, i) => (
                            <span key={i} style={{ padding: '6px 12px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', borderRadius: '20px', fontSize: '11px', border: '1px solid rgba(34,197,94,0.2)' }}>
                              {q.question}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {seoResults.relatedSearches && seoResults.relatedSearches.length > 0 && (
                      <div>
                        <h3 style={labelStyle}>Related Keywords</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {seoResults.relatedSearches.map((kw, i) => (
                            <span key={i} style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '20px', fontSize: '11px', border: '1px solid rgba(59,130,246,0.2)' }}>
                              {kw.query}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'rgba(255,69,0,0.05)', borderRadius: '12px', border: '1px solid rgba(255,69,0,0.2)' }}>
                  <h3 style={{ ...labelStyle, color: '#ff4500' }}>SEO Recommendations</h3>
                  <ul style={{ color: '#d1d5db', fontSize: '13px', paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li>Target keywords: <strong>{seoResults.relatedSearches?.[0]?.query || seoKeyword}</strong> and <strong>{seoResults.relatedSearches?.[1]?.query || 'online grammar'}</strong>.</li>
                    <li>Consider creating content answering questions like: <em>"{seoResults.peopleAlsoAsk?.[0]?.question || 'How to learn grammar?'}"</em></li>
                    <li>Use a meta title around 50-60 characters including the primary keyword.</li>
                    <li>Ensure your description is compelling and contains the keyword.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== CONTENT TAB CONTENT ===== */}
      {activeTab === 'content' && (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Stats bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px', marginBottom: '28px',
        }}>
          {[
            { icon: <Layers size={16} />, num: steps.length, label: 'Lessons', color: '#ff4500' },
            { icon: <FileText size={16} />, num: steps.reduce((a, s) => a + (s.sections?.length || 0), 0), label: 'Sections', color: '#22c55e' },
            { icon: <Sparkles size={16} />, num: steps.reduce((a, s) => a + (s.sections || []).reduce((b, sec) => b + (sec.examples?.length || 0), 0), 0), label: 'Examples', color: '#3b82f6' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#1a1a1a', borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '16px', display: 'flex', alignItems: 'center', gap: '12px',
              animation: `fadeInUp 0.5s ease-out ${i * 0.1}s forwards`,
              opacity: 0
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: `${stat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: stat.color,
              }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{stat.num}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== LESSONS HEADER ===== */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '8px',
        }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px',
            fontWeight: 700, color: '#fff', textTransform: 'uppercase',
          }}>
            <span className="gradient-text">Lessons</span>
            <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '10px', fontWeight: 500 }}>
              ({steps.length})
            </span>
          </h2>
          <button
            onClick={() => { setShowAddStep(true); setNewStepTitle(''); setNewStepIcon('📚'); }}
            style={btnPrimary}
          >
            <Plus size={14} /> Add Lesson
          </button>
        </div>

        {/* ===== HINT TEXT ===== */}
        <p style={{
          fontSize: '12px', color: '#6b7280', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <MousePointerClick size={12} style={{ color: '#ff4500' }} />
          Click on any lesson below to expand it and manage sections & examples
        </p>

        {/* ===== LESSONS LIST ===== */}
        {steps.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: '#1a1a1a', borderRadius: '16px',
            border: '1px dashed rgba(255,69,0,0.3)',
          }}>
            <p style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '16px' }}>
              No lessons yet. Click "Add Lesson" to create your first lesson.
            </p>
            <button
              onClick={() => { setShowAddStep(true); setNewStepTitle(''); setNewStepIcon('📚'); }}
              style={btnPrimary}
            >
              <Plus size={14} /> Add Your First Lesson
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {steps.map((step) => (
              <div key={step.id} style={{
                background: '#1a1a1a', borderRadius: '12px',
                border: expandedStep === step.id
                  ? '2px solid rgba(255,69,0,0.4)'
                  : '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s',
              }}>

                {/* ===== LESSON CARD HEADER ===== */}
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', cursor: 'pointer',
                    background: expandedStep === step.id ? 'rgba(255,69,0,0.05)' : 'transparent',
                    transition: 'background 0.3s',
                  }}
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                >
                  {/* Left side: icon + title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <span style={{ fontSize: '28px' }}>{step.icon}</span>
                    {editingStep === step.id ? (
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') { updateStep(step.id, { title: editValue }); setEditingStep(null); }
                          if (e.key === 'Escape') setEditingStep(null);
                        }}
                        style={{ ...inputStyle, width: '250px' }}
                        autoFocus
                      />
                    ) : (
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                          {step.title}
                        </h3>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>
                          {step.sections?.length || 0} sections &middot; {(step.sections || []).reduce((a, s) => a + (s.examples?.length || 0), 0)} examples
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right side: actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {editingStep === step.id ? (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); updateStep(step.id, { title: editValue }); setEditingStep(null); }}
                          style={{ ...btnPrimary, padding: '6px 12px', fontSize: '12px' }}><Save size={12} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingStep(null); }}
                          style={{ ...btnGhost, padding: '6px 12px' }}><X size={12} /></button>
                      </>
                    ) : (
                      <>
                        <span style={{
                          padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                          background: 'rgba(255,69,0,0.15)', color: '#ff4500',
                          border: '1px solid rgba(255,69,0,0.25)',
                        }}>#{step.id}</span>
                        <button onClick={(e) => { e.stopPropagation(); setEditingStep(step.id); setEditValue(step.title); }}
                          style={{ ...btnGhost, padding: '6px 8px' }} title="Edit lesson title"><Edit3 size={13} /></button>
                        <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`Delete lesson "${step.title}"?`)) deleteStep(step.id); }}
                          style={{ ...btnDanger, padding: '6px 8px' }} title="Delete lesson"><Trash2 size={13} /></button>
                      </>
                    )}
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '6px',
                      background: expandedStep === step.id ? 'rgba(255,69,0,0.2)' : 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s',
                    }}>
                      {expandedStep === step.id
                        ? <ChevronDown size={16} style={{ color: '#ff4500' }} />
                        : <ChevronRight size={16} style={{ color: '#6b7280' }} />
                      }
                    </div>
                  </div>
                </div>

                {/* ===== EXPANDED: SECTIONS AREA ===== */}
                {expandedStep === step.id && (
                  <div style={{
                    padding: '0 20px 20px', borderTop: '1px solid rgba(255,69,0,0.15)',
                    background: 'rgba(255,69,0,0.02)',
                  }}>
                    {/* Sections header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 0 12px',
                    }}>
                      <span style={{
                        fontSize: '13px', fontWeight: 700, color: '#ff4500',
                        textTransform: 'uppercase', letterSpacing: '1px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}>
                        <FileText size={14} /> Sections ({step.sections?.length || 0})
                      </span>
                      <button
                        onClick={() => { setShowAddSection(step.id); setNewSectionTitle(''); setNewSectionPattern(''); }}
                        style={{ ...btnPrimary, padding: '6px 14px', fontSize: '12px' }}
                      >
                        <Plus size={12} /> Add Section
                      </button>
                    </div>

                    {/* Add Section Form (inline) */}
                    {showAddSection === step.id && (
                      <div style={{
                        background: '#111', borderRadius: '10px', padding: '16px',
                        marginBottom: '12px', border: '1px solid rgba(255,69,0,0.2)',
                      }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          <div style={{ flex: 1, minWidth: '180px' }}>
                            <label style={labelStyle}>Section Title</label>
                            <input
                              value={newSectionTitle}
                              onChange={(e) => setNewSectionTitle(e.target.value)}
                              placeholder="e.g. Affirmative, Negative, Questions"
                              style={inputStyle}
                              autoFocus
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: '180px' }}>
                            <label style={labelStyle}>Grammar Pattern</label>
                            <input
                              value={newSectionPattern}
                              onChange={(e) => setNewSectionPattern(e.target.value)}
                              placeholder="e.g. Subject + Verb + Object"
                              style={inputStyle}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button onClick={() => setShowAddSection(null)} style={btnGhost}><X size={12} /> Cancel</button>
                          <button onClick={() => {
                            if (newSectionTitle.trim()) {
                              addSection(step.id, { title: newSectionTitle.trim(), pattern: newSectionPattern.trim() });
                              setShowAddSection(null);
                            }
                          }} style={{ ...btnPrimary, fontSize: '12px' }}><Save size={12} /> Save Section</button>
                        </div>
                      </div>
                    )}

                    {/* Sections List */}
                    {(step.sections?.length || 0) === 0 ? (
                      <div style={{
                        textAlign: 'center', padding: '30px',
                        background: '#111', borderRadius: '10px',
                        border: '1px dashed rgba(255,255,255,0.1)',
                      }}>
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>
                          No sections yet. Click <strong style={{ color: '#ff4500' }}>"+ Add Section"</strong> above to create one.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {step.sections.map((sec) => (
                          <div key={sec.id} style={{
                            background: '#111', borderRadius: '10px',
                            border: expandedSection === sec.id
                              ? '1px solid rgba(255,69,0,0.2)'
                              : '1px solid rgba(255,255,255,0.06)',
                            overflow: 'hidden',
                            transition: 'all 0.3s',
                          }}>

                            {/* Section Header */}
                            <div
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '12px 14px', cursor: 'pointer',
                                background: expandedSection === sec.id ? 'rgba(255,69,0,0.03)' : 'transparent',
                              }}
                              onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                <div style={{
                                  width: '8px', height: '8px', borderRadius: '50%',
                                  background: '#ff4500', flexShrink: 0,
                                }} />
                                {editingSection === sec.id ? (
                                  <input
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') { updateSection(step.id, sec.id, { title: editValue }); setEditingSection(null); }
                                      if (e.key === 'Escape') setEditingSection(null);
                                    }}
                                    style={{ ...inputStyle, width: '220px', padding: '6px 10px', fontSize: '13px' }}
                                    autoFocus
                                  />
                                ) : (
                                  <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#e5e7eb' }}>{sec.title}</h4>
                                    {sec.pattern && (
                                      <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '3px' }}>
                                        Pattern: {sec.pattern}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                <span style={{
                                  padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 600,
                                  background: 'rgba(107,114,128,0.15)', color: '#9ca3af',
                                  border: '1px solid rgba(107,114,128,0.2)',
                                }}>{sec.examples?.length || 0} ex</span>
                                {editingSection === sec.id ? (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); updateSection(step.id, sec.id, { title: editValue }); setEditingSection(null); }}
                                      style={{ ...btnPrimary, padding: '4px 8px', fontSize: '11px' }}><Save size={10} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); setEditingSection(null); }}
                                      style={{ ...btnGhost, padding: '4px 8px' }}><X size={10} /></button>
                                  </>
                                ) : (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); setEditingSection(sec.id); setEditValue(sec.title); }}
                                      style={{ ...btnGhost, padding: '4px 8px' }} title="Edit section"><Edit3 size={11} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`Delete section "${sec.title}"?`)) deleteSection(step.id, sec.id); }}
                                      style={{ ...btnDanger, padding: '4px 8px' }} title="Delete section"><Trash2 size={11} /></button>
                                  </>
                                )}
                                {expandedSection === sec.id
                                  ? <ChevronDown size={14} style={{ color: '#ff4500' }} />
                                  : <ChevronRight size={14} style={{ color: '#4b5563' }} />
                                }
                              </div>
                            </div>

                            {/* ===== EXPANDED: EXAMPLES ===== */}
                            {expandedSection === sec.id && (
                              <div style={{
                                padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.05)',
                                background: 'rgba(0,0,0,0.2)',
                              }}>
                                {/* Examples header */}
                                <div style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  marginBottom: '10px',
                                }}>
                                  <span style={{
                                    fontSize: '11px', fontWeight: 700, color: '#22c55e',
                                    textTransform: 'uppercase', letterSpacing: '1px',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                  }}>
                                    <Sparkles size={11} /> Examples ({sec.examples?.length || 0})
                                  </span>
                                  <button
                                    onClick={() => { setShowAddExample(`${step.id}-${sec.id}`); setNewExample(''); }}
                                    style={{ ...btnPrimary, padding: '5px 12px', fontSize: '11px' }}
                                  >
                                    <Plus size={10} /> Add Example
                                  </button>
                                </div>

                                {/* Add Example Form */}
                                {showAddExample === `${step.id}-${sec.id}` && (
                                  <div style={{
                                    display: 'flex', gap: '8px', marginBottom: '10px',
                                    background: '#1a1a1a', padding: '10px', borderRadius: '8px',
                                    border: '1px solid rgba(255,69,0,0.15)',
                                  }}>
                                    <textarea
                                      value={newExample}
                                      onChange={(e) => setNewExample(e.target.value)}
                                      placeholder="Type example sentences (one per line)..."
                                      style={{ ...inputStyle, flex: 1, padding: '8px 12px', fontSize: '13px', height: '80px', resize: 'none' }}
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey && newExample.trim()) {
                                          e.preventDefault();
                                          const examples = newExample.split('\n').filter(ex => ex.trim());
                                          examples.forEach(ex => addExample(step.id, sec.id, ex.trim()));
                                          setNewExample('');
                                        }
                                      }}
                                    />
                                    <button onClick={() => {
                                      if (newExample.trim()) {
                                        const examples = newExample.split('\n').filter(ex => ex.trim());
                                        examples.forEach(ex => addExample(step.id, sec.id, ex.trim()));
                                        setNewExample('');
                                      }
                                    }} style={{ ...btnPrimary, padding: '8px 12px' }}><Save size={12} /></button>
                                    <button onClick={() => setShowAddExample(null)} style={{ ...btnGhost, padding: '8px' }}><X size={12} /></button>
                                  </div>
                                )}

                                {/* Examples List */}
                                {sec.examples && sec.examples.length > 0 ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {sec.examples.map((ex, exIdx) => (
                                      <div key={exIdx} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                                        padding: '8px 12px', borderRadius: '8px', background: '#0a0a0a',
                                        border: '1px solid rgba(255,255,255,0.04)',
                                      }}>
                                        {editingExample === `${sec.id}-${exIdx}` ? (
                                          <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
                                            <input
                                              value={editValue}
                                              onChange={(e) => setEditValue(e.target.value)}
                                              style={{ ...inputStyle, flex: 1, padding: '6px 10px', fontSize: '13px' }}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') { updateExample(step.id, sec.id, exIdx, editValue); setEditingExample(null); }
                                                if (e.key === 'Escape') setEditingExample(null);
                                              }}
                                              autoFocus
                                            />
                                            <button onClick={() => { updateExample(step.id, sec.id, exIdx, editValue); setEditingExample(null); }}
                                              style={{ ...btnPrimary, padding: '4px 8px' }}><Save size={10} /></button>
                                            <button onClick={() => setEditingExample(null)}
                                              style={{ ...btnGhost, padding: '4px 8px' }}><X size={10} /></button>
                                          </div>
                                        ) : (
                                          <>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                              <span style={{
                                                fontSize: '11px', fontWeight: 700, color: '#ff4500', minWidth: '22px',
                                              }}>{exIdx + 1}.</span>
                                              <span style={{ fontSize: '13px', color: '#d1d5db' }}>{ex}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                              <button onClick={() => { setEditingExample(`${sec.id}-${exIdx}`); setEditValue(ex); }}
                                                style={{ ...btnGhost, padding: '4px 6px', border: 'none' }} title="Edit example"><Edit3 size={11} /></button>
                                              <button onClick={() => { if (window.confirm('Delete this example?')) deleteExample(step.id, sec.id, exIdx); }}
                                                style={{ ...btnDanger, padding: '4px 6px', border: 'none', background: 'transparent' }} title="Delete example"><Trash2 size={11} /></button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div style={{
                                    textAlign: 'center', padding: '20px',
                                    background: '#0a0a0a', borderRadius: '8px',
                                    border: '1px dashed rgba(255,255,255,0.08)',
                                  }}>
                                    <p style={{ fontSize: '12px', color: '#4b5563' }}>
                                      No examples yet. Click <strong style={{ color: '#22c55e' }}>"+ Add Example"</strong> above.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);
};

export default AdminPanel;
