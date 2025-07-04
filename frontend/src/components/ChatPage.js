import React, { useState } from 'react';
import axios from 'axios';

function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! How can I help you with your form security?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col min-h-[70vh]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-100 text-right' : 'bg-gray-100 text-left'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-center">AI is typing...</div>}
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

export default ChatPage;
