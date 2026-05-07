import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, FileSearch, Mic } from 'lucide-react';

const Sidebar = ({ collapsed }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Applications', path: '/applications', icon: <ListTodo size={20} /> },
    { name: 'AI Analyzer', path: '/analyze', icon: <FileSearch size={20} /> },
    { name: 'Mock Interview', path: '/interview', icon: <Mic size={20} /> },
  ];

  return (
    <div
      className={`h-full glass-panel flex flex-col py-6 fixed top-0 left-0 z-30 border-r border-white/10 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`mb-8 ${collapsed ? 'px-3' : 'px-6'}`}>
        {collapsed ? (
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-primary/20 mx-auto">
            N
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gradient">Nebula Tracker</h1>
            <p className="text-sm text-on-surface-variant mt-1">AI Powered Internship Tool</p>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex flex-col gap-1.5 flex-1 ${collapsed ? 'px-2' : 'px-4'}`}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 rounded-xl transition-all duration-200 ${
                collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'
              } ${
                isActive
                  ? 'bg-primary/15 text-primary font-medium border border-primary/20 shadow-sm shadow-primary/5'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom branding */}
      <div className={`pt-4 border-t border-white/5 ${collapsed ? 'px-2' : 'px-6'}`}>
        <p className={`text-xs text-on-surface-variant/50 text-center ${collapsed ? 'hidden' : ''}`}>
          Built with Gemini AI
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
