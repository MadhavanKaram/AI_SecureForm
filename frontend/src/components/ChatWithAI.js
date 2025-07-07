import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// Utility to format AI response with bold subheadings and points
// Formatter for AI response: bold subheadings, point-wise, similar to FormAnalyzer
// Unified formatter for AI response: bold subheadings, point-wise, matches FormAnalyzer
// Improved formatter for AI response: supports markdown headings, bold, code blocks, lists, and matches FormAnalyzer

// Custom hook for code copy popup state
function useCopyCodePopup() {
  const [copiedIdx, setCopiedIdx] = React.useState(-1);
  const handleCopy = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(-1), 1500);
  };
  return [copiedIdx, handleCopy];
}

function formatAIResponse(text, copiedIdx, handleCopy) {
  const lines = text.split('\n'); 
  let inCode = false;
  let codeLang = '';
  let codeBuffer = [];
  const elements = [];

  lines.forEach((line, idx) => {
    // Code block start/end
    const codeStart = line.match(/^```([a-zA-Z0-9]*)/);
    if (codeStart) {
      if (!inCode) {
        inCode = true;
        codeLang = codeStart[1] || '';
        codeBuffer = [];
      } else {
        // End code block with copy button
        const codeText = codeBuffer.join('\n');
        elements.push(
          <div key={idx} className="my-2" style={{position: 'relative', overflowX: 'auto'}}>
            <pre className="bg-gray-900 text-green-100 rounded-lg p-4 overflow-x-auto text-sm flex items-start" style={{overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, position: 'relative'}}>
              <code style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1}}>{codeText}</code>
              <button
                className="ml-2 mt-1 bg-gray-800 text-gray-200 border border-gray-700 rounded px-2 py-1 text-xs font-semibold hover:bg-gray-700 transition-colors duration-150 flex items-center gap-1"
                onClick={() => handleCopy(codeText, idx)}
                style={{outline:'none', alignSelf: 'flex-start'}}
                title="Copy code"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="inline-block align-middle" style={{marginRight: 2}}>
                  <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="3" width="13" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Copy
              </button>
              {copiedIdx === idx && (
                <span className="ml-2 mt-1 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold z-20">Copied!</span>
              )}
            </pre>
          </div>
        );
        inCode = false;
        codeLang = '';
        codeBuffer = [];
      }
      return;
    }
    if (inCode) {
      codeBuffer.push(line);
      return;
    }
    // Markdown heading (###, ##, #)
    let headingMatch = line.match(/^(#+)\s*(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      elements.push(
        <div key={idx} style={{ fontWeight: 700, fontSize: level === 1 ? '1.5em' : level === 2 ? '1.2em' : '1.1em', margin: '8px 0' }}>
          {content.replace(/\*\*(.*?)\*\*/g, (m, p1) => p1)}
        </div>
      );
      return;
    }
    // Bold lines like '1. **Heading**: explanation' or '1. Heading: explanation'
    let numbered = line.match(/^([0-9]+\.\s*)(\*\*([\w\s\-]+)\*\*|[A-Z][\w\s\-]+):(.*)$/);
    if (numbered) {
      let heading = numbered[2].replace(/\*\*/g, '');
      let explanation = numbered[4] || '';
      elements.push(<div key={idx}><b>{numbered[1] + heading}</b>:{explanation}</div>);
      return;
    }
    // Bold lines like '**Heading**: explanation' or 'Heading: explanation'
    let colonMatch = line.match(/^(\*\*([\w\s\-]+)\*\*|[A-Z][\w\s\-]+):(.*)$/);
    if (colonMatch) {
      let heading = colonMatch[1].replace(/\*\*/g, '');
      let explanation = colonMatch[3] || '';
      elements.push(<div key={idx}><b>{heading}</b>:{explanation}</div>);
      return;
    }
    // Bullet points (lines starting with '-', '*', or numbered)
    if (/^\s*[-*]\s+/.test(line)) {
      elements.push(<div key={idx} style={{marginLeft: 24, marginBottom: 4}}>&bull; {line.replace(/^\s*[-*]\s+/, '')}</div>);
      return;
    }
    // Numbered list (not heading)
    if (/^\s*\d+\.\s+/.test(line)) {
      elements.push(<div key={idx} style={{marginLeft: 24, marginBottom: 4}}>{line}</div>);
      return;
    }
    // Bold inline
    let inlineBold = line.replace(/\*\*(.*?)\*\*/g, (m, p1) => `<b>${p1}</b>`);
    if (inlineBold !== line) {
      elements.push(<div key={idx} dangerouslySetInnerHTML={{ __html: inlineBold }} />);
      return;
    }
    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={idx} style={{height: 8}} />);
      return;
    }
    // Normal text
    elements.push(<div key={idx} style={{marginBottom: 4}}>{line}</div>);
  });
  // If code block was not closed
  if (inCode && codeBuffer.length > 0) {
    elements.push(
      <div key={lines.length} className="my-2" style={{position: 'relative', overflowX: 'auto'}}>
        <pre className="bg-gray-900 text-green-100 rounded-lg p-4 overflow-x-auto text-sm flex items-start" style={{overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, position: 'relative'}}>
          <code style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1}}>{codeBuffer.join('\n')}</code>
          <button
            className="ml-2 mt-1 bg-gray-800 text-gray-200 border border-gray-700 rounded px-2 py-1 text-xs font-semibold hover:bg-gray-700 transition-colors duration-150 flex items-center gap-1"
            onClick={() => handleCopy(codeBuffer.join('\n'), lines.length)}
            style={{outline:'none', alignSelf: 'flex-start'}}
            title="Copy code"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="inline-block align-middle" style={{marginRight: 2}}>
              <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="3" width="13" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Copy
          </button>
        </pre>
      </div>
    );
  }
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
      {elements}
    </div>
  );
}



function ChatWithAI() {
  const textareaRef = useRef(null);
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
  // For code copy popup in AI responses
  const [copiedIdx, handleCopy] = useCopyCodePopup();

  // Persist chat to localStorage
  // Auto-grow textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);
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
    <div className="w-full sm:max-w-[1200px] sm:mx-auto mt-4 p-2 sm:p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col min-h-[70vh] h-[80vh]">
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
                {formatAIResponse(msg.content, copiedIdx, handleCopy)}
              </div>
            ) : (
              <div className="px-4 py-2 rounded-lg max-w-[80%] break-words bg-indigo-100 text-right">
                <pre className="bg-transparent border-0 p-0 m-0 text-right break-words whitespace-pre-wrap font-sans text-base leading-relaxed" style={{boxShadow:'none',background:'none'}}>{msg.content}</pre>
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-gray-400 text-center">AI is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <div className="flex-1 flex items-end">
          <textarea
            ref={textareaRef}
            className="w-full border rounded-lg p-3 resize-none min-h-[44px] max-h-40"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
            }}
            rows={1}
          />
          <style>{`
            textarea::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
        <div className="flex items-end pb-1">
          <button type="submit" className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-600" style={{height:44}} disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWithAI;
