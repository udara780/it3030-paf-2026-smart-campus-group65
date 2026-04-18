import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiHome, HiOfficeBuilding, HiCalendar, HiTicket, HiBell, HiX } from 'react-icons/hi';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiHome, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
  { path: '/facilities', label: 'Facilities', icon: HiOfficeBuilding, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
  { path: '/bookings', label: 'Bookings', icon: HiCalendar, roles: ['USER', 'ADMIN'] },
  { path: '/tickets', label: 'Tickets', icon: HiTicket, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
  { path: '/notifications', label: 'Notifications', icon: HiBell, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-dark-card border-r border-dark-border z-50 transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-dark-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
              CampsHub
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-dark-text-light hover:text-white">
            <HiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 mt-2">
          {filteredItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-primary/15 text-primary-light shadow-sm border border-primary/20'
                  : 'text-dark-text hover:text-white hover:bg-dark-border/40'}`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border">
          <div className="flex items-center gap-3">
            {user?.picture ? (
              <img src={user.picture} alt="" className="w-9 h-9 rounded-full ring-2 ring-dark-border" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-dark-text truncate">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
