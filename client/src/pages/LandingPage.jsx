import { useState, useEffect, useRef, useContext, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Play, ArrowRight, CheckCircle2, Brain, FileSearch,
  Mic, Target, BarChart3, Shield, Zap, Star, ChevronRight,
  Menu, X
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ProfileDropdown } from '../components/layout/Layout';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Float, Environment, ContactShadows } from '@react-three/drei';

// ─── 3D Laptop Model ────────────────────────────────────────────────
const LaptopModel = () => {
  const { scene } = useGLTF('/models/laptop.glb');
  return (
    <primitive 
      object={scene} 
      scale={1.3} 
      position={[0.2, 0.1, 0]} 
      rotation={[0.2, -0.4, 0]} 
    />
  );
};

const Laptop3D = () => {
  return (
    <div className="relative w-full h-[500px] lg:h-[650px] flex items-center justify-center">
      <div className="absolute inset-0 bg-primary/10 rounded-full blur-[150px] scale-90 opacity-20" />
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full overflow-visible"
        style={{ pointerEvents: 'auto' }}
      >
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <Suspense fallback={null}>
          <Float 
            speed={1.5} 
            rotationIntensity={0.3} 
            floatIntensity={0.3}
          >
            <LaptopModel />
          </Float>
          <Environment preset="city" />
          <ContactShadows 
            position={[0, -1.8, 0]} 
            opacity={0.3} 
            scale={10} 
            blur={2.5} 
            far={4} 
          />
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};


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
        className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary"
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
          className="absolute rounded-full bg-primary/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

// ─── Floating Dashboard Mockup ──────────────────────────────────────


// ─── Feature Card ───────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -6, borderColor: 'rgba(168,85,247,0.3)' }}
    className="landing-glass rounded-2xl p-6 border border-outline hover:shadow-xl hover:shadow-primary/5 transition-shadow group"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 border border-primary/10 group-hover:border-primary/30 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
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
    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">{value}</p>
    <p className="text-sm text-on-surface-variant mt-1">{label}</p>
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
    <div className="bg-background text-white min-h-screen overflow-x-hidden font-sans">
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-tertiary/8 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M0%200h1v40H0zM40%200h1v40h-1z%22%20fill%3D%22rgba(255%2C255%2C255%2C0.02)%22%2F%3E%3Cpath%20d%3D%22M0%200v1h40V0zM0%2040v1h40v-1z%22%20fill%3D%22rgba(255%2C255%2C255%2C0.02)%22%2F%3E%3C%2Fsvg%3E')] opacity-40" />
        <Particles />
      </div>

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-outline shadow-lg' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold">Nebula</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-on-surface-variant hover:text-white transition-colors">Features</a>
            <a href="#stats" className="text-sm text-on-surface-variant hover:text-white transition-colors">Stats</a>
            <a href="#cta" className="text-sm text-on-surface-variant hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <ProfileDropdown />
            ) : (
              <Link
                to="/register"
                className="text-sm font-medium px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
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
              className="md:hidden bg-background/95 backdrop-blur-xl border-t border-outline px-6 py-4 space-y-3"
            >
              <a href="#features" onClick={() => setMobileMenu(false)} className="block text-sm text-white/60 py-2">Features</a>
              <a href="#stats" onClick={() => setMobileMenu(false)} className="block text-sm text-white/60 py-2">Stats</a>
              <hr className="border-outline" />
              {user ? (
                <div className="pt-2">
                  <Link to="/dashboard" className="block text-sm font-medium text-center py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary">Go to Dashboard</Link>
                </div>
              ) : (
                <Link to="/register" className="block text-sm font-medium text-center py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary">Get Started</Link>
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
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <Sparkles size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary">AI Powered Platform</span>
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">
                  With AI
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-on-surface-variant leading-relaxed mb-8 max-w-md"
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
                    className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold text-sm hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                  >
                    Go to Dashboard
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold text-sm hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                  >
                    Get Started Free
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

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
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-[#050510] flex items-center justify-center text-xs">{c}</div>
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

            {/* Right — 3D Laptop Model */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <Laptop3D />
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
            <span className="text-xs font-medium text-primary tracking-widest uppercase">Features</span>
            <h2 className="text-4xl font-bold mt-3 mb-4">Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Land Your Dream Job</span></h2>
            <p className="text-on-surface-variant max-w-lg mx-auto">Powered by Gemini AI, our platform gives you unfair advantages in your job search.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard delay={0} icon={<FileSearch size={22} className="text-primary" />} title="AI Resume Analyzer" desc="Upload your resume and get instant ATS scoring, missing skills detection, and actionable improvement tips." />
            <FeatureCard delay={0.1} icon={<Mic size={22} className="text-secondary" />} title="Mock Interviews" desc="Practice with AI-generated questions tailored to your resume and target role. Get scored on every answer." />
            <FeatureCard delay={0.2} icon={<Target size={22} className="text-tertiary" />} title="Kanban Tracker" desc="Organize your applications across Wishlist, Applied, Interviewing, Offer, and Rejected columns." />
            <FeatureCard delay={0.3} icon={<BarChart3 size={22} className="text-green-400" />} title="Smart Analytics" desc="Track your match scores, skill gaps, and interview performance over time with visual dashboards." />
            <FeatureCard delay={0.4} icon={<Shield size={22} className="text-primary" />} title="Secure & Private" desc="Your resume data is encrypted and never shared. JWT authentication keeps your account safe." />
            <FeatureCard delay={0.5} icon={<Zap size={22} className="text-yellow-400" />} title="Instant Results" desc="Get AI-powered analysis in seconds, not minutes. Built on Google's Gemini 2.5 Flash for speed." />
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section id="stats" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto landing-glass rounded-3xl p-12 border border-outline">
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
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Supercharge</span> Your Job Search?
          </h2>
          <p className="text-on-surface-variant mb-10 text-lg max-w-xl mx-auto">
            Join thousands of job seekers using AI to land interviews faster. Start for free, no credit card required.
          </p>
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary font-semibold text-lg hover:opacity-90 transition-all shadow-2xl shadow-primary/25"
            >
              Go to Dashboard
              <ChevronRight size={20} />
            </button>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary font-semibold text-lg hover:opacity-90 transition-all shadow-2xl shadow-primary/25"
            >
              Get Started — It's Free
              <ChevronRight size={20} />
            </Link>
          )}
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-outline py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold">Nebula Tracker</span>
          </div>
          <p className="text-xs text-white/30">© 2026 Nebula Tracker. All rights reserved.</p>
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
