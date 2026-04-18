import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import RoutesList from './RoutesList';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <RoutesList />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
