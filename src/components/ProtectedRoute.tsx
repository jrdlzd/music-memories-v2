import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { session, isLoading } = useAuth();

  // show loading state while supabase checks
  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-neutral-500 animate-pulse">
        Verifying access...
      </div>
    );
  }

  // if no session, back to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // route to admin page otherwise
  return <Outlet />;
};

export default ProtectedRoute;