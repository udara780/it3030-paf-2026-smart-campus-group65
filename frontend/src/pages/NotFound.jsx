import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';
import { HiExclamationTriangle } from "react-icons/hi2";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 m-2">
      <div className="text-center max-w-md">
        <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 animate-pulse">
          <HiExclamationTriangle className="text-primary" size={48} />
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-3">Page Not Found</h2>
        <p className="text-dark-text-light mb-8">
          The page you're looking for doesn't exist or has been moved to a different location.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
        >
          <HiHome size={20} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

