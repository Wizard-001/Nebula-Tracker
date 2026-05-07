import { useState, lazy, Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ListTodo, FileSearch, Mic, X } from 'lucide-react';

// Lazy load the existing route components so we don't load everything at once
const DashboardContent = lazy(() => import('./Dashboard'));
const ApplicationsContent = lazy(() => import('./Applications'));
const AnalyzerContent = lazy(() => import('./ResumeAnalyzer'));
const InterviewContent = lazy(() => import('./MockInterview'));

const modules = [
  {
    id: 'dashboard',
    title: 'Analytics Hub',
    description: 'Track your career progress & metrics',
    icon: <LayoutDashboard size={32} className="mb-4 text-purple-400" />,
    color: 'from-purple-500/20 to-indigo-500/20',
    border: 'border-purple-500/30',
    component: <DashboardContent />
  },
  {
    id: 'applications',
    title: 'Application Pipeline',
    description: 'Manage your active job applications',
    icon: <ListTodo size={32} className="mb-4 text-blue-400" />,
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    component: <ApplicationsContent />
  },
  {
    id: 'analyzer',
    title: 'AI Resume Analyzer',
    description: 'Optimize your CV against job descriptions',
    icon: <FileSearch size={32} className="mb-4 text-emerald-400" />,
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    component: <AnalyzerContent />
  },
  {
    id: 'interview',
    title: 'Mock Interview',
    description: 'Practice with AI voice agent',
    icon: <Mic size={32} className="mb-4 text-rose-400" />,
    color: 'from-rose-500/20 to-orange-500/20',
    border: 'border-rose-500/30',
    component: <InterviewContent />
  }
];

const SpatialHub = () => {
  const [activeModule, setActiveModule] = useState(null);

  const renderActiveComponent = () => {
    const mod = modules.find(m => m.id === activeModule);
    if (!mod) return null;

    return (
      <motion.div
        layoutId={`module-${mod.id}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.7 }}
        className="absolute inset-x-8 inset-y-24 md:inset-x-20 md:inset-y-20 z-40 rounded-3xl overflow-hidden backdrop-blur-2xl bg-black/40 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col"
      >
        <div className={`h-2 w-full bg-gradient-to-r ${mod.color}`} />
        
        <div className="flex justify-between items-center px-8 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            {mod.icon}
            <div>
              <h2 className="text-xl font-bold text-white">{mod.title}</h2>
              <p className="text-xs text-white/50">{mod.description}</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveModule(null)}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 relative">
          <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-white/50">Loading interface...</div>}>
            {mod.component}
          </Suspense>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-full relative">
      {/* Background 3D Spline Scene */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Spline scene="https://prod.spline.design/oF4PYq5PAObc68wT/scene.splinecode" />
      </div>

      {/* Foreground UI Overlay */}
      <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-700 ${activeModule ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent'}`}>
        
        {/* Floating Modules Grid */}
        <AnimatePresence>
          {!activeModule && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl pointer-events-auto">
                {modules.map((mod) => (
                  <motion.div
                    key={mod.id}
                    layoutId={`module-${mod.id}`}
                    onClick={() => setActiveModule(mod.id)}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-3xl p-8 backdrop-blur-xl bg-gradient-to-br ${mod.color} border ${mod.border} shadow-2xl relative overflow-hidden group`}
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                    
                    <div className="relative z-10">
                      {mod.icon}
                      <h3 className="text-2xl font-bold text-white mb-2">{mod.title}</h3>
                      <p className="text-sm text-white/60">{mod.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Active Module */}
        <AnimatePresence>
          {activeModule && (
            <div className="absolute inset-0 pointer-events-auto">
              {renderActiveComponent()}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SpatialHub;
