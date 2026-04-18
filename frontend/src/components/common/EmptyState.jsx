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
    <div className={`p-4 m-2 flex flex-col items-center justify-center py-20 px-8 ${className}`}>
      {/* Icon container */}
      <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-linear-to-br from-dark-border/50 to-dark-border/20 border border-dark-border/30">
        <Icon className="text-dark-text/50" size={44} />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-4 text-center">{title}</h3>
      <p className="text-dark-text text-base text-center max-w-sm leading-relaxed mb-4">{description}</p>

      {/* Action */}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

