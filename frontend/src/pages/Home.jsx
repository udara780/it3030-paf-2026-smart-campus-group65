// This page is replaced by Login.jsx
// Redirecting to login
import { Navigate } from 'react-router-dom';

export default function Home() {
  return <Navigate to="/" replace />;
}