import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

const ChatTutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your English Grammar Assistant. How can I help you today?", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate Bot Response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(input),
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('hello') || q.includes('hi')) return "Hi there! Ready to master English grammar?";
    if (q.includes('tense')) return "Tenses are used to indicate the time of an action. We have Past, Present, and Future. Which one should we dive into?";
    if (q.includes('article')) return "Articles (a, an, the) are words that define a noun as specific or unspecific. For example, 'a dog' vs 'the dog'.";
    if (q.includes('thank')) return "You're very welcome! Keep practicing!";
    return "That's an interesting question! I'm currently in 'offline mode', but in a real setup, I could explain that in detail. Is there any specific grammar rule you're looking at right now?";
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 100, fontFamily: "'Outfit', sans-serif" }}>
      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'absolute', bottom: '70px', left: '0',
          width: '350px', height: '500px',
          background: 'rgba(15, 15, 15, 0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 69, 0, 0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.1), rgba(249, 115, 22, 0.05))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #ff4500, #fb923c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Grammar Tutor</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                display: 'flex', flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #ff4500, #f97316)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(255,69,0,0.2)' : 'none',
                  border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.08)' : 'none'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '10px', color: '#4b5563', marginTop: '4px' }}>{msg.time}</span>
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Loader2 size={14} className="animate-spin" style={{ color: '#ff4500' }} />
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(0,0,0,0.2)', padding: '6px 6px 6px 14px',
              borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a grammar question..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: '#fff', fontSize: '14px', fontFamily: 'inherit'
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: input.trim() ? 'linear-gradient(135deg, #ff4500, #fb923c)' : 'rgba(255,255,255,0.05)',
                  border: 'none', color: '#fff', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px', height: '56px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #ff4500, #f97316)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(255,69,0,0.4)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'rotate(90deg)' : 'none'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = isOpen ? 'rotate(90deg)' : 'scale(1)'; }}
      >
        {isOpen ? <X size={24} color="#fff" /> : <MessageSquare size={24} color="#fff" />}
        {!isOpen && (
          <div style={{
            position: 'absolute', top: '-4px', right: '-4px',
            width: '14px', height: '14px', borderRadius: '50%',
            background: '#ff4500', border: '2px solid #0a0a0a',
            animation: 'glowPulse 2s infinite'
          }} />
        )}
      </button>
    </div>
  );
};

export default ChatTutor;
