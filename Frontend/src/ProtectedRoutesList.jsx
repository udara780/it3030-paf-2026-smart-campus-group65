// This file is no longer used - routes are handled in RoutesList.jsx
// Kept for reference
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function ProtectedRoutesList() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return null;
}
