import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, ArrowUp, Plus, Settings, History, Search } from 'lucide-react';

const ChatTutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize Session ID and History
  useEffect(() => {
    let sid = localStorage.getItem('grammar_chat_sid');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('grammar_chat_sid', sid);
    }
    setSessionId(sid);
    fetchHistory(sid);
  }, []);

  const fetchHistory = async (sid) => {
    try {
      const res = await fetch(`/api/chat/history/${sid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setMessages(data.map(m => ({
            id: m.id,
            text: m.text,
            sender: m.sender,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        } else {
          // Welcome message if no history
          setMessages([
            { id: 'welcome', text: "Hello! I'm your AI Grammar Tutor. How can I assist with your English learning today? (Tamil support available!)", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]);
        }
      }
    } catch (err) { console.error('Failed to load history:', err); }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMsgText = text.trim();
    const tempUserMessage = {
      id: Date.now(),
      text: userMsgText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, tempUserMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: userMsgText })
      });

      if (res.ok) {
        const data = await res.json();
        const botResponse = {
          id: Date.now() + 1,
          text: data.text,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error('API Error');
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        text: "I'm having trouble connecting to the brain center. Please try again in a moment.",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Explain Present Perfect in Tamil",
    "How to use 'The' properly?",
    "Check grammar: 'He study hard'",
    "5 common English idioms"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '24px', left: '24px', zIndex: 100,
          width: '56px', height: '56px', borderRadius: '50%',
          background: '#ffffff', color: '#000', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#0d0d0d', color: '#ececec',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Top Navbar */}
      <header style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '50%', background: '#fff', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 600 }}>GrammarGPT <span style={{ color: '#10a37f', fontSize: '10px', marginLeft: '6px', fontWeight: 700, border: '1px solid #10a37f', padding: '1px 4px', borderRadius: '4px' }}>CONNECTED</span></h1>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} style={{ 
          background: 'rgba(255,255,255,0.05)', border: 'none', color: '#ececec',
          width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
        }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
           onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
          <X size={20} />
        </button>
      </header>

      {/* Main Chat Area */}
      <main style={{ 
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
        alignItems: 'center', width: '100%'
      }}>
        <div style={{ 
          width: '100%', maxWidth: '768px', padding: '40px 20px',
          display: 'flex', flexDirection: 'column', gap: '32px'
        }}>
          {messages.length <= 1 && !isTyping && (
            <div style={{ textAlign: 'center', marginTop: '10vh', marginBottom: '20px' }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', background: '#fff', color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
              }}>
                <Bot size={36} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '32px' }}>How can I help you learn today?</h2>
              
              <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px', textAlign: 'left'
              }}>
                {suggestions.map((text, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(text)}
                    style={{
                      padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
                      background: 'transparent', color: '#ececec', cursor: 'pointer',
                      fontSize: '14px', textAlign: 'left', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} style={{ 
              display: 'flex', gap: '20px', width: '100%',
              animation: 'fadeInUp 0.4s ease-out'
            }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: msg.sender === 'bot' ? '#10a37f' : '#3c4043',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}>
                {msg.sender === 'bot' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', color: '#fff' }}>
                  {msg.sender === 'bot' ? 'GrammarGPT' : 'You'}
                </p>
                <div style={{ 
                  fontSize: '16px', lineHeight: '1.6', color: '#ececec',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: '#10a37f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}>
                <Bot size={18} />
              </div>
              <div style={{ flex: 1, paddingTop: '10px' }}>
                <div className="typing-dots" style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '4px', height: '4px', background: '#ececec', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ width: '4px', height: '4px', background: '#ececec', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.2s' }} />
                  <div style={{ width: '4px', height: '4px', background: '#ececec', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Input Area */}
      <footer style={{ 
        padding: '24px 20px 48px', display: 'flex', justifyContent: 'center',
        background: 'linear-gradient(to top, #0d0d0d 60%, transparent)'
      }}>
        <div style={{ 
          width: '100%', maxWidth: '768px', position: 'relative',
          display: 'flex', alignItems: 'center'
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message GrammarGPT..."
            rows={1}
            style={{
              width: '100%', padding: '16px 56px 16px 20px',
              borderRadius: '24px', border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)', color: '#fff',
              fontSize: '16px', outline: 'none', fontFamily: 'inherit',
              resize: 'none', transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim()}
            style={{
              position: 'absolute', right: '8px',
              width: '40px', height: '40px', borderRadius: '16px',
              background: input.trim() ? '#fff' : 'transparent', 
              color: input.trim() ? '#000' : '#4b5563',
              border: input.trim() ? 'none' : '1px solid rgba(255,255,255,0.1)',
              cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </footer>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ChatTutor;
