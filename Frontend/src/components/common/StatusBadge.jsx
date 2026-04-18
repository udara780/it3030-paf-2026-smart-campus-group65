export default function StatusBadge({ status }) {
  const styles = {
    ACTIVE: 'bg-success/15 text-success border-success/30',
    OUT_OF_SERVICE: 'bg-danger/15 text-danger border-danger/30',
    PENDING: 'bg-warning/15 text-warning border-warning/30',
    APPROVED: 'bg-success/15 text-success border-success/30',
    REJECTED: 'bg-danger/15 text-danger border-danger/30',
    CANCELLED: 'bg-dark-text/15 text-dark-text border-dark-text/30',
    OPEN: 'bg-secondary/15 text-secondary border-secondary/30',
    IN_PROGRESS: 'bg-warning/15 text-warning border-warning/30',
    RESOLVED: 'bg-success/15 text-success border-success/30',
    CLOSED: 'bg-dark-text/15 text-dark-text border-dark-text/30',
    LOW: 'bg-success/15 text-success border-success/30',
    MEDIUM: 'bg-warning/15 text-warning border-warning/30',
    HIGH: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    CRITICAL: 'bg-danger/15 text-danger border-danger/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-dark-border text-dark-text-light border-dark-border'}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}
