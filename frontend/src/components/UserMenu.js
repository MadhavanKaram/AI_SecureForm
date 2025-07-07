import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function UserMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await fetch('http://localhost:8000/api/logout/', { method: 'POST', credentials: 'include' });
    } catch {}
    localStorage.removeItem('sf_logged_in');
    window.location.href = '/login';
  };

  return (
    <div className="relative flex flex-row items-center justify-end gap-2 group" style={{ minWidth: 0, zIndex: 50 }}>
      {/* User icon and sign out logic */}
      <div className="block sm:hidden relative">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-900 shadow-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-150"
          style={{ boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)' }}
          onClick={() => setOpen((v) => !v)}
          title="User menu"
          tabIndex={0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 19a8 8 0 1116 0H4z" />
          </svg>
        </button>
        {open && (
          <button
            className="absolute right-0 mt-2 w-32 py-2 rounded-xl bg-white text-gray-900 font-semibold text-base shadow-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-150 z-50"
            style={{ boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)' }}
            onClick={handleSignOut}
            title="Sign out"
            tabIndex={0}
          >
            <span className="flex items-center gap-2 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 19a8 8 0 1116 0H4z" />
              </svg>
              Sign out
            </span>
          </button>
        )}
      </div>
      <div className="hidden sm:block">
        <button
          className="flex items-center justify-center px-3 py-1.5 rounded-full bg-white text-gray-900 font-medium text-sm gap-2 shadow-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-150"
          style={{ boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)' }}
          onClick={handleSignOut}
          title="Sign out"
          tabIndex={0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 19a8 8 0 1116 0H4z" />
          </svg>
          <span className="font-medium text-gray-900">Sign&nbsp;out</span>
        </button>
      </div>
    </div>
  );
}

export default UserMenu;
