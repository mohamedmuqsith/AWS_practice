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
          setMessages([
            { id: 'welcome', text: "Hello! I'm your Grammar Assistant. How can I help you today? (Tamil or English!)", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
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
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: data.text,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server Error (${res.status})`);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        text: `Connection Error: ${error.message}. Please check if the server is running.`,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
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
          width: '60px', height: '60px', borderRadius: '20px',
          background: 'linear-gradient(135deg, #ff4500, #fb923c)', color: '#fff', 
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(255, 69, 0, 0.4)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15) rotate(5deg)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 69, 0, 0.6)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 69, 0, 0.4)'; }}
      >
        <div style={{ position: 'relative' }}>
          <MessageSquare size={28} />
          <div style={{ 
            position: 'absolute', top: '-6px', right: '-6px', width: '14px', height: '14px', 
            background: '#fff', borderRadius: '50%', border: '3px solid #ff4500',
            animation: 'pulse 1.5s infinite'
          }} />
        </div>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(20px)',
      color: '#ececec',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Outfit', sans-serif",
      animation: 'chatExpand 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Light Beams Background Effect */}
      <div className="light-beams" style={{ opacity: 0.3 }}>
        <div className="light-beam" style={{ left: '20%', animationDelay: '0s' }} />
        <div className="light-beam" style={{ left: '50%', animationDelay: '1s' }} />
        <div className="light-beam" style={{ left: '80%', animationDelay: '2s' }} />
      </div>

      {/* Top Navbar */}
      <header style={{
        padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 69, 0, 0.1)', background: 'rgba(0,0,0,0.2)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '12px', 
            background: 'linear-gradient(135deg, #ff4500, #fb923c)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(255, 69, 0, 0.4)'
          }}>
            <Bot size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.5px' }}>
              GRAMMAR <span className="gradient-text">GPT</span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="glow-dot" style={{ width: '6px', height: '6px' }} />
              <span style={{ fontSize: '10px', color: '#ff4500', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>AI Tutor Active</span>
            </div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} style={{ 
          background: 'rgba(255,255,255,0.05)', border: 'none', color: '#ececec',
          width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
          border: '1px solid rgba(255,255,255,0.1)'
        }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'; }}
           onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
          <X size={22} />
        </button>
      </header>

      {/* Main Chat Area */}
      <main style={{ 
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
        alignItems: 'center', width: '100%', zIndex: 10, paddingBottom: '20px'
      }}>
        <div style={{ 
          width: '100%', maxWidth: '800px', padding: '40px 24px',
          display: 'flex', flexDirection: 'column', gap: '32px'
        }}>
          {messages.length <= 1 && !isTyping && (
            <div style={{ textAlign: 'center', marginTop: '5vh', marginBottom: '20px' }}>
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '24px', 
                background: 'linear-gradient(135deg, #ff4500, #fb923c)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                margin: '0 auto 24px', boxShadow: '0 10px 40px rgba(255, 69, 0, 0.3)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <Bot size={44} />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px', color: '#fff' }}>
                How can I help you <span className="gradient-text">learn</span> today?
              </h2>
              <p style={{ color: '#9ca3af', marginBottom: '32px', fontSize: '15px' }}>Your personal English language tutor powered by AI</p>
              
              <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px', textAlign: 'left'
              }}>
                {suggestions.map((text, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(text)}
                    style={{
                      padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
                      background: 'rgba(255,255,255,0.03)', color: '#ececec', cursor: 'pointer',
                      fontSize: '14px', textAlign: 'left', transition: 'all 0.3s',
                      animation: `fadeInUp 0.5s ease-out ${i * 0.1}s forwards`, opacity: 0
                    }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.background = 'rgba(255, 69, 0, 0.05)'; 
                      e.currentTarget.style.borderColor = 'rgba(255, 69, 0, 0.2)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; 
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Sparkles size={16} style={{ color: '#ff4500' }} />
                      {text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={msg.id} style={{ 
              display: 'flex', gap: '20px', width: '100%',
              animation: 'fadeInUp 0.5s ease-out',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
            }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                background: msg.sender === 'bot' ? 'linear-gradient(135deg, #ff4500, #fb923c)' : 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                boxShadow: msg.sender === 'bot' ? '0 0 15px rgba(255, 69, 0, 0.3)' : 'none'
              }}>
                {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' 
              }}>
                <div style={{ 
                  background: msg.sender === 'bot' ? 'rgba(255,255,255,0.03)' : 'rgba(255, 69, 0, 0.1)',
                  padding: '16px 20px',
                  borderRadius: msg.sender === 'bot' ? '0 20px 20px 20px' : '20px 0 20px 20px',
                  border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255, 69, 0, 0.2)',
                  fontSize: '16px', lineHeight: '1.6', color: '#ececec',
                  whiteSpace: 'pre-wrap',
                  boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(255, 69, 0, 0.1)' : 'none',
                  maxWidth: '85%'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '10px', color: '#4b5563', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                background: 'linear-gradient(135deg, #ff4500, #fb923c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}>
                <Bot size={20} />
              </div>
              <div style={{ flex: 1, paddingTop: '10px' }}>
                <div className="typing-dots" style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', background: '#ff4500', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                  <div style={{ width: '6px', height: '6px', background: '#ff4500', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
                  <div style={{ width: '6px', height: '6px', background: '#ff4500', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Input Area */}
      <footer style={{ 
        padding: '24px 24px 40px', display: 'flex', justifyContent: 'center',
        background: 'linear-gradient(to top, rgba(10,10,10,1) 60%, transparent)',
        zIndex: 20
      }}>
        <div style={{ 
          width: '100%', maxWidth: '800px', position: 'relative',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{ 
            flex: 1, position: 'relative',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.3s',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
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
              placeholder="Ask anything about English grammar..."
              rows={1}
              style={{
                width: '100%', padding: '16px 20px',
                background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: '16px', fontFamily: 'inherit',
                resize: 'none', maxHeight: '150px'
              }}
            />
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim()}
            style={{
              width: '52px', height: '52px', borderRadius: '18px',
              background: input.trim() ? 'linear-gradient(135deg, #ff4500, #fb923c)' : 'rgba(255,255,255,0.05)', 
              color: '#fff',
              border: 'none',
              cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s',
              boxShadow: input.trim() ? '0 4px 15px rgba(255, 69, 0, 0.4)' : 'none'
            }}
            onMouseEnter={(e) => { if (input.trim()) e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; }}
            onMouseLeave={(e) => { if (input.trim()) e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
          >
            <ArrowUp size={24} strokeWidth={3} />
          </button>
        </div>
      </footer>
      
      <style>{`
        @keyframes chatExpand {
          from { opacity: 0; transform: scale(0.9) translateY(20px); filter: blur(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default ChatTutor;
