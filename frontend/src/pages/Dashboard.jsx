import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { facilityService, bookingService, ticketService } from '../services/dataService';
import { HiOfficeBuilding, HiCalendar, HiTicket, HiClock, HiCheckCircle, HiExclamation } from 'react-icons/hi';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    facilities: 0,
    bookings: 0,
    pendingBookings: 0,
    tickets: 0,
    openTickets: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [facRes, bookRes, tickRes] = await Promise.all([
        facilityService.getAll(),
        user?.role === 'ADMIN' ? bookingService.getAll() : bookingService.getMyBookings(),
        user?.role === 'TECHNICIAN' ? ticketService.getAssignedTickets() : user?.role === 'ADMIN' ? ticketService.getAll() : ticketService.getMyTickets(),
      ]);

      const bookings = bookRes.data;
      const tickets = tickRes.data;

      setStats({
        facilities: facRes.data.length,
        bookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
        tickets: tickets.length,
        openTickets: tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
      });
      setRecentBookings(bookings.slice(0, 5));
      setRecentTickets(tickets.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Facilities', value: stats.facilities, icon: HiOfficeBuilding, color: 'linear-to-br from-primary to-primary-dark', link: '/facilities' },
    { label: 'My Bookings', value: stats.bookings, icon: HiCalendar, color: 'linear-to-br from-secondary to-blue-700', link: '/bookings' },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: HiClock, color: 'linear-to-br from-warning to-orange-600', link: '/bookings' },
    { label: user?.role === 'TECHNICIAN' ? 'Assigned Tickets' : 'My Tickets', value: stats.tickets, icon: HiTicket, color: 'linear-to-br from-purple-500 to-purple-700', link: '/tickets' },
    { label: 'Active Issues', value: stats.openTickets, icon: HiExclamation, color: 'linear-to-br from-danger to-red-700', link: '/tickets' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-dark-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 m-2 space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="pb-2">
        <h1 className="text-3xl font-bold text-white mb-2 leading-tight">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-dark-text text-base leading-relaxed">Quick overview of your campus operations</p>
      </div>

      {/* Stat Cards - Enhanced Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map(({ label, value, icon: IconComponent, color, link }) => (
          <Link to={link} key={label} className="stagger-item animate-slide-up group card card-interactive relative overflow-hidden">
            {/* Accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start justify-between mb-6">
              <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                <IconComponent className="text-white" size={22} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-3xl font-bold text-white leading-tight">{value}</p>
              <p className="text-sm text-dark-text group-hover:text-dark-text-light transition-colors leading-relaxed">{label}</p>
            </div>

            {/* Subtle indicator */}
            <div className="absolute bottom-0 right-0 opacity-5 text-6xl font-bold text-primary">
              {label.split(' ')[0][0]}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity - Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings Card */}
        <div className="card animate-slide-up overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-dark-border mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white leading-tight">Recent Bookings</h3>
              <p className="text-sm text-dark-text mt-1 leading-relaxed">Latest facility reservations</p>
            </div>
            <Link to="/bookings" className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors font-medium whitespace-nowrap">
              View all
              <span>→</span>
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon="bookings"
                title="No bookings yet"
                description="You haven't made any bookings."
              />
            </div>
          ) : (
            <div className="divide-y divide-dark-border/30">
              {recentBookings.map((b) => (
                <div key={b.id} className="stagger-item animate-slide-up py-4 hover:bg-dark-border/10 transition-colors duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-white truncate leading-tight">{b.facilityName}</p>
                      <p className="text-sm text-dark-text mt-1 truncate leading-relaxed">{b.purpose}</p>
                      <p className="text-sm text-dark-text/60 mt-2 leading-relaxed">
                        {new Date(b.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tickets Card */}
        <div className="card animate-slide-up overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-dark-border mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white leading-tight">Recent Tickets</h3>
              <p className="text-sm text-dark-text mt-1 leading-relaxed">Latest maintenance requests</p>
            </div>
            <Link to="/tickets" className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors font-medium whitespace-nowrap">
              View all
              <span>→</span>
            </Link>
          </div>

          {recentTickets.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon="tickets"
                title="No tickets yet"
                description="No maintenance requests submitted."
              />
            </div>
          ) : (
            <div className="divide-y divide-dark-border/30">
              {recentTickets.map((t) => (
                <div key={t.id} className="stagger-item animate-slide-up py-4 hover:bg-dark-border/10 transition-colors duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-white truncate leading-tight">{t.title}</p>
                      <p className="text-sm text-dark-text mt-1 truncate leading-relaxed">{t.facilityName}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <StatusBadge status={t.priority} />
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

