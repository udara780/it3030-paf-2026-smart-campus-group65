import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ticketService, facilityService } from '../services/dataService';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { HiPlus, HiPhotograph, HiChat, HiTicket, HiUser, HiPaperClip } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Tickets() {
  const { user, isAdmin, isTechnician } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [technicianId, setTechnicianId] = useState('');
  const [commentText, setCommentText] = useState('');
  const [tab, setTab] = useState('all');
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({ facilityId: '', title: '', description: '', priority: 'MEDIUM' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [tickRes, facRes] = await Promise.all([
        isTechnician() ? ticketService.getAssignedTickets() :
        isAdmin() ? ticketService.getAll() : ticketService.getMyTickets(),
        facilityService.getAll(),
      ]);
      setTickets(tickRes.data);
      setFacilities(facRes.data);
    } catch (err) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('ticket', new Blob([JSON.stringify(form)], { type: 'application/json' }));
      images.forEach(img => formData.append('images', img));

      await ticketService.create(formData);
      toast.success('Ticket created!');
      setShowCreateModal(false);
      setForm({ facilityId: '', title: '', description: '', priority: 'MEDIUM' });
      setImages([]);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ticket');
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }
    setImages([...images, ...files]);
  };

  const openDetail = async (ticket) => {
    try {
      const res = await ticketService.getById(ticket.id);
      setSelectedTicket(res.data);
      setShowDetailModal(true);
    } catch {
      toast.error('Failed to load ticket details');
    }
  };

  const handleAssign = async () => {
    try {
      await ticketService.assignTechnician(selectedTicket.id, { technicianId });
      toast.success('Technician assigned');
      setShowAssignModal(false);
      setTechnicianId('');
      fetchData();
      // Refresh the detail
      const res = await ticketService.getById(selectedTicket.id);
      setSelectedTicket(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await ticketService.updateStatus(selectedTicket.id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchData();
      const res = await ticketService.getById(selectedTicket.id);
      setSelectedTicket(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await ticketService.addComment(selectedTicket.id, { text: commentText });
      setSelectedTicket(res.data);
      setCommentText('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const getNextStatus = (current) => {
    const transitions = { OPEN: 'IN_PROGRESS', IN_PROGRESS: 'RESOLVED', RESOLVED: 'CLOSED' };
    return transitions[current];
  };

  const filteredTickets = tickets.filter(t => {
    if (tab === 'all') return true;
    return t.status === tab;
  });

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'OPEN', label: 'Open' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'RESOLVED', label: 'Resolved' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Maintenance & Tickets</h2>
          <p className="text-dark-text text-base">{isTechnician() ? 'Your assigned tickets' : isAdmin() ? 'Manage all tickets' : 'Report and track issues'}</p>
        </div>
        {!isTechnician() && (
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium text-base transition-all shadow-lg shadow-primary/20">
            <HiPlus size={20} /> Report Issue
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-dark-card border border-dark-border rounded-xl p-2 overflow-x-auto">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2.5 rounded-lg text-base font-medium transition-all whitespace-nowrap
            ${tab === key ? 'bg-primary text-white shadow-md' : 'text-dark-text hover:text-white hover:bg-dark-border/40'}`}>
            {label}
            {key !== 'all' && <span className="ml-2 text-sm opacity-70">({tickets.filter(t => t.status === key).length})</span>}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-dark-card border border-dark-border rounded-xl p-8">
            <EmptyState 
              icon="tickets"
              title="No tickets found"
              description={tab === 'all' ? "You haven't submitted any maintenance tickets." : `No ${tab.toLowerCase().replace('_', ' ')} tickets found.`}
              action={!isTechnician() ? (
                <button onClick={() => setShowCreateModal(true)} className="mt-4 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-base font-medium transition-all flex items-center gap-2 mx-auto">
                  <HiPlus size={18} /> Report Issue
                </button>
              ) : null}
            />
          </div>
        ) : (
          filteredTickets.map((t) => (
            <div key={t.id} onClick={() => openDetail(t)} className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary/20 transition-all cursor-pointer group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-light transition-colors">{t.title}</h3>
                    <StatusBadge status={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-base text-dark-text-light line-clamp-1 mb-3">{t.description}</p>
                  <div className="flex flex-wrap items-center gap-5 text-sm text-dark-text">
                    <span>📍 {t.facilityName}</span>
                    <span className="flex items-center gap-1"><HiUser size={14} /> {t.reporterName}</span>
                    {t.assignedTechnicianName && <span>🔧 {t.assignedTechnicianName}</span>}
                    {t.imageUrls?.length > 0 && <span className="flex items-center gap-1"><HiPhotograph size={14} /> {t.imageUrls.length} image(s)</span>}
                    {t.comments?.length > 0 && <span className="flex items-center gap-1"><HiChat size={14} /> {t.comments.length}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Report Issue" maxWidth="max-w-xl">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-base font-medium text-dark-text-light mb-2">Facility</label>
            <select required value={form.facilityId} onChange={e => setForm({ ...form, facilityId: e.target.value })}
              className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">Select facility</option>
              {facilities.map(f => <option key={f.id} value={f.id}>{f.name} ({f.location})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-dark-text-light mb-2">Title</label>
            <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Brief description of the issue"
              className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-base font-medium text-dark-text-light mb-2">Description</label>
            <textarea rows="5" required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Detailed description..."
              className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>
          <div>
            <label className="block text-base font-medium text-dark-text-light mb-2">Priority</label>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
              className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-dark-text-light mb-2">Images (max 3)</label>
            <input type="file" accept="image/*" multiple onChange={handleImageSelect}
              className="w-full text-base text-dark-text file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border file:border-dark-border file:text-base file:font-medium file:bg-dark file:text-dark-text-light hover:file:bg-dark-border/40" />
            {images.length > 0 && (
              <div className="flex gap-3 mt-3">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={URL.createObjectURL(img)} alt="" className="w-20 h-20 object-cover rounded-lg border border-dark-border" />
                    <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-danger rounded-full text-white text-sm flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 border border-dark-border rounded-lg text-base font-medium text-dark-text-light hover:bg-dark-border/40 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-primary hover:bg-primary-dark rounded-lg text-base font-medium text-white transition-colors shadow-lg shadow-primary/20">Submit Ticket</button>
          </div>
        </form>
      </Modal>

      {/* Ticket Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Ticket Details" maxWidth="max-w-2xl">
        {selectedTicket && (
          <div className="space-y-6">
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="text-xl font-semibold text-white">{selectedTicket.title}</h3>
                <StatusBadge status={selectedTicket.priority} />
                <StatusBadge status={selectedTicket.status} />
              </div>
              <p className="text-base text-dark-text-light">{selectedTicket.description}</p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 text-base">
              <div className="bg-dark rounded-lg p-4 border border-dark-border">
                <span className="text-dark-text block text-sm mb-2">Facility</span>
                <span className="text-white font-medium">{selectedTicket.facilityName}</span>
              </div>
              <div className="bg-dark rounded-lg p-4 border border-dark-border">
                <span className="text-dark-text block text-sm mb-2">Reporter</span>
                <span className="text-white font-medium">{selectedTicket.reporterName}</span>
              </div>
              <div className="bg-dark rounded-lg p-4 border border-dark-border">
                <span className="text-dark-text block text-sm mb-2">Technician</span>
                <span className="text-white font-medium">{selectedTicket.assignedTechnicianName || 'Unassigned'}</span>
              </div>
              <div className="bg-dark rounded-lg p-4 border border-dark-border">
                <span className="text-dark-text block text-sm mb-2">Created</span>
                <span className="text-white font-medium">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Images */}
            {selectedTicket.imageUrls?.length > 0 && (
              <div>
                <h4 className="text-base font-medium text-dark-text-light mb-3 flex items-center gap-2"><HiPaperClip size={16} /> Attachments</h4>
                <div className="flex gap-4">
                  {selectedTicket.imageUrls.map((url, i) => (
                    <a key={i} href={`http://localhost:8080${url}`} target="_blank" rel="noopener noreferrer">
                      <img src={`http://localhost:8080${url}`} alt={`Attachment ${i + 1}`} className="w-28 h-28 object-cover rounded-lg border border-dark-border hover:border-primary/50 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {isAdmin() && !selectedTicket.assignedTechnicianId && (
                <button onClick={() => setShowAssignModal(true)} className="px-4 py-2.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg text-base hover:bg-secondary/20 transition-colors">
                  Assign Technician
                </button>
              )}
              {(isAdmin() || isTechnician()) && getNextStatus(selectedTicket.status) && (
                <button onClick={() => handleStatusUpdate(getNextStatus(selectedTicket.status))}
                  className="px-4 py-2.5 bg-primary/10 text-primary-light border border-primary/20 rounded-lg text-base hover:bg-primary/20 transition-colors">
                  Move to: {getNextStatus(selectedTicket.status).replace(/_/g, ' ')}
                </button>
              )}
            </div>

            {/* Comments */}
            <div>
              <h4 className="text-base font-medium text-dark-text-light mb-4">Comments ({selectedTicket.comments?.length || 0})</h4>
              <div className="space-y-3 max-h-56 overflow-y-auto mb-4">
                {selectedTicket.comments?.length === 0 ? (
                  <p className="text-base text-dark-text">No comments yet</p>
                ) : (
                  selectedTicket.comments?.map((c, i) => (
                    <div key={i} className="bg-dark rounded-lg p-4 border border-dark-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-medium text-white">{c.authorName}</span>
                        <span className="text-sm text-dark-text">{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-base text-dark-text-light">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleComment} className="flex gap-3">
                <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <button type="submit" className="px-5 py-3 bg-primary hover:bg-primary-dark rounded-lg text-base font-medium text-white transition-colors">
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Technician Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Technician">
        <div className="space-y-5">
          <div>
            <label className="block text-base font-medium text-dark-text-light mb-2">Technician ID</label>
            <input type="text" value={technicianId} onChange={e => setTechnicianId(e.target.value)}
              placeholder="Enter technician's user ID"
              className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowAssignModal(false)} className="flex-1 py-3 border border-dark-border rounded-lg text-base font-medium text-dark-text-light hover:bg-dark-border/40 transition-colors">Cancel</button>
            <button onClick={handleAssign} className="flex-1 py-3 bg-primary hover:bg-primary-dark rounded-lg text-base font-medium text-white transition-colors">Assign</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
