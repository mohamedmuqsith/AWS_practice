import React, { useState } from 'react';
import {
  Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronRight,
  LogOut, RotateCcw, BookOpen, Layers, FileText, Sparkles, GripVertical,
} from 'lucide-react';
import { useGrammar } from '../context/GrammarContext';

const EMOJIS = ['🎯','⏱️','📅','🚀','❓','🎤','📍','🔗','🎲','⚡','📚','💡','🔥','✨','🌟','💪','📖','🎓','🧠','💬'];

// ===== REUSABLE STYLES =====
const S = {
  card: { background: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', marginBottom: '12px' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit' },
  btnPrimary: { padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #ff4500, #f97316)', color: '#fff', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit', transition: 'all 0.3s' },
  btnDanger: { padding: '6px 12px', borderRadius: '6px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 600, fontSize: '12px', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' },
  btnGhost: { padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#9ca3af', fontWeight: 600, fontSize: '12px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' },
  label: { display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: '#9ca3af', marginBottom: '6px' },
  badge: (color) => ({ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: `${color}20`, color: color, border: `1px solid ${color}30` }),
};

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

  // Form states
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepIcon, setNewStepIcon] = useState('📚');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionPattern, setNewSectionPattern] = useState('');
  const [newExample, setNewExample] = useState('');
  const [editValue, setEditValue] = useState('');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* ===== ADMIN HEADER ===== */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #ea580c, #ff4500, #fb923c)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #ff4500, #fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                ADMIN <span className="gradient-text">PANEL</span>
              </h1>
              <p style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '2px', textTransform: 'uppercase' }}>Content Management</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setConfirmReset(true)} style={{ ...S.btnGhost }}>
              <RotateCcw size={12} /> Reset
            </button>
            <button onClick={onBack} style={{ ...S.btnGhost }}>
              <BookOpen size={12} /> View Site
            </button>
            <button onClick={logoutAdmin} style={{ ...S.btnDanger }}>
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* ===== RESET CONFIRM MODAL ===== */}
      {confirmReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%', border: '1px solid rgba(239,68,68,0.2)' }}>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Reset All Data?</h3>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>This will restore all lessons to default. Your custom changes will be lost.</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmReset(false)} style={S.btnGhost}><X size={12} /> Cancel</button>
              <button onClick={() => { resetToDefault(); setConfirmReset(false); }} style={S.btnDanger}><RotateCcw size={12} /> Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '28px' }}>
          {[
            { icon: <Layers size={16} />, num: steps.length, label: 'Lessons', color: '#ff4500' },
            { icon: <FileText size={16} />, num: steps.reduce((a, s) => a + s.sections.length, 0), label: 'Sections', color: '#22c55e' },
            { icon: <Sparkles size={16} />, num: steps.reduce((a, s) => a + s.sections.reduce((b, sec) => b + (sec.examples?.length || 0), 0), 0), label: 'Examples', color: '#3b82f6' },
          ].map((stat, i) => (
            <div key={i} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{stat.num}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>
            <span className="gradient-text">Lessons</span>
          </h2>
          <button onClick={() => { setShowAddStep(true); setNewStepTitle(''); setNewStepIcon('📚'); }} style={S.btnPrimary}>
            <Plus size={14} /> Add Lesson
          </button>
        </div>

        {/* ===== ADD STEP FORM ===== */}
        {showAddStep && (
          <div style={{ ...S.card, border: '1px solid rgba(255,69,0,0.2)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ff4500', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>New Lesson</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={S.label}>Title</label>
                <input value={newStepTitle} onChange={(e) => setNewStepTitle(e.target.value)} placeholder="e.g. Articles" style={S.input} />
              </div>
              <div style={{ width: '120px' }}>
                <label style={S.label}>Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {EMOJIS.slice(0, 10).map(e => (
                    <button key={e} onClick={() => setNewStepIcon(e)} style={{
                      width: '28px', height: '28px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px',
                      background: newStepIcon === e ? 'rgba(255,69,0,0.2)' : '#111',
                      outline: newStepIcon === e ? '2px solid #ff4500' : 'none',
                    }}>{e}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddStep(false)} style={S.btnGhost}><X size={12} /> Cancel</button>
              <button onClick={() => { if (newStepTitle.trim()) { addStep({ title: newStepTitle.trim(), icon: newStepIcon, color: 'from-orange-400 to-orange-600' }); setShowAddStep(false); } }} style={S.btnPrimary}><Save size={12} /> Save</button>
            </div>
          </div>
        )}

        {/* ===== LESSONS LIST ===== */}
        {steps.map((step, stepIdx) => (
          <div key={step.id} style={{ ...S.card, border: expandedStep === step.id ? '1px solid rgba(255,69,0,0.15)' : '1px solid rgba(255,255,255,0.05)' }}>
            {/* Step Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <GripVertical size={14} style={{ color: '#4b5563' }} />
                <span style={{ fontSize: '24px' }}>{step.icon}</span>
                {editingStep === step.id ? (
                  <input value={editValue} onChange={(e) => setEditValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => { if (e.key === 'Enter') { updateStep(step.id, { title: editValue }); setEditingStep(null); } }}
                    style={{ ...S.input, width: '250px' }} autoFocus />
                ) : (
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{step.title}</h3>
                    <p style={{ fontSize: '11px', color: '#6b7280' }}>{step.sections.length} sections · {step.sections.reduce((a, s) => a + (s.examples?.length || 0), 0)} examples</p>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {editingStep === step.id ? (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); updateStep(step.id, { title: editValue }); setEditingStep(null); }} style={{ ...S.btnPrimary, padding: '5px 10px' }}><Save size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setEditingStep(null); }} style={{ ...S.btnGhost, padding: '5px 10px' }}><X size={12} /></button>
                  </>
                ) : (
                  <>
                    <span style={S.badge('#ff4500')}>#{step.id}</span>
                    <button onClick={(e) => { e.stopPropagation(); setEditingStep(step.id); setEditValue(step.title); }} style={{ ...S.btnGhost, padding: '5px 8px' }}><Edit3 size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteStep(step.id); }} style={{ ...S.btnDanger, padding: '5px 8px' }}><Trash2 size={12} /></button>
                  </>
                )}
                {expandedStep === step.id ? <ChevronDown size={16} style={{ color: '#ff4500' }} /> : <ChevronRight size={16} style={{ color: '#6b7280' }} />}
              </div>
            </div>

            {/* ===== EXPANDED: SECTIONS ===== */}
            {expandedStep === step.id && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Sections</span>
                  <button onClick={() => { setShowAddSection(step.id); setNewSectionTitle(''); setNewSectionPattern(''); }} style={{ ...S.btnPrimary, padding: '5px 12px', fontSize: '11px' }}>
                    <Plus size={12} /> Add Section
                  </button>
                </div>

                {/* Add Section Form */}
                {showAddSection === step.id && (
                  <div style={{ background: '#111', borderRadius: '10px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(255,69,0,0.1)' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <label style={S.label}>Title</label>
                        <input value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} placeholder="Section title" style={S.input} />
                      </div>
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <label style={S.label}>Pattern</label>
                        <input value={newSectionPattern} onChange={(e) => setNewSectionPattern(e.target.value)} placeholder="Grammar pattern" style={S.input} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setShowAddSection(null)} style={S.btnGhost}><X size={12} /> Cancel</button>
                      <button onClick={() => { if (newSectionTitle.trim()) { addSection(step.id, { title: newSectionTitle.trim(), pattern: newSectionPattern.trim() }); setShowAddSection(null); } }} style={{ ...S.btnPrimary, fontSize: '11px' }}><Save size={12} /> Save</button>
                    </div>
                  </div>
                )}

                {/* Sections List */}
                {step.sections.map((sec) => (
                  <div key={sec.id} style={{ background: '#111', borderRadius: '10px', padding: '14px', marginBottom: '8px', border: expandedSection === sec.id ? '1px solid rgba(255,69,0,0.1)' : '1px solid rgba(255,255,255,0.03)' }}>
                    {/* Section Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                      onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff4500' }} />
                        {editingSection === sec.id ? (
                          <input value={editValue} onChange={(e) => setEditValue(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => { if (e.key === 'Enter') { updateSection(step.id, sec.id, { title: editValue }); setEditingSection(null); } }}
                            style={{ ...S.input, width: '200px', padding: '6px 10px', fontSize: '13px' }} autoFocus />
                        ) : (
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#e5e7eb' }}>{sec.title}</h4>
                            {sec.pattern && <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{sec.pattern}</p>}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={S.badge('#6b7280')}>{sec.examples?.length || 0}</span>
                        {editingSection === sec.id ? (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); updateSection(step.id, sec.id, { title: editValue }); setEditingSection(null); }} style={{ ...S.btnPrimary, padding: '4px 8px', fontSize: '11px' }}><Save size={10} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setEditingSection(null); }} style={{ ...S.btnGhost, padding: '4px 8px' }}><X size={10} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); setEditingSection(sec.id); setEditValue(sec.title); }} style={{ ...S.btnGhost, padding: '4px 8px' }}><Edit3 size={10} /></button>
                            <button onClick={(e) => { e.stopPropagation(); deleteSection(step.id, sec.id); }} style={{ ...S.btnDanger, padding: '4px 8px' }}><Trash2 size={10} /></button>
                          </>
                        )}
                        {expandedSection === sec.id ? <ChevronDown size={14} style={{ color: '#ff4500' }} /> : <ChevronRight size={14} style={{ color: '#4b5563' }} />}
                      </div>
                    </div>

                    {/* ===== EXPANDED: EXAMPLES ===== */}
                    {expandedSection === sec.id && (
                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Examples</span>
                          <button onClick={() => { setShowAddExample(`${step.id}-${sec.id}`); setNewExample(''); }} style={{ ...S.btnPrimary, padding: '4px 10px', fontSize: '11px' }}>
                            <Plus size={10} /> Add
                          </button>
                        </div>

                        {/* Add Example */}
                        {showAddExample === `${step.id}-${sec.id}` && (
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                            <input value={newExample} onChange={(e) => setNewExample(e.target.value)} placeholder="Type an example sentence..." style={{ ...S.input, flex: 1, padding: '8px 12px', fontSize: '13px' }}
                              onKeyDown={(e) => { if (e.key === 'Enter' && newExample.trim()) { addExample(step.id, sec.id, newExample.trim()); setNewExample(''); } }} />
                            <button onClick={() => { if (newExample.trim()) { addExample(step.id, sec.id, newExample.trim()); setNewExample(''); } }} style={{ ...S.btnPrimary, padding: '8px 12px' }}><Save size={12} /></button>
                            <button onClick={() => setShowAddExample(null)} style={{ ...S.btnGhost, padding: '8px' }}><X size={12} /></button>
                          </div>
                        )}

                        {/* Examples List */}
                        {sec.examples && sec.examples.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {sec.examples.map((ex, exIdx) => (
                              <div key={exIdx} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                                padding: '8px 12px', borderRadius: '8px', background: '#0a0a0a',
                              }}>
                                {editingExample === `${sec.id}-${exIdx}` ? (
                                  <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
                                    <input value={editValue} onChange={(e) => setEditValue(e.target.value)} style={{ ...S.input, flex: 1, padding: '6px 10px', fontSize: '13px' }}
                                      onKeyDown={(e) => { if (e.key === 'Enter') { updateExample(step.id, sec.id, exIdx, editValue); setEditingExample(null); } }} autoFocus />
                                    <button onClick={() => { updateExample(step.id, sec.id, exIdx, editValue); setEditingExample(null); }} style={{ ...S.btnPrimary, padding: '4px 8px' }}><Save size={10} /></button>
                                    <button onClick={() => setEditingExample(null)} style={{ ...S.btnGhost, padding: '4px 8px' }}><X size={10} /></button>
                                  </div>
                                ) : (
                                  <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#ff4500', minWidth: '20px' }}>{exIdx + 1}.</span>
                                      <span style={{ fontSize: '13px', color: '#d1d5db' }}>{ex}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                      <button onClick={() => { setEditingExample(`${sec.id}-${exIdx}`); setEditValue(ex); }} style={{ ...S.btnGhost, padding: '3px 6px', border: 'none' }}><Edit3 size={10} /></button>
                                      <button onClick={() => deleteExample(step.id, sec.id, exIdx)} style={{ ...S.btnDanger, padding: '3px 6px', border: 'none', background: 'transparent' }}><Trash2 size={10} /></button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '12px', color: '#4b5563', textAlign: 'center', padding: '16px' }}>No examples yet. Add one above.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {step.sections.length === 0 && (
                  <p style={{ fontSize: '12px', color: '#4b5563', textAlign: 'center', padding: '20px' }}>No sections yet. Click "Add Section" to create one.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
