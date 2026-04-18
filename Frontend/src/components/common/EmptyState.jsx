import { HiInbox, HiOfficeBuilding, HiCalendar, HiTicket, HiBell, HiPlus } from 'react-icons/hi';

const icons = {
  default: HiInbox,
  facilities: HiOfficeBuilding,
  bookings: HiCalendar,
  tickets: HiTicket,
  notifications: HiBell,
};

export default function EmptyState({ 
  icon = 'default', 
  title = 'No data found', 
  description = 'There are no items to display at the moment.',
  action = null,
  className = ''
}) {
  const Icon = icons[icon] || icons.default;

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-border/30">
        <Icon className="text-dark-text" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 text-center">{title}</h3>
      <p className="text-dark-text text-sm text-center max-w-sm mb-6">{description}</p>
      {action && action}
    </div>
  );
}
