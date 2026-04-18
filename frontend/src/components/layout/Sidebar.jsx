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

      <aside className={`p-4 m-2 fixed top-0 left-0 h-full w-72 bg-dark-card/95 backdrop-blur-sm border-r border-dark-border/50 z-50 transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>

        {/* Logo & Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-dark-border/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              CampsHub
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-dark-text hover:text-white hover:bg-dark-border/50 transition-all"
            aria-label="Close sidebar"
          >
            <HiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 m-2 space-y-2 mt-6">
          {filteredItems.map(({ path, label, icon: Icon }, idx) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3.5 rounded-xl text-base font-medium transition-all duration-200
                ${isActive
                  ? 'bg-primary/15 text-primary-light border border-primary/20 shadow-sm'
                  : 'text-dark-text hover:text-white hover:bg-dark-border/40'}`
              }
            >
              <Icon size={22} className="flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-dark-border/30 bg-gradient-to-t from-dark-card/50 to-transparent">
          <div className="flex items-center gap-4 px-2">
            {user?.picture ? (
              <img src={user.picture} alt="" className="w-12 h-12 rounded-full ring-2 ring-primary/20 object-cover flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-lg flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-white truncate">{user?.name}</p>
              <p className="text-sm text-dark-text/70 truncate">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}


