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
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-dark-text mt-1">Here's what's happening with your campus today</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, link }) => (
          <Link to={link} key={label} className="group bg-dark-card border border-dark-border rounded-xl p-5 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 hover-lift">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="text-white" size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-dark-text mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-dark-border">
            <h3 className="font-semibold text-white">Recent Bookings</h3>
            <Link to="/bookings" className="text-sm text-primary hover:text-primary-light transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-dark-border/50">
            {recentBookings.length === 0 ? (
              <EmptyState 
                icon="bookings"
                title="No bookings yet"
                description="You haven't made any bookings. Start by booking a facility."
                action={<Link to="/bookings" className="mt-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-all">Create Booking</Link>}
              />
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="p-4 hover:bg-dark-border/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{b.facilityName}</p>
                      <p className="text-xs text-dark-text mt-0.5">{b.purpose}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-xs text-dark-text mt-2">
                    {new Date(b.startTime).toLocaleDateString()} • {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-dark-border">
            <h3 className="font-semibold text-white">Recent Tickets</h3>
            <Link to="/tickets" className="text-sm text-primary hover:text-primary-light transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-dark-border/50">
            {recentTickets.length === 0 ? (
              <EmptyState 
                icon="tickets"
                title="No tickets yet"
                description="You haven't submitted any maintenance tickets."
                action={<Link to="/tickets" className="mt-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-all">Report Issue</Link>}
              />
            ) : (
              recentTickets.map((t) => (
                <div key={t.id} className="p-4 hover:bg-dark-border/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{t.title}</p>
                      <p className="text-xs text-dark-text mt-0.5">{t.facilityName}</p>
                    </div>
                    <div className="flex gap-2">
                      <StatusBadge status={t.priority} />
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}