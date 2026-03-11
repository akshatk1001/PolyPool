import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import fetchUser from './utils/fetchUser';

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) return null; // still loading

  if (!user) {
    navigate('/'); // not logged in, redirect to login page
    return null;
  }

  return children; // logged in
}

export default ProtectedRoute;
