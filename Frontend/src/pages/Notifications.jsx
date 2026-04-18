import { useState, useEffect } from 'react';
import { notificationService } from '../services/dataService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { HiBell, HiCheck, HiCalendar, HiTicket, HiCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | unread

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {
      toast.error('Failed to update');
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch {
      toast.error('Failed to update');
    }
  };

  const getIcon = (type) => {
    if (type?.includes('BOOKING')) return <HiCalendar className="text-secondary" size={20} />;
    if (type?.includes('TICKET')) return <HiTicket className="text-purple-400" size={20} />;
    return <HiBell className="text-primary-light" size={20} />;
  };

  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Notifications</h2>
          <p className="text-dark-text text-base">{unreadCount > 0 ? `You have ${unreadCount} unread notification(s)` : 'You are all caught up!'}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-5 py-3 bg-dark-card border border-dark-border text-dark-text-light hover:text-white rounded-lg font-medium text-base transition-all hover:border-primary/30">
            <HiCheckCircle size={20} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 bg-dark-card border border-dark-border rounded-xl p-2">
        {[{ key: 'all', label: 'All' }, { key: 'unread', label: `Unread (${unreadCount})` }].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-5 py-2.5 rounded-lg text-base font-medium transition-all
            ${filter === key ? 'bg-primary text-white shadow-md' : 'text-dark-text hover:text-white hover:bg-dark-border/40'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 px-6 bg-dark-card border border-dark-border rounded-xl">
            <HiBell className="mx-auto text-dark-text mb-4" size={56} />
            <p className="text-dark-text text-lg">{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div key={n.id}
              className={`bg-dark-card border rounded-xl p-6 transition-all hover:border-primary/20
              ${n.read ? 'border-dark-border' : 'border-primary/30 bg-primary/5'}`}>
              <div className="flex items-start gap-5">
                <div className={`mt-0.5 w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                  ${n.read ? 'bg-dark-border/50' : 'bg-primary/10'}`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-base leading-relaxed ${n.read ? 'text-dark-text' : 'text-white'}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm text-dark-text">{new Date(n.createdAt).toLocaleString()}</span>
                    <span className="text-sm px-3 py-1 rounded-full bg-dark-border text-dark-text">
                      {n.type?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                {!n.read && (
                  <button onClick={() => markRead(n.id)}
                    className="shrink-0 p-2 text-primary-light hover:bg-primary/10 rounded-lg transition-colors" title="Mark as read">
                    <HiCheck size={20} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
