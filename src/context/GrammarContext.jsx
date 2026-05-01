import React, { createContext, useContext, useState, useEffect } from 'react';

const GrammarContext = createContext();

const ADMIN_KEY = 'english-grammar-admin-auth';
const ADMIN_PASSWORD = 'Mu200535@1';

export const GrammarProvider = ({ children }) => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem(ADMIN_KEY) === 'true';
  });

  // Fetch data from MySQL via Express API
  const fetchGrammarData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/grammar');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data && data.length > 0) {
        setSteps(data);
      } else {
        // If no data, use fallback from grammarData
        const { grammarSteps } = await import('../data/grammarData');
        setSteps(grammarSteps);
      }
    } catch (error) {
      console.error('Error loading grammar data from database:', error);
      // Fallback to local grammar data if API fails
      try {
        const { grammarSteps } = await import('../data/grammarData');
        setSteps(grammarSteps);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setSteps([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrammarData();
  }, []);

  const loginAdmin = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_KEY, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_KEY);
  };

  // ===== STEP CRUD =====
  const addStep = async (step) => {
    try {
      const res = await fetch('/api/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(step)
      });
      if (res.ok) {
        const newStep = await res.json();
        setSteps([...steps, newStep]);
      }
    } catch (error) { console.error(error); }
  };

  const updateStep = async (stepId, updates) => {
    try {
      const res = await fetch(`/api/steps/${stepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setSteps(steps.map(s => s.id === stepId ? { ...s, ...updates } : s));
      }
    } catch (error) { console.error(error); }
  };

  const deleteStep = async (stepId) => {
    try {
      const res = await fetch(`/api/steps/${stepId}`, { method: 'DELETE' });
      if (res.ok) {
        setSteps(steps.filter(s => s.id !== stepId));
      }
    } catch (error) { console.error(error); }
  };

  // ===== SECTION CRUD =====
  const addSection = async (stepId, section) => {
    try {
      const res = await fetch(`/api/steps/${stepId}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(section)
      });
      if (res.ok) {
        const newSection = await res.json();
        setSteps(steps.map(s => s.id === stepId ? { ...s, sections: [...s.sections, newSection] } : s));
      }
    } catch (error) { console.error(error); }
  };

  const updateSection = async (stepId, sectionId, updates) => {
    try {
      const res = await fetch(`/api/steps/${stepId}/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setSteps(steps.map(s => {
          if (s.id !== stepId) return s;
          return { ...s, sections: s.sections.map(sec => sec.id === sectionId ? { ...sec, ...updates } : sec) };
        }));
      }
    } catch (error) { console.error(error); }
  };

  const deleteSection = async (stepId, sectionId) => {
    try {
      const res = await fetch(`/api/steps/${stepId}/sections/${sectionId}`, { method: 'DELETE' });
      if (res.ok) {
        setSteps(steps.map(s => {
          if (s.id !== stepId) return s;
          return { ...s, sections: s.sections.filter(sec => sec.id !== sectionId) };
        }));
      }
    } catch (error) { console.error(error); }
  };

  // ===== EXAMPLE CRUD =====
  const addExample = async (stepId, sectionId, example) => {
    try {
      const res = await fetch(`/api/steps/${stepId}/sections/${sectionId}/examples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: example })
      });
      if (res.ok) {
        setSteps(steps.map(s => {
          if (s.id !== stepId) return s;
          return {
            ...s,
            sections: s.sections.map(sec => {
              if (sec.id !== sectionId) return sec;
              return { ...sec, examples: [...(sec.examples || []), example] };
            })
          };
        }));
      }
    } catch (error) { console.error(error); }
  };

  const updateExample = async (stepId, sectionId, exampleIndex, newExample) => {
    try {
      const res = await fetch(`/api/steps/${stepId}/sections/${sectionId}/examples/${exampleIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newExample })
      });
      if (res.ok) {
        setSteps(steps.map(s => {
          if (s.id !== stepId) return s;
          return {
            ...s,
            sections: s.sections.map(sec => {
              if (sec.id !== sectionId) return sec;
              const examples = [...sec.examples];
              examples[exampleIndex] = newExample;
              return { ...sec, examples };
            })
          };
        }));
      }
    } catch (error) { console.error(error); }
  };

  const deleteExample = async (stepId, sectionId, exampleIndex) => {
    try {
      const res = await fetch(`/api/steps/${stepId}/sections/${sectionId}/examples/${exampleIndex}`, { method: 'DELETE' });
      if (res.ok) {
        setSteps(steps.map(s => {
          if (s.id !== stepId) return s;
          return {
            ...s,
            sections: s.sections.map(sec => {
              if (sec.id !== sectionId) return sec;
              return { ...sec, examples: sec.examples.filter((_, i) => i !== exampleIndex) };
            })
          };
        }));
      }
    } catch (error) { console.error(error); }
  };

  const resetToDefault = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
      // In a real app we might re-seed here, but for now just refetch
      fetchGrammarData();
    } catch (error) { console.error(error); }
  };

  return (
    <GrammarContext.Provider value={{
      steps, isAdmin, loading,
      loginAdmin, logoutAdmin,
      addStep, updateStep, deleteStep,
      addSection, updateSection, deleteSection,
      addExample, updateExample, deleteExample,
      resetToDefault,
    }}>
      {children}
    </GrammarContext.Provider>
  );
};

export const useGrammar = () => useContext(GrammarContext);
