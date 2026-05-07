import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Play, ArrowRight, CheckCircle2, Brain, FileSearch,
  Mic, Target, BarChart3, Shield, Zap, Star, ChevronRight,
  Menu, X
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ProfileDropdown } from '../components/layout/Layout';

// ─── Animated Typing Words ──────────────────────────────────────────
const words = ['Smarter', 'Faster', 'Better', 'Powerful'];
const TypingEffect = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex(i => (i + 1) % words.length), 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={words[index]}
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
        transition={{ duration: 0.5 }}
        className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  );
};

// ─── Particle Field ─────────────────────────────────────────────────
const Particles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-purple-400/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

// ─── Floating Dashboard Mockup ──────────────────────────────────────
const DashboardMockup = () => {
  const ref = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 15,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 15,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      initial={{ opacity: 0, x: 60, rotateY: -10 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      className="relative w-full max-w-[580px]"
    >
      <motion.div
        animate={{ rotateX: -mouse.y * 0.5, rotateY: mouse.x * 0.5 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative"
      >
        {/* Main Dashboard Card */}
        <div className="landing-glass rounded-2xl p-5 border border-white/10 shadow-2xl shadow-purple-500/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
            <span className="text-xs text-white/40 ml-2">Nebula Tracker — AI Dashboard</span>
          </div>

          {/* ATS Score */}
          <div className="flex gap-4 mb-4">
            <div className="landing-glass-card rounded-xl p-4 flex-1 text-center border border-white/5">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <motion.circle
                    cx="32" cy="32" r="28" fill="none" strokeWidth="4" strokeLinecap="round"
                    stroke="url(#scoreGrad)"
                    initial={{ strokeDasharray: '0 176' }}
                    animate={{ strokeDasharray: '150 176' }}
                    transition={{ duration: 2, delay: 1.2, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className="text-lg font-bold text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >85%</motion.span>
                </div>
              </div>
              <p className="text-xs text-white/50">ATS Score</p>
            </div>

            <div className="flex-1 space-y-2">
              {[
                { label: 'Skills Match', value: 92, color: 'from-green-400 to-emerald-500' },
                { label: 'Experience', value: 78, color: 'from-purple-400 to-blue-500' },
                { label: 'Keywords', value: 88, color: 'from-blue-400 to-cyan-500' },
              ].map((item, i) => (
                <div key={item.label} className="landing-glass-card rounded-lg p-2 border border-white/5">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-white/60">{item.label}</span>
                    <span className="text-white/80">{item.value}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.5, delay: 1.4 + i * 0.2, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: '🎯', label: 'Match Rate', val: '85%' },
              { icon: '📊', label: 'Analyzed', val: '2.4k' },
              { icon: '⚡', label: 'AI Score', val: '9.2' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + i * 0.15 }}
                className="landing-glass-card rounded-lg p-2.5 text-center border border-white/5"
              >
                <span className="text-lg">{s.icon}</span>
                <p className="text-sm font-bold text-white mt-1">{s.val}</p>
                <p className="text-[10px] text-white/40">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating cards around the mockup */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-6 -right-6 landing-glass-card rounded-xl px-3 py-2 border border-purple-500/20 shadow-lg shadow-purple-500/10"
        >
          <div className="flex items-center gap-2">
            <Brain className="text-purple-400" size={16} />
            <span className="text-xs text-white/80">AI Analysis Complete</span>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-4 -left-6 landing-glass-card rounded-xl px-3 py-2 border border-cyan-500/20 shadow-lg shadow-cyan-500/10"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-cyan-400" size={16} />
            <span className="text-xs text-white/80">Resume Optimized</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ─── Feature Card ───────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -6, borderColor: 'rgba(168,85,247,0.3)' }}
    className="landing-glass rounded-2xl p-6 border border-white/5 hover:shadow-xl hover:shadow-purple-500/5 transition-shadow group"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4 border border-purple-500/10 group-hover:border-purple-500/30 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
  </motion.div>
);

// ─── Stats ──────────────────────────────────────────────────────────
const StatItem = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="text-center"
  >
    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{value}</p>
    <p className="text-sm text-white/40 mt-1">{label}</p>
  </motion.div>
);

// ─── Main Landing Page ──────────────────────────────────────────────
const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bg-[#050510] text-white min-h-screen overflow-x-hidden font-sans">
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M0%200h1v40H0zM40%200h1v40h-1z%22%20fill%3D%22rgba(255%2C255%2C255%2C0.02)%22%2F%3E%3Cpath%20d%3D%22M0%200v1h40V0zM0%2040v1h40v-1z%22%20fill%3D%22rgba(255%2C255%2C255%2C0.02)%22%2F%3E%3C%2Fsvg%3E')] opacity-40" />
        <Particles />
      </div>

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#050510]/80 backdrop-blur-xl border-b border-white/5 shadow-lg' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold">Nebula</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/50 hover:text-white transition-colors">Features</a>
            <a href="#stats" className="text-sm text-white/50 hover:text-white transition-colors">Stats</a>
            <a href="#cta" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <ProfileDropdown />
            ) : (
              <Link
                to="/register"
                className="text-sm font-medium px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white/70" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#050510]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-3"
            >
              <a href="#features" onClick={() => setMobileMenu(false)} className="block text-sm text-white/60 py-2">Features</a>
              <a href="#stats" onClick={() => setMobileMenu(false)} className="block text-sm text-white/60 py-2">Stats</a>
              <hr className="border-white/5" />
              {user ? (
                <div className="pt-2">
                  <Link to="/dashboard" className="block text-sm font-medium text-center py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">Go to Dashboard</Link>
                </div>
              ) : (
                <Link to="/register" className="block text-sm font-medium text-center py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">Get Started</Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Hero Section ── */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left */}
            <div className="flex-1 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
              >
                <Sparkles size={14} className="text-purple-400" />
                <span className="text-xs font-medium text-purple-300">AI Powered Platform</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
              >
                Build{' '}
                <TypingEffect />{' '}
                <br />
                Experiences{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  With AI
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-white/40 leading-relaxed mb-8 max-w-md"
              >
                Analyze resumes with AI, practice mock interviews, and track your applications — all in one intelligent platform built for career success.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                {user ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold text-sm hover:opacity-90 transition-all shadow-xl shadow-purple-500/20"
                  >
                    Go to Dashboard
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold text-sm hover:opacity-90 transition-all shadow-xl shadow-purple-500/20"
                  >
                    Get Started Free
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                <button className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all">
                  <Play size={16} />
                  Watch Demo
                </button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-4 mt-10"
              >
                <div className="flex -space-x-2">
                  {['🟣','🔵','🟢','🟠'].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border-2 border-[#050510] flex items-center justify-center text-xs">{c}</div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {Array(5).fill(0).map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-xs text-white/30 mt-0.5">Trusted by 2,000+ job seekers</p>
                </div>
              </motion.div>
            </div>

            {/* Right — Dashboard Mockup */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="relative z-10 py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-medium text-purple-400 tracking-widest uppercase">Features</span>
            <h2 className="text-4xl font-bold mt-3 mb-4">Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Land Your Dream Job</span></h2>
            <p className="text-white/40 max-w-lg mx-auto">Powered by Gemini AI, our platform gives you unfair advantages in your job search.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard delay={0} icon={<FileSearch size={22} className="text-purple-400" />} title="AI Resume Analyzer" desc="Upload your resume and get instant ATS scoring, missing skills detection, and actionable improvement tips." />
            <FeatureCard delay={0.1} icon={<Mic size={22} className="text-blue-400" />} title="Mock Interviews" desc="Practice with AI-generated questions tailored to your resume and target role. Get scored on every answer." />
            <FeatureCard delay={0.2} icon={<Target size={22} className="text-cyan-400" />} title="Kanban Tracker" desc="Organize your applications across Wishlist, Applied, Interviewing, Offer, and Rejected columns." />
            <FeatureCard delay={0.3} icon={<BarChart3 size={22} className="text-green-400" />} title="Smart Analytics" desc="Track your match scores, skill gaps, and interview performance over time with visual dashboards." />
            <FeatureCard delay={0.4} icon={<Shield size={22} className="text-orange-400" />} title="Secure & Private" desc="Your resume data is encrypted and never shared. JWT authentication keeps your account safe." />
            <FeatureCard delay={0.5} icon={<Zap size={22} className="text-yellow-400" />} title="Instant Results" desc="Get AI-powered analysis in seconds, not minutes. Built on Google's Gemini 2.5 Flash for speed." />
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section id="stats" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto landing-glass rounded-3xl p-12 border border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="10K+" label="Resumes Analyzed" delay={0} />
            <StatItem value="85%" label="Avg Match Score" delay={0.1} />
            <StatItem value="500+" label="Mock Interviews" delay={0.2} />
            <StatItem value="4.9★" label="User Rating" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section id="cta" className="relative z-10 py-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Supercharge</span> Your Job Search?
          </h2>
          <p className="text-white/40 mb-10 text-lg max-w-xl mx-auto">
            Join thousands of job seekers using AI to land interviews faster. Start for free, no credit card required.
          </p>
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold text-lg hover:opacity-90 transition-all shadow-2xl shadow-purple-500/25"
            >
              Go to Dashboard
              <ChevronRight size={20} />
            </button>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold text-lg hover:opacity-90 transition-all shadow-2xl shadow-purple-500/25"
            >
              Get Started — It's Free
              <ChevronRight size={20} />
            </Link>
          )}
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold">Nebula Tracker</span>
          </div>
          <p className="text-xs text-white/30">© 2026 Nebula Tracker. Built with Gemini AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#features" className="text-xs text-white/30 hover:text-white/60 transition-colors">Features</a>
            <Link to="/login" className="text-xs text-white/30 hover:text-white/60 transition-colors">Login</Link>
            <Link to="/register" className="text-xs text-white/30 hover:text-white/60 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
