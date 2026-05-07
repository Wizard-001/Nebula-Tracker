import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Shield, Zap, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await login(email, password);
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-tertiary rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20 transform rotate-3">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gradient">Resume AI</h1>
          <p className="text-on-surface-variant mt-2">Elevate your career with AI</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
          {/* Subtle top light effect */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              Welcome Back <Sparkles className="text-tertiary" size={20} />
            </h2>
            <p className="text-on-surface-variant text-sm">Please enter your details to sign in</p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-on-surface-variant ml-1">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-highest/50 border border-outline/30 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant/20"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-sm font-medium text-on-surface-variant">Password</label>
                <a href="#" className="text-xs text-primary hover:text-tertiary transition-colors font-medium">Forgot Password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-highest/50 border border-outline/30 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant/20"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-[0.99] mt-8 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-on-surface-variant text-sm">
              New to Resume AI?{' '}
              <Link to="/register" className="text-primary hover:text-tertiary transition-colors font-bold underline underline-offset-4 decoration-primary/30 hover:decoration-tertiary/30">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-on-surface-variant/40 uppercase tracking-[0.2em] font-medium">
          <div className="flex items-center gap-1.5"><Zap size={12} /> Fast Analysis</div>
          <div className="flex items-center gap-1.5"><Shield size={12} /> Secure Data</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
