import { Navigate } from 'react-router-dom';
import useFetchUser from './utils/fetchUser';

function ProtectedRoute({ children }) {
  const user = useFetchUser();

  if (user === undefined) return null; // still loading

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children; // logged in
}

export default ProtectedRoute;
