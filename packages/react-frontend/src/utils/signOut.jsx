import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/api';

function useSignOut() {
  const navigate = useNavigate();

  function signOut() {
    fetch(`${API_URL}/api/auth/logout`, {
      credentials: 'include',
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          navigate('/');
        } else {
          console.error('Failed to sign out user:', response.statusText);
        }
      })
      .catch((err) => {
        console.error('Error signing out user:', err);
      });
  }

  return signOut;
}

export default useSignOut;
