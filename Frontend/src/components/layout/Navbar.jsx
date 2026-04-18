import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/dataService';
import { HiBell, HiMenu, HiX, HiLogout, HiUser } from 'react-icons/hi';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { user, logout } = useAuth();
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifDrop, setShowNotifDrop] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifDrop(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchNotifCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setNotifCount(res.data.count);
    } catch { /* ignore */ }
  };

  const openNotifDrop = async () => {
    setShowNotifDrop(!showNotifDrop);
    setShowUserMenu(false);
    if (!showNotifDrop) {
      try {
        const res = await notificationService.getUnread();
        setNotifications(res.data.slice(0, 5));
      } catch { /* ignore */ }
    }
  };

  const markRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setNotifCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications([]);
      setNotifCount(0);
    } catch { /* ignore */ }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/facilities')) return 'Facilities';
    if (path.startsWith('/bookings')) return 'Bookings';
    if (path.startsWith('/tickets')) return 'Tickets';
    if (path.startsWith('/notifications')) return 'Notifications';
    return 'CampsHub';
  };

  return (
    <header className="h-16 glass-strong border-b border-dark-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="lg:hidden text-dark-text-light hover:text-white transition-colors p-1">
          {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
        <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <div className="relative" ref={notifRef}>
          <button onClick={openNotifDrop} className="relative p-2 rounded-lg text-dark-text-light hover:text-white hover:bg-dark-border/50 transition-all">
            <HiBell size={22} />
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-danger text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>
          {showNotifDrop && (
            <div className="absolute right-0 mt-2 w-80 glass border border-dark-border rounded-xl shadow-glow-secondary overflow-hidden animate-scale-in z-50">
              <div className="flex items-center justify-between p-3 border-b border-dark-border">
                <span className="font-semibold text-sm text-white">Notifications</span>
                {notifications.length > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary hover:text-primary-light transition-colors">Mark all read</button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-dark-text text-sm">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} onClick={() => markRead(n.id)} className="p-3 border-b border-dark-border/50 hover:bg-dark-border/30 cursor-pointer transition-colors">
                      <p className="text-sm text-dark-text-light leading-relaxed">{n.message}</p>
                      <p className="text-xs text-dark-text mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
              <Link to="/notifications" onClick={() => setShowNotifDrop(false)} className="block text-center py-2.5 text-sm text-primary hover:bg-dark-border/30 transition-colors">
                View all
              </Link>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifDrop(false); }} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-dark-border/50 transition-all">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-primary/50" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <HiUser className="text-primary" size={18} />
              </div>
            )}
            <span className="hidden md:block text-sm font-medium text-dark-text-light">{user?.name}</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 glass border border-dark-border rounded-xl shadow-glow-secondary animate-scale-in z-50">
              <div className="p-3 border-b border-dark-border">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-dark-text truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-primary/20 text-primary-light">{user?.role}</span>
              </div>
              <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-danger hover:bg-dark-border/30 transition-colors">
                <HiLogout size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
