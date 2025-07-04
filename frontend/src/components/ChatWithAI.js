import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// Utility to format AI response with bold subheadings and points
// Formatter for AI response: bold subheadings, point-wise, similar to FormAnalyzer
function formatAIResponse(text) {
  return (
    <div
      style={{
        background: '#f5f6fa',
        borderRadius: 12,
        padding: '18px 20px',
        margin: '2px 0 2px 0',
        fontSize: '1.05rem',
        color: '#222',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        lineHeight: 1.7,
      }}
    >
      {text.split('\n').map((line, idx) => {
        // Bold lines like '1. **Heading**: explanation' or '1. Heading: explanation'
        let numbered = line.match(/^([0-9]+\.\s*)(\*\*[\w\s\-]+\*\*|[A-Z][\w\s\-]+):(.*)$/);
        if (numbered) {
          let heading = numbered[2].replace(/\*\*/g, '');
          let explanation = numbered[3] || '';
          return <div key={idx} style={{marginBottom: 4}}><b>{numbered[1] + heading}</b>:{explanation}</div>;
        }
        // Bold lines like '**Heading**: explanation' or 'Heading: explanation'
        let colonMatch = line.match(/^(\*\*[\w\s\-]+\*\*|[A-Z][\w\s\-]+):(.*)$/);
        if (colonMatch) {
          let heading = colonMatch[1].replace(/\*\*/g, '');
          let explanation = colonMatch[2] || '';
          return <div key={idx} style={{marginBottom: 4}}><b>{heading}</b>:{explanation}</div>;
        }
        // Bullet points (lines starting with '-', '*', or numbered)
        if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
          return <div key={idx} style={{marginLeft: 24, marginBottom: 4}}>&bull; {line.replace(/^\s*[-*]\s+|^\s*\d+\.\s+/, '')}</div>;
        }
        // Empty line
        if (line.trim() === '') {
          return <div key={idx} style={{height: 8}} />;
        }
        // Normal text
        return <div key={idx} style={{marginBottom: 4}}>{line}</div>;
      })}
    </div>
  );
}


function ChatWithAI() {
  // Modal for chat history
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('sf_chat_ai_history');
    return saved ? JSON.parse(saved) : [];
  });
  const defaultWelcome = { role: 'ai', content: 'Hello! How can I help you with your form security?' };
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('sf_chat_ai');
    return saved ? JSON.parse(saved) : [defaultWelcome];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Persist chat to localStorage
  useEffect(() => {
    localStorage.setItem('sf_chat_ai', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/chat/', { messages: newMessages }, { withCredentials: true });
      setMessages([...newMessages, { role: 'ai', content: res.data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'ai', content: 'Sorry, there was an error.' }]);
    }
    setLoading(false);
  };

  const handleNewChat = () => {
    // Save current chat to history if it has more than just the welcome message
    if (messages.length > 1) {
      const history = JSON.parse(localStorage.getItem('sf_chat_ai_history') || '[]');
      history.unshift({
        timestamp: Date.now(),
        messages,
      });
      localStorage.setItem('sf_chat_ai_history', JSON.stringify(history.slice(0, 20)));
      setChatHistory(history.slice(0, 20));
    }
    setMessages([defaultWelcome]);
    setInput('');
    localStorage.removeItem('sf_chat_ai');
  };

  // Restore a previous chat
  const handleRestoreChat = (msgs) => {
    setMessages(msgs);
    setShowHistory(false);
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col min-h-[70vh] h-[80vh]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Chat with AI</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowHistory(true)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1 rounded-lg text-sm font-semibold border border-gray-300">Chat History</button>
          <button onClick={handleNewChat} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded-lg text-sm font-semibold">New Chat</button>
        </div>
      </div>

      {/* Chat History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-300 relative">
            <button onClick={() => setShowHistory(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg">&times;</button>
            <h3 className="text-lg font-bold mb-4">Previous Chats</h3>
            {chatHistory.length === 0 && <div className="text-gray-500">No previous chats found.</div>}
            <ul className="space-y-3">
              {chatHistory.map((item, idx) => (
                <li key={item.timestamp} className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer" onClick={() => handleRestoreChat(item.messages)}>
                  <div className="text-xs text-gray-500 mb-1">{new Date(item.timestamp).toLocaleString()}</div>
                  <div className="truncate text-sm text-gray-700">
                    {item.messages.filter(m => m.role === 'user').map((m, i) => (
                      <span key={i} className="mr-2">{m.content.slice(0, 40)}{m.content.length > 40 ? '...' : ''}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2" style={{ minHeight: 0, maxHeight: '60vh' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' ? (
              <div className="w-full max-w-[80%]">
                {formatAIResponse(msg.content)}
              </div>
            ) : (
              <div className="px-4 py-2 rounded-lg max-w-[80%] break-words bg-indigo-100 text-right">
                {msg.content}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-gray-400 text-center">AI is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded-lg p-3"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-600" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWithAI;
