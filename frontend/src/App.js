import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Pencil, Search, MessageSquare, Menu } from 'lucide-react';
import FormAnalyzer from './components/FormAnalyzer';
import HistoryPage from './components/HistoryPage';
import SearchOverlay from './components/SearchOverlay';
import SidebarButton from './components/SidebarButton';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
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
  // Increase icon size for larger appearance

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100 relative">
        {/* Sidebar */}
       <aside
  className={`bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 ease-in-out ${
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
      onClick={() => {
        formRef.current?.resetForm();
        window.location.href = '/analyzer'; // Go to analyzer page
      }}
    />
    <SidebarButton icon={Search} label="Search Chats" collapsed={collapsed} onClick={() => setShowSearch(true)} />
  </div>

  {/* Chats Section (Nav Links) */}
  <div className="space-y-1 px-2">
    <SidebarButton
      icon={MessageSquare}
      label="AI Form Security Analyzer"
      collapsed={collapsed}
      to="/analyzer"
    />
    <SidebarButton
      icon={MessageSquare}
      label="Submission History"
      collapsed={collapsed}
      to="/history"
    />
  </div>
</aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyzer" element={<FormAnalyzer ref={formRef} />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>

        {/* Search Modal */}
        {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
      </div>
    </Router>
  );
}

export default App;