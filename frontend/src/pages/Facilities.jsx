import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { facilityService } from '../services/dataService';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { HiPlus, HiPencil, HiTrash, HiSearch, HiFilter, HiLocationMarker, HiUsers, HiOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';

const TYPES = ['', 'ROOM', 'LAB', 'EQUIPMENT'];
const STATUSES = ['', 'ACTIVE', 'OUT_OF_SERVICE'];

export default function Facilities() {
  const { isAdmin } = useAuth();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState({ name: '', type: 'ROOM', capacity: 1, location: '', description: '', status: 'ACTIVE' });

  useEffect(() => { fetchFacilities(); }, []);

  const fetchFacilities = async () => {
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.name = searchTerm;
      const res = await facilityService.getAll(params);
      setFacilities(res.data);
    } catch (err) {
      toast.error('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFacilities(); }, [filterType, filterStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFacilities();
  };

  const openCreateModal = () => {
    setEditing(null);
    setForm({ name: '', type: 'ROOM', capacity: 1, location: '', description: '', status: 'ACTIVE' });
    setShowModal(true);
  };

  const openEditModal = (facility) => {
    setEditing(facility);
    setForm({
      name: facility.name,
      type: facility.type,
      capacity: facility.capacity,
      location: facility.location,
      description: facility.description || '',
      status: facility.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await facilityService.update(editing.id, form);
        toast.success('Facility updated');
      } else {
        await facilityService.create(form);
        toast.success('Facility created');
      }
      setShowModal(false);
      fetchFacilities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this facility?')) return;
    try {
      await facilityService.delete(id);
      toast.success('Facility deleted');
      fetchFacilities();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const typeIcons = { ROOM: '🏛️', LAB: '🔬', EQUIPMENT: '🖥️' };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 m-2 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Facilities & Assets</h2>
          <p className="text-dark-text text-base">Browse and manage campus facilities</p>
        </div>
        {isAdmin() && (
          <button onClick={openCreateModal} className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium text-base transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40">
            <HiPlus size={20} /> Add Facility
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-text" size={20} />
            <input
              type="text" placeholder="Search facilities..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
          </form>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="">All Types</option>
            {TYPES.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* Facility Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {facilities.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon="facilities"
              title="No facilities found"
              description="Try adjusting your search or filters, or add a new facility."
              action={isAdmin() ? (
                <button onClick={openCreateModal} className="mt-4 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-base font-medium transition-all flex items-center gap-2 mx-auto">
                  <HiPlus size={18} /> Add Facility
                </button>
              ) : null}
            />
          </div>
        ) : (
          facilities.map((f) => (
            <div key={f.id} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-primary/30 transition-all group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{typeIcons[f.type] || '📦'}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-primary-light transition-colors">{f.name}</h3>
                      <p className="text-sm text-dark-text mt-1">{f.type}</p>
                    </div>
                  </div>
                  <StatusBadge status={f.status} />
                </div>
                {f.description && <p className="text-base text-dark-text-light mb-5 line-clamp-2">{f.description}</p>}
                <div className="flex items-center gap-5 text-base text-dark-text">
                  <span className="flex items-center gap-2"><HiLocationMarker size={16} /> {f.location}</span>
                  <span className="flex items-center gap-2"><HiUsers size={16} /> {f.capacity}</span>
                </div>
              </div>
              {isAdmin() && (
                <div className="flex border-t border-dark-border">
                  <button onClick={() => openEditModal(f)} className="flex-1 flex items-center justify-center gap-2 py-4 text-base text-dark-text hover:text-primary hover:bg-primary/5 transition-colors">
                    <HiPencil size={16} /> Edit
                  </button>
                  <div className="w-px bg-dark-border" />
                  <button onClick={() => handleDelete(f.id)} className="flex-1 flex items-center justify-center gap-2 py-4 text-base text-dark-text hover:text-danger hover:bg-danger/5 transition-colors">
                    <HiTrash size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Facility' : 'Add New Facility'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-base font-medium text-dark-text-light mb-2">Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-dark-text-light mb-2">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="ROOM">Room</option>
                <option value="LAB">Lab</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-dark-text-light mb-2">Capacity</label>
              <input type="number" min="1" required value={form.capacity} onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div>
            <label className="block text-base font-medium text-dark-text-light mb-2">Location</label>
            <input type="text" required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-base font-medium text-dark-text-light mb-2">Description</label>
            <textarea rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>
          <div>
            <label className="block text-base font-medium text-dark-text-light mb-2">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
          <div className="flex gap-4 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-dark-border rounded-lg text-base font-medium text-dark-text-light hover:bg-dark-border/40 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 bg-primary hover:bg-primary-dark rounded-lg text-base font-medium text-white transition-colors shadow-lg shadow-primary/20">
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


