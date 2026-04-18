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
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <p className="text-dark-text mt-1">{unreadCount > 0 ? `You have ${unreadCount} unread notification(s)` : 'You are all caught up!'}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2.5 bg-dark-card border border-dark-border text-dark-text-light hover:text-white rounded-lg font-medium text-sm transition-all hover:border-primary/30">
            <HiCheckCircle size={18} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-dark-card border border-dark-border rounded-xl p-1">
        {[{ key: 'all', label: 'All' }, { key: 'unread', label: `Unread (${unreadCount})` }].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${filter === key ? 'bg-primary text-white shadow-md' : 'text-dark-text hover:text-white hover:bg-dark-border/40'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-dark-card border border-dark-border rounded-xl">
            <HiBell className="mx-auto text-dark-text mb-3" size={48} />
            <p className="text-dark-text">{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div key={n.id}
              className={`bg-dark-card border rounded-xl p-4 transition-all hover:border-primary/20
              ${n.read ? 'border-dark-border' : 'border-primary/30 bg-primary/5'}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                  ${n.read ? 'bg-dark-border/50' : 'bg-primary/10'}`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${n.read ? 'text-dark-text' : 'text-white'}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-dark-text">{new Date(n.createdAt).toLocaleString()}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-dark-border text-dark-text">
                      {n.type?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                {!n.read && (
                  <button onClick={() => markRead(n.id)}
                    className="shrink-0 p-1.5 text-primary-light hover:bg-primary/10 rounded-lg transition-colors" title="Mark as read">
                    <HiCheck size={18} />
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
