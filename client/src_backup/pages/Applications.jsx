import { useContext } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import { Trash2, ExternalLink } from 'lucide-react';

const Applications = () => {
  const { applications, deleteApplication } = useContext(ApplicationContext);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Wishlist': return 'bg-surface-bright text-on-surface';
      case 'Applied': return 'bg-primary/20 text-primary border border-primary/30';
      case 'Interviewing': return 'bg-secondary/20 text-secondary border border-secondary/30';
      case 'Offer': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'Rejected': return 'bg-error/20 text-error border border-error/30';
      default: return 'bg-surface-bright';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Applications List</h1>
        <p className="text-on-surface-variant">View all your saved opportunities in one place</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-high/50 border-b border-white/5 text-sm font-medium text-on-surface-variant">
              <tr>
                <th className="py-4 px-6">Company</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Deadline</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-on-surface-variant">
                    No applications found. Add one from the Dashboard.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-medium text-white">{app.company}</td>
                    <td className="py-4 px-6 text-on-surface">{app.role}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {app.deadline ? new Date(app.deadline).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-4 px-6 flex justify-end gap-3">
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <ExternalLink size={18} />
                      </button>
                      <button 
                        onClick={() => deleteApplication(app._id)}
                        className="text-on-surface-variant hover:text-error transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applications;
