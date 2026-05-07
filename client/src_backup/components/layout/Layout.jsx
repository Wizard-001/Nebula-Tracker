import { useState, useContext, useRef, useEffect, createContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, User, Settings, ChevronDown, Menu, PanelLeftClose } from 'lucide-react';
import Sidebar from './Sidebar';

// Share sidebar state with children
export const SidebarContext = createContext();

export const ProfileDropdown = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary/20">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-white leading-tight">{user?.name}</p>
          <p className="text-xs text-on-surface-variant leading-tight">{user?.email}</p>
        </div>
        <ChevronDown size={14} className={`text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-14 w-56 glass-panel rounded-xl overflow-hidden shadow-2xl z-50 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
          </div>
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-white/5 transition-colors"
            >
              <User size={16} className="text-on-surface-variant" />
              My Profile
            </Link>
            <Link
              to="/profile?tab=settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-white/5 transition-colors"
            >
              <Settings size={16} className="text-on-surface-variant" />
              Settings
            </Link>
          </div>
          <div className="border-t border-white/5 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="flex min-h-screen bg-background text-on-background">
        {/* Sidebar */}
        <Sidebar collapsed={!sidebarOpen} />

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Area */}
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          {/* Top Header Bar — always visible */}
          <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b border-white/5 bg-background/80 backdrop-blur-xl">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <Menu size={20} />}
            </button>
            <ProfileDropdown />
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;
