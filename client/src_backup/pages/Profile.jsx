import { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  UserCircle, Mail, Key, Save, Loader2, CheckCircle2, AlertCircle,
  FileText, Trash2, Shield, Bell, Eye, EyeOff, X
} from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: <UserCircle size={18} /> },
  { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  { id: 'resume', label: 'Resume', icon: <FileText size={18} /> },
];

// ─── Toast Notification ──────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-top-4 duration-300 ${
      type === 'success'
        ? 'bg-green-500/15 border-green-500/30 text-green-400'
        : 'bg-error/15 border-error/30 text-error'
    }`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
};

// ─── Profile Tab ─────────────────────────────────────────────────────
const ProfileTab = ({ user, token, onUpdate }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put('/api/auth/profile', { name, email }, config);
      onUpdate(data, 'Profile updated successfully');
    } catch (err) {
      onUpdate(null, err.response?.data?.message || 'Failed to update profile', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="glass-panel p-8 rounded-2xl flex items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-primary/20">
          {user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
          <p className="text-on-surface-variant flex items-center gap-2 mt-1">
            <Mail size={14} />
            {user?.email}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="bg-primary/15 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-medium">
              Free Plan
            </span>
            <span className="bg-green-500/15 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
          <UserCircle size={20} className="text-primary" />
          Edit Profile
        </h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-on-surface-variant mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-on-surface-variant mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-colors"
              required
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || (name === user?.name && email === user?.email)}
              className="bg-primary disabled:opacity-50 hover:opacity-90 text-white px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 font-medium"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Security Tab ────────────────────────────────────────────────────
const SecurityTab = ({ token, onUpdate }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      onUpdate(null, 'New passwords do not match', true);
      return;
    }

    if (newPassword.length < 6) {
      onUpdate(null, 'Password must be at least 6 characters', true);
      return;
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('/api/auth/password', { currentPassword, newPassword }, config);
      onUpdate(null, 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      onUpdate(null, err.response?.data?.message || 'Failed to change password', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
          <Key size={20} className="text-primary" />
          Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm text-on-surface-variant mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-on-surface-variant mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-on-surface-variant mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-surface-container border rounded-xl px-4 py-2.5 text-white focus:outline-none transition-colors ${
                confirmPassword && confirmPassword !== newPassword
                  ? 'border-error focus:border-error'
                  : 'border-outline-variant focus:border-primary'
              }`}
              required
            />
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-error mt-1">Passwords do not match</p>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || newPassword !== confirmPassword}
              className="bg-primary disabled:opacity-50 hover:opacity-90 text-white px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 font-medium"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Security Info */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell size={20} className="text-primary" />
          Security Info
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-on-surface-variant">Session Duration</span>
            <span className="text-white font-medium">30 days</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-on-surface-variant">Authentication</span>
            <span className="text-green-400 font-medium">JWT Token</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-on-surface-variant">Password Encryption</span>
            <span className="text-green-400 font-medium">bcrypt (10 rounds)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Resume Tab ──────────────────────────────────────────────────────
const ResumeTab = ({ user, token, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const hasResume = user?.resumeText && user.resumeText.length > 0;

  const handleDeleteResume = async () => {
    if (!confirm('Are you sure you want to remove your saved resume?')) return;

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete('/api/auth/resume', config);
      onUpdate({ ...user, resumeText: '' }, 'Resume removed successfully');
    } catch (err) {
      onUpdate(null, err.response?.data?.message || 'Failed to remove resume', true);
    } finally {
      setLoading(false);
    }
  };

  // Truncate resume text for preview
  const previewText = user?.resumeText?.substring(0, 800) || '';

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          Saved Resume
        </h3>
        <p className="text-sm text-on-surface-variant mb-5">
          Your resume is saved when you use the AI Analyzer or Mock Interview. It's used to generate personalized questions and analysis.
        </p>

        {hasResume ? (
          <>
            {/* Status */}
            <div className="flex items-center gap-3 mb-5 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
              <CheckCircle2 size={20} className="text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-400">Resume Saved</p>
                <p className="text-xs text-on-surface-variant">
                  {user.resumeText.length.toLocaleString()} characters extracted
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-surface-container-low rounded-xl p-4 border border-white/5 mb-4 max-h-72 overflow-y-auto">
              <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-semibold">Resume Preview</p>
              <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">
                {previewText}
                {user.resumeText.length > 800 && (
                  <span className="text-on-surface-variant">... (truncated)</span>
                )}
              </p>
            </div>

            {/* Delete */}
            <button
              onClick={handleDeleteResume}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-error hover:bg-error/10 px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Remove Saved Resume
            </button>
          </>
        ) : (
          <div className="text-center py-10 bg-surface-container-low rounded-xl border border-white/5">
            <FileText size={40} className="text-outline mx-auto mb-3" />
            <p className="text-on-surface-variant mb-1">No resume saved yet</p>
            <p className="text-xs text-on-surface-variant/60">
              Upload a resume in the AI Analyzer or Mock Interview to save it automatically.
            </p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Resume Tips</h3>
        <ul className="space-y-3 text-sm text-on-surface-variant">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" />
            Keep your resume to 1 page for internships and entry-level roles
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" />
            Use quantifiable achievements (e.g., "improved performance by 30%")
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" />
            Tailor your resume keywords to match each job description
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" />
            List projects with tech stack and impact, not just descriptions
          </li>
        </ul>
      </div>
    </div>
  );
};

// ─── Main Profile Page ───────────────────────────────────────────────
const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'settings' ? 'security' : 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [toast, setToast] = useState(null);

  // Fetch full user data including resumeText
  const [fullUser, setFullUser] = useState(user);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/auth/me', config);
        setFullUser({ ...data, token: user.token });
      } catch (err) {
        console.error('Failed to fetch user', err);
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [user.token]);

  const handleUpdate = (updatedData, message, isError = false) => {
    if (!isError && updatedData) {
      const newUser = { ...updatedData, token: updatedData.token || user.token };
      setUser(newUser);
      setFullUser(prev => ({ ...prev, ...newUser }));
      localStorage.setItem('userInfo', JSON.stringify(newUser));
    }
    setToast({ message, type: isError ? 'error' : 'success' });
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Profile & Settings</h1>
        <p className="text-on-surface-variant">Manage your account, security, and saved resume</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-surface-container-low/50 p-1 rounded-xl mb-6 border border-white/5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary/15 text-primary border border-primary/20 shadow-sm'
                : 'text-on-surface-variant hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <ProfileTab user={fullUser} token={user.token} onUpdate={handleUpdate} />
      )}
      {activeTab === 'security' && (
        <SecurityTab token={user.token} onUpdate={handleUpdate} />
      )}
      {activeTab === 'resume' && (
        <ResumeTab user={fullUser} token={user.token} onUpdate={handleUpdate} />
      )}
    </div>
  );
};

export default Profile;
