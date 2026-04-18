import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService, facilityService } from '../services/dataService';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { HiPlus, HiCheck, HiX, HiBan, HiCalendar, HiClock, HiChat } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Bookings() {
  const { user, isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reason, setReason] = useState('');
  const [tab, setTab] = useState('all');
  const [form, setForm] = useState({ facilityId: '', startTime: '', endTime: '', purpose: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [bookRes, facRes] = await Promise.all([
        isAdmin() ? bookingService.getAll() : bookingService.getMyBookings(),
        facilityService.getAll({ status: 'ACTIVE' }),
      ]);
      setBookings(bookRes.data);
      setFacilities(facRes.data);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };
      await bookingService.create(payload);
      toast.success('Booking created!');
      setShowCreateModal(false);
      setForm({ facilityId: '', startTime: '', endTime: '', purpose: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    }
  };

  const openAction = (booking, type) => {
    setSelectedBooking(booking);
    setActionType(type);
    setReason('');
    setShowActionModal(true);
  };

  const handleAction = async () => {
    try {
      if (actionType === 'approve') {
        await bookingService.approve(selectedBooking.id, { reason });
        toast.success('Booking approved');
      } else if (actionType === 'reject') {
        await bookingService.reject(selectedBooking.id, { reason });
        toast.success('Booking rejected');
      } else if (actionType === 'cancel') {
        await bookingService.cancel(selectedBooking.id);
        toast.success('Booking cancelled');
      }
      setShowActionModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (tab === 'all') return true;
    return b.status === tab;
  });

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 m-2 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Bookings</h2>
          <p className="text-dark-text text-base">{isAdmin() ? 'Manage all facility bookings' : 'View and manage your bookings'}</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium text-base transition-all shadow-lg shadow-primary/20">
          <HiPlus size={20} /> New Booking
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-dark-card border border-dark-border rounded-xl p-2 overflow-x-auto">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2.5 rounded-lg text-base font-medium transition-all whitespace-nowrap
            ${tab === key ? 'bg-primary text-white shadow-md' : 'text-dark-text hover:text-white hover:bg-dark-border/40'}`}>
            {label}
            {key !== 'all' && (
              <span className="ml-2 text-sm opacity-70">
                ({bookings.filter(b => b.status === key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-dark-card border border-dark-border rounded-xl p-8">
            <EmptyState
              icon="bookings"
              title="No bookings found"
              description={tab === 'all' ? "You haven't made any bookings yet." : `No ${tab.toLowerCase()} bookings found.`}
              action={<button onClick={() => setShowCreateModal(true)} className="mt-4 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-base font-medium transition-all flex items-center gap-2 mx-auto">
                <HiPlus size={18} /> New Booking
              </button>}
            />
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div key={b.id} className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-white">{b.facilityName}</h3>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-base text-dark-text-light mb-3">{b.purpose}</p>
                  <div className="flex flex-wrap items-center gap-5 text-base text-dark-text">
                    <span className="flex items-center gap-2"><HiCalendar size={16} /> {new Date(b.startTime).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><HiClock size={16} /> {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isAdmin() && <span className="text-sm">By: {b.userName}</span>}
                  </div>
                  {b.adminReason && (
                    <div className="mt-3 flex items-start gap-2 text-base">
                      <HiChat className="text-dark-text mt-0.5 shrink-0" size={16} />
                      <span className="text-dark-text-light italic">"{b.adminReason}"</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 shrink-0">
                  {isAdmin() && b.status === 'PENDING' && (
                    <>
                      <button onClick={() => openAction(b, 'approve')} className="flex items-center gap-2 px-4 py-2.5 bg-success/10 text-success border border-success/20 rounded-lg text-base hover:bg-success/20 transition-colors">
                        <HiCheck size={18} /> Approve
                      </button>
                      <button onClick={() => openAction(b, 'reject')} className="flex items-center gap-2 px-4 py-2.5 bg-danger/10 text-danger border border-danger/20 rounded-lg text-base hover:bg-danger/20 transition-colors">
                        <HiX size={18} /> Reject
                      </button>
                    </>
                  )}
                  {b.userId === user?.id && (b.status === 'PENDING' || b.status === 'APPROVED') && (
                    <button onClick={() => openAction(b, 'cancel')} className="flex items-center gap-2 px-4 py-2.5 bg-dark-border/50 text-dark-text-light rounded-lg text-base hover:bg-dark-border transition-colors">
                      <HiBan size={18} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Booking Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="New Booking">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-base font-medium text-dark-text-light mb-2">Facility</label>
            <select required value={form.facilityId} onChange={e => setForm({ ...form, facilityId: e.target.value })}
              className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">Select a facility</option>
              {facilities.map(f => <option key={f.id} value={f.id}>{f.name} — {f.type} ({f.location})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-dark-text-light mb-2">Start Time</label>
              <input type="datetime-local" required value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-base font-medium text-dark-text-light mb-2">End Time</label>
              <input type="datetime-local" required value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div>
            <label className="block text-base font-medium text-dark-text-light mb-2">Purpose</label>
            <textarea rows="4" required value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}
              placeholder="Describe the purpose of this booking..."
              className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 border border-dark-border rounded-lg text-base font-medium text-dark-text-light hover:bg-dark-border/40 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-primary hover:bg-primary-dark rounded-lg text-base font-medium text-white transition-colors shadow-lg shadow-primary/20">Create Booking</button>
          </div>
        </form>
      </Modal>

      {/* Action Modal (Approve/Reject/Cancel) */}
      <Modal isOpen={showActionModal} onClose={() => setShowActionModal(false)} title={`${actionType?.charAt(0).toUpperCase() + actionType?.slice(1)} Booking`}>
        <div className="space-y-5">
          <p className="text-base text-dark-text-light">
            Are you sure you want to <span className="font-semibold text-white">{actionType}</span> the booking for <span className="font-semibold text-white">{selectedBooking?.facilityName}</span>?
          </p>
          {(actionType === 'approve' || actionType === 'reject') && (
            <div>
              <label className="block text-base font-medium text-dark-text-light mb-2">Reason (optional)</label>
              <textarea rows="4" value={reason} onChange={e => setReason(e.target.value)}
                placeholder="Add a reason..."
                className="w-full px-4 py-3 bg-dark border border-dark-border rounded-lg text-base text-white placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
          )}
          <div className="flex gap-4 pt-2">
            <button onClick={() => setShowActionModal(false)} className="flex-1 py-3 border border-dark-border rounded-lg text-base font-medium text-dark-text-light hover:bg-dark-border/40 transition-colors">Cancel</button>
            <button onClick={handleAction}
              className={`flex-1 py-3 rounded-lg text-base font-medium text-white transition-colors shadow-lg
              ${actionType === 'approve' ? 'bg-success hover:bg-success/80 shadow-success/20' :
                  actionType === 'reject' ? 'bg-danger hover:bg-danger/80 shadow-danger/20' :
                    'bg-dark-text hover:bg-dark-text/80 shadow-dark-text/20'}`}>
              Confirm {actionType}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


