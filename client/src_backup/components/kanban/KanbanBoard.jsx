import { useState, useContext, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ApplicationContext } from '../../context/ApplicationContext';
import { Building2, Calendar, MoreVertical, Plus, X, Trash2, Edit3, ArrowRight, ChevronRight } from 'lucide-react';

const COLUMNS = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

const COLUMN_COLORS = {
  Wishlist: { dot: 'bg-gray-400', header: 'text-gray-300' },
  Applied: { dot: 'bg-indigo-400', header: 'text-indigo-300' },
  Interviewing: { dot: 'bg-purple-400', header: 'text-purple-300' },
  Offer: { dot: 'bg-green-400', header: 'text-green-300' },
  Rejected: { dot: 'bg-red-400', header: 'text-red-300' },
};

// ─── Card Actions Menu ───────────────────────────────────────────────
const CardActionsMenu = ({ application, onClose }) => {
  const { updateApplication, deleteApplication } = useContext(ApplicationContext);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMoveTo = async (newStatus) => {
    await updateApplication(application._id, { status: newStatus });
    onClose();
  };

  const handleDelete = async () => {
    await deleteApplication(application._id);
    onClose();
  };

  const otherStatuses = COLUMNS.filter(c => c !== application.status);

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-8 z-50 w-52 glass-panel rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant border-b border-white/5">
        Move to
      </div>
      {otherStatuses.map(status => (
        <button
          key={status}
          onClick={() => handleMoveTo(status)}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-on-surface hover:bg-white/5 transition-colors"
        >
          <div className={`w-2 h-2 rounded-full ${COLUMN_COLORS[status].dot}`} />
          {status}
          <ChevronRight size={14} className="ml-auto text-on-surface-variant" />
        </button>
      ))}
      <div className="border-t border-white/5" />
      <button
        onClick={handleDelete}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  );
};

// ─── Edit Modal ──────────────────────────────────────────────────────
const EditModal = ({ application, onClose }) => {
  const { updateApplication } = useContext(ApplicationContext);
  const [company, setCompany] = useState(application.company);
  const [role, setRole] = useState(application.role);
  const [status, setStatus] = useState(application.status);
  const [deadline, setDeadline] = useState(
    application.deadline ? new Date(application.deadline).toISOString().split('T')[0] : ''
  );
  const [notes, setNotes] = useState(application.notes || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateApplication(application._id, {
      company,
      role,
      status,
      deadline: deadline || undefined,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg p-6 rounded-2xl relative">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Edit Application</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-on-surface-variant mb-1">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-on-surface-variant mb-1">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
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
                {COLUMNS.map(col => (
                  <option key={col} value={col}>{col}</option>
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
              rows={3}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none resize-none"
              placeholder="Add any notes..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-on-surface-variant hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Kanban Card ─────────────────────────────────────────────────────
const KanbanCard = ({ application, index }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <Draggable draggableId={application._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`glass-card p-4 rounded-xl mb-3 cursor-grab active:cursor-grabbing transition-all relative group ${
              snapshot.isDragging
                ? 'shadow-2xl shadow-primary/20 border-primary/50 scale-[1.02] rotate-1'
                : 'hover:border-primary/30'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-white text-sm leading-snug pr-2">{application.role}</h4>
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className="text-on-surface-variant hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical size={16} />
                </button>
                {showMenu && (
                  <CardActionsMenu
                    application={application}
                    onClose={() => setShowMenu(false)}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
              <Building2 size={14} className="shrink-0" />
              <span className="truncate">{application.company}</span>
            </div>

            {application.deadline && (
              <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container py-1 px-2 rounded w-fit">
                <Calendar size={12} className={new Date(application.deadline) < new Date() ? 'text-error' : 'text-primary'} />
                {new Date(application.deadline).toLocaleDateString()}
              </div>
            )}

            {application.notes && (
              <p className="text-xs text-on-surface-variant mt-2 line-clamp-2 opacity-70">
                {application.notes}
              </p>
            )}

            {/* Quick action bar on hover */}
            <div className="flex gap-1 mt-3 pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); setShowEdit(true); }}
                className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors px-2 py-1 rounded hover:bg-white/5"
              >
                <Edit3 size={12} /> Edit
              </button>
              {COLUMNS.indexOf(application.status) < COLUMNS.length - 2 && (
                <MoveNextButton application={application} />
              )}
            </div>
          </div>
        )}
      </Draggable>

      {showEdit && (
        <EditModal application={application} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
};

// ─── Move Next Button ────────────────────────────────────────────────
const MoveNextButton = ({ application }) => {
  const { updateApplication } = useContext(ApplicationContext);
  const currentIndex = COLUMNS.indexOf(application.status);
  const nextStatus = COLUMNS[currentIndex + 1];

  const handleMove = async (e) => {
    e.stopPropagation();
    await updateApplication(application._id, { status: nextStatus });
  };

  return (
    <button
      onClick={handleMove}
      className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors px-2 py-1 rounded hover:bg-white/5 ml-auto"
    >
      {nextStatus} <ArrowRight size={12} />
    </button>
  );
};

// ─── Inline Add Form ─────────────────────────────────────────────────
const InlineAddForm = ({ status, onClose }) => {
  const { addApplication } = useContext(ApplicationContext);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (company && role) {
      await addApplication({ company, role, status });
      setCompany('');
      setRole('');
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-3 rounded-xl mb-3 space-y-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="Company name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none"
      />
      <input
        type="text"
        placeholder="Role / Position"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none"
      />
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className="text-xs text-on-surface-variant hover:text-white px-2 py-1">
          Cancel
        </button>
        <button type="submit" className="text-xs bg-primary text-white px-3 py-1 rounded-lg hover:opacity-90">
          Add
        </button>
      </div>
    </form>
  );
};

// ─── Main KanbanBoard ────────────────────────────────────────────────
const KanbanBoard = () => {
  const { applications, setApplications, updateApplicationStatus } = useContext(ApplicationContext);
  const [addingTo, setAddingTo] = useState(null);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const newOrder = destination.index;

    // Optimistically update local state immediately
    setApplications(prev =>
      prev.map(app =>
        app._id === draggableId
          ? { ...app, status: newStatus, order: newOrder }
          : app
      )
    );

    // Persist to backend
    updateApplicationStatus(draggableId, newStatus, newOrder);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-5 gap-3 h-full">
        {COLUMNS.map(column => {
          const columnApps = applications
            .filter(app => app.status === column)
            .sort((a, b) => a.order - b.order);

          const colors = COLUMN_COLORS[column];

          return (
            <div key={column} className="flex flex-col min-w-0">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className={`font-semibold text-xs flex items-center gap-1.5 ${colors.header}`}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
                  <span className="truncate">{column}</span>
                  <span className="bg-surface-container-high px-1.5 py-0.5 rounded-full text-[10px] text-on-surface-variant font-normal">
                    {columnApps.length}
                  </span>
                </h3>
                <button
                  onClick={() => setAddingTo(addingTo === column ? null : column)}
                  className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded hover:bg-white/5 shrink-0"
                  title={`Add to ${column}`}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[150px] rounded-xl p-1.5 transition-all overflow-y-auto ${
                      snapshot.isDraggingOver
                        ? 'bg-primary/5 border-2 border-dashed border-primary/30'
                        : 'bg-surface-container-low/50 border-2 border-transparent'
                    }`}
                  >
                    {/* Inline Add Form */}
                    {addingTo === column && (
                      <InlineAddForm status={column} onClose={() => setAddingTo(null)} />
                    )}

                    {columnApps.map((app, index) => (
                      <KanbanCard key={app._id} application={app} index={index} />
                    ))}
                    {provided.placeholder}

                    {/* Empty state */}
                    {columnApps.length === 0 && addingTo !== column && (
                      <div className="h-full flex items-center justify-center text-on-surface-variant/40 text-xs py-8">
                        <button
                          onClick={() => setAddingTo(column)}
                          className="flex flex-col items-center gap-1.5 hover:text-primary/60 transition-colors"
                        >
                          <Plus size={20} />
                          <span>Add</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;

