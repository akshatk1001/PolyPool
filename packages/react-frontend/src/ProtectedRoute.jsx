import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import fetchUser from './utils/fetchUser';

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetchUser().then(setUser).catch(() => setUser(null));
  }, []);

  if (user === undefined) return null; // still loading

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children; // logged in
}

export default ProtectedRoute;
