import React, { useEffect, useState } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SearchOverlay({ onClose }) {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/history/')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(() => alert("Couldn't load chat history"));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
      <div className="bg-[#1E1E1E] w-full max-w-2xl rounded-xl p-6 relative text-white shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-300 hover:text-white">
          <X size={20} />
        </button>
        <input
          className="w-full mb-4 p-3 rounded bg-[#2C2C2C] border border-gray-700 focus:outline-none"
          placeholder="Search chats..."
        />

        <p className="text-sm text-gray-400 mb-2">Today</p>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {history.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-[#2A2A2A] cursor-pointer"
              onClick={() => {
                onClose();
                navigate('/history');
              }}
            >
              <MessageSquare size={18} />
              <span className="truncate">{chat.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
