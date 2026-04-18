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
    if (path.startsWith('/tickets')) return 'Tickets';
    if (path.startsWith('/notifications')) return 'Notifications';
    return 'CampsHub';
  };

  return (
    <header className="h-18 glass-strong border-b border-dark-border/50 flex items-center justify-between px-5 lg:px-6 sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-5">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-3 rounded-lg text-dark-text hover:text-white hover:bg-dark-border/50 transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <HiX size={26} /> : <HiMenu size={26} />}
        </button>
        <h1 className="text-xl font-semibold text-white tracking-tight leading-tight">{getPageTitle()}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={openNotifDrop}
            className="relative p-3 rounded-lg text-dark-text hover:text-white hover:bg-dark-border/50 transition-all duration-200"
            aria-label="Notifications"
          >
            <HiBell size={22} />
            {notifCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-danger rounded-full animate-pulse-subtle">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>
          {showNotifDrop && (
            <div className="absolute right-0 mt-4 w-96 glass rounded-lg border border-dark-border/50 shadow-2xl overflow-hidden animate-scale-in z-50">
              <div className="flex items-center justify-between gap-4 p-5 border-b border-dark-border/30">
                <span className="text-lg font-semibold text-white">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-base font-medium text-primary hover:text-primary-light transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-6 text-center text-dark-text text-base">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className="p-5 border-b border-dark-border/20 hover:bg-dark-border/30 cursor-pointer transition-colors duration-150"
                    >
                      <p className="text-base text-dark-text-light leading-relaxed line-clamp-2">{n.message}</p>
                      <p className="text-sm text-dark-text mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
              <Link
                to="/notifications"
                onClick={() => setShowNotifDrop(false)}
                className="block text-center py-4 text-base font-medium text-primary hover:bg-dark-border/30 transition-colors border-t border-dark-border/30"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifDrop(false); }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-border/50 transition-all duration-200"
            aria-label="User menu"
          >
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full ring-2 ring-primary/40 object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <HiUser className="text-primary" size={20} />
              </div>
            )}
            <span className="hidden md:block text-base font-medium text-dark-text-light max-w-[120px] truncate">{user?.name}</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-4 w-60 glass rounded-lg border border-dark-border/50 shadow-2xl animate-scale-in z-50">
              <div className="p-5 border-b border-dark-border/30">
                <p className="text-lg font-semibold text-white leading-tight truncate">{user?.name}</p>
                <p className="text-base text-dark-text mt-2 truncate">{user?.email}</p>
                <span className="inline-block mt-3 px-3 py-1 text-sm font-semibold uppercase rounded-md bg-primary/20 text-primary-light">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-5 py-4 text-base font-medium text-danger hover:bg-dark-border/30 transition-colors duration-150"
              >
                <HiLogout size={18} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
