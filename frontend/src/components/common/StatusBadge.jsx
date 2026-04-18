export default function StatusBadge({ status }) {
  const styles = {
    ACTIVE: 'bg-success/15 text-success border-success/30 hover:bg-success/20',
    OUT_OF_SERVICE: 'bg-danger/15 text-danger border-danger/30 hover:bg-danger/20',
    PENDING: 'bg-warning/15 text-warning border-warning/30 hover:bg-warning/20',
    APPROVED: 'bg-success/15 text-success border-success/30 hover:bg-success/20',
    REJECTED: 'bg-danger/15 text-danger border-danger/30 hover:bg-danger/20',
    CANCELLED: 'bg-dark-text/15 text-dark-text border-dark-text/30 hover:bg-dark-text/20',
    OPEN: 'bg-secondary/15 text-secondary border-secondary/30 hover:bg-secondary/20',
    IN_PROGRESS: 'bg-warning/15 text-warning border-warning/30 hover:bg-warning/20',
    RESOLVED: 'bg-success/15 text-success border-success/30 hover:bg-success/20',
    CLOSED: 'bg-dark-text/15 text-dark-text border-dark-text/30 hover:bg-dark-text/20',
    LOW: 'bg-success/15 text-success border-success/30 hover:bg-success/20',
    MEDIUM: 'bg-warning/15 text-warning border-warning/30 hover:bg-warning/20',
    HIGH: 'bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/20',
    CRITICAL: 'bg-danger/15 text-danger border-danger/30 hover:bg-danger/20',
  };

  return (
    <span className={`inline-flex items-center p-4 m-2 rounded-md text-xs font-semibold border transition-colors duration-200 ${styles[status] || 'bg-dark-border/50 text-dark-text-light border-dark-border'}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

