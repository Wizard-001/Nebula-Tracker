import { useState, useContext } from 'react';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { ApplicationContext } from '../context/ApplicationContext';
import { Plus, X } from 'lucide-react';

const STATUSES = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

const Dashboard = () => {
  const { addApplication } = useContext(ApplicationContext);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Quick Add Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Wishlist');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (company && role) {
      await addApplication({ 
        company, 
        role, 
        status, 
        deadline: deadline || undefined,
        notes 
      });
      setCompany('');
      setRole('');
      setStatus('Wishlist');
      setDeadline('');
      setNotes('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-1">Dashboard</h1>
          <p className="text-on-surface-variant">Manage your internship pipeline</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Application
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>

      {/* Quick Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl relative">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gradient">Add Application</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleQuickAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-on-surface-variant mb-1">Company *</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    placeholder="e.g. Google"
                    autoFocus
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-on-surface-variant mb-1">Role *</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                    placeholder="e.g. SDE Intern"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-on-surface-variant mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-on-surface-variant mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-on-surface-variant mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none resize-none"
                  placeholder="Any additional notes..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-on-surface-variant hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
