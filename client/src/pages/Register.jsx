import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Shield, Zap, Sparkles, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setIsLoading(true);
    setError('');
    
    const result = await register(formData.username, formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Dynamic Background Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-tertiary rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20 transform -rotate-3">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gradient">Join Us</h1>
          <p className="text-on-surface-variant mt-2">Start your AI-powered career journey</p>
        </div>

        {/* Register Card */}
        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
          {/* Subtle top light effect */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
          
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              Create Account <Sparkles className="text-tertiary" size={20} />
            </h2>
            <p className="text-on-surface-variant text-sm">Fill in the details below to get started</p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-on-surface-variant ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-surface-container-highest/50 border border-outline/30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant/20"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-on-surface-variant ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-surface-container-highest/50 border border-outline/30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant/20"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface-variant ml-1">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-surface-container-highest/50 border border-outline/30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant/20"
                    placeholder="••••••"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface-variant ml-1">Confirm</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-surface-container-highest/50 border border-outline/30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant/20"
                    placeholder="••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-secondary/20 active:scale-[0.99] mt-6 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-on-surface-variant text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-tertiary transition-colors font-bold underline underline-offset-4 decoration-primary/30 hover:decoration-tertiary/30">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-on-surface-variant/40 uppercase tracking-[0.2em] font-medium">
          <div className="flex items-center gap-1.5"><Zap size={12} /> AI Powered</div>
          <div className="flex items-center gap-1.5"><Shield size={12} /> Privacy First</div>
        </div>
      </div>
    </div>
  );
};

export default Register;
