import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserMenu() {
  const [username, setUsername] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('http://localhost:8000/api/user/', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username || 'User');
        } else {
          setUsername('User');
        }
      } catch {
        setUsername('User');
      }
    }
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await fetch('http://localhost:8000/api/logout/', { method: 'POST', credentials: 'include' });
    localStorage.removeItem('sf_logged_in');
    navigate('/login');
  };

  return (
    <div className="relative flex flex-col items-end justify-center group" style={{ minWidth: 0, zIndex: 50 }}>
      <div className="flex items-center gap-2">
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 border border-white shadow focus:outline-none transition-all duration-200"
          onClick={() => setOpen((o) => !o)}
          title="User menu"
          tabIndex={0}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          style={{ minWidth: 0, minHeight: 0, padding: 0 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
          </svg>
        </button>
        <span className="text-xs text-gray-800 font-semibold truncate max-w-[90px]" title={username}>{username}</span>
      </div>
      {open && (
        <div
          className="absolute right-0 w-44 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 flex flex-col items-center animate-fade-in"
          style={{ top: 'calc(100% + 8px)', minWidth: '11rem', paddingTop: '0.5rem' }}
        >
          <div className="py-2 px-4 text-indigo-700 text-sm font-bold border-b w-full text-center flex flex-col items-center min-h-[48px] justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mb-1">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
            </svg>
            <span className="break-words max-w-[140px]">{username}</span>
          </div>
          <button
            className="w-full py-2 px-4 text-red-600 hover:bg-gray-100 text-sm font-semibold text-center rounded-b-xl transition-colors duration-150"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
