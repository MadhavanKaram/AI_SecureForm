import React from 'react';
import { useNavigate } from 'react-router-dom';

const SidebarButton = ({ icon: Icon, label, collapsed, onClick, to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    if (to) navigate(to);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className="flex items-center gap-3 px-2 py-2 w-full rounded hover:bg-gray-800 text-sm"
      >
        <Icon size={collapsed ? 26 : 18} />
        {!collapsed && <span>{label}</span>}
      </button>

      {collapsed && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </div>
  );
};

export default SidebarButton;
