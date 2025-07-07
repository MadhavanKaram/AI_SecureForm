import React from 'react';
import { useNavigate } from 'react-router-dom';

// Accept sidebarOpen as a prop to control tooltip logic
const SidebarButton = ({ icon: Icon, label, collapsed, onClick, to, disabled, sidebarOpen }) => {
  const navigate = useNavigate();


  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
    if (to) navigate(to);
  };

  // Only show tooltip if collapsed and sidebar is visible (open)
  const showTooltip = collapsed && (sidebarOpen === undefined || sidebarOpen);

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={`flex items-center gap-3 px-2 py-2 w-full rounded text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
        disabled={disabled}
      >
        <Icon size={collapsed ? 26 : 18} />
        {!collapsed && <span>{label}</span>}
      </button>

      {showTooltip && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </div>
  );
};

export default SidebarButton;
