import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Pencil, Search, MessageSquare, Menu } from 'lucide-react';
import FormAnalyzer from './components/FormAnalyzer';
import SearchOverlay from './components/SearchOverlay';
import SidebarButton from './components/SidebarButton';
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
        // Only reset and navigate if not already on analyzer
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
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
      to="/"
      // Remove resetForm here to preserve analyzer state
    />
    {/* Submission History removed */}
  </div>
</aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/" element={<FormAnalyzer ref={formRef} />} />
            {/* <Route path="/history" element={<HistoryPage />} /> Submission History route removed */}
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