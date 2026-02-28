import { useNavigate } from 'react-router-dom';
import useFetchUser from './utils/fetchUser';

function ProtectedRoute({ children }) {
  const user = useFetchUser();
  const navigate = useNavigate();

  if (user === undefined) return null; // still loading

  if (!user) {
    navigate('/'); // not logged in, redirect to login page
    return null;
  }

  return children; // logged in
}

export default ProtectedRoute;
