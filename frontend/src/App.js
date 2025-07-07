import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Pencil, Search, MessageSquare, Menu, MessageCircle } from 'lucide-react';
import FormAnalyzer from './components/FormAnalyzer';
import ChatWithAI from './components/ChatWithAI';
import SearchOverlay from './components/SearchOverlay';
import SidebarButton from './components/SidebarButton';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import './App.css';
import UserMenu from './components/UserMenu';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const formRef = useRef();
  // Set larger icon size when sidebar is collapsed
  // e.g., 32px when collapsed, 20px when expanded
  const iconSize = collapsed ? 32 : 24;
  const navItem = (to, label) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `block px-3 py-2 rounded-lg transition-all ${
          isActive
            ? 'bg-gray-700 text-white font-semibold'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`
      }
    >
      {collapsed ? <span title={label}>{label[0]}</span> : label}
    </NavLink>
  );
  // On mount, check backend for real auth status
  React.useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('http://localhost:8000/api/check-auth/', { credentials: 'include' });
        const data = await res.json();
        if (data && data.authenticated) {
          setIsLoggedIn(true);
          localStorage.setItem('sf_logged_in', '1');
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('sf_logged_in');
        }
      } catch {
        setIsLoggedIn(false);
        localStorage.removeItem('sf_logged_in');
      }
    }
    checkAuth();
    // Listen for login/logout changes in localStorage (other tabs)
    const onStorage = () => {
      setIsLoggedIn(localStorage.getItem('sf_logged_in') === '1');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  // Also update on login/logout in this tab
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsLoggedIn(localStorage.getItem('sf_logged_in') === '1');
    }, 500);
    return () => clearInterval(interval);
  }, []);
  // Increase icon size for larger appearance
  const handleSearchSelect = (item) => {
    if (formRef.current && formRef.current.setFormData) {
      formRef.current.setFormData(
        item.form_code,
        item.analysis_result,
        item.score,
        item.badges,
        item.secure_code // Always show secure code suggestion for previous chats
      );
    }
    setShowSearch(false);
  };

  return (
    <Router>
      <div className="flex min-h-screen h-screen bg-gray-100 relative">
        {/* Sidebar */}
        <aside
          className={`bg-gray-900 text-white h-full min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
            collapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Collapse Button: top-right when expanded, centered when collapsed */}
          <div className={`flex ${collapsed ? 'justify-center' : 'justify-end'} p-2`}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-white"
              title="Toggle Sidebar"
            >
              <Menu size={collapsed ? 28 : 20} />
            </button>
          </div>

          {/* Utility Buttons */}
          <div className="space-y-3 px-2 mb-6">
            <SidebarButton
              icon={Pencil}
              label="New Chat"
              collapsed={collapsed}
              to={isLoggedIn ? "/analyzer" : undefined}
              onClick={() => {
                if (isLoggedIn) {
                  formRef.current?.resetForm();
                }
              }}
              disabled={!isLoggedIn}
            />
            <SidebarButton
              icon={Search}
              label="Search Chats"
              collapsed={collapsed}
              to={isLoggedIn ? "/analyzer" : undefined}
              onClick={() => {
                if (isLoggedIn) {
                  setShowSearch(true);
                }
              }}
              disabled={!isLoggedIn}
            />
            <SidebarButton
              icon={MessageSquare}
              label="AI Form Security Analyzer"
              collapsed={collapsed}
              to={isLoggedIn ? "/analyzer" : undefined}
              disabled={!isLoggedIn}
            />
            <SidebarButton
              icon={MessageCircle}
              label="Chat with AI"
              collapsed={collapsed}
              to={isLoggedIn ? "/chat" : undefined}
              disabled={!isLoggedIn}
            />
          </div>
        </aside>

        {/* Topbar with user menu */}
        <div className="absolute top-0 right-0 p-4 z-50">
          <div className="flex flex-col items-center">
            {isLoggedIn && <UserMenu />}
          </div>
        </div>
        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyzer" element={<FormAnalyzer ref={formRef} />} />
            <Route path="/chat" element={<ChatWithAI />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>

        {/* Search Modal */}
        {showSearch && (
          <SearchOverlay 
            onClose={() => setShowSearch(false)} 
            onSelect={handleSearchSelect}
          />
        )}
      </div>
    </Router>
  );
}

export default App;