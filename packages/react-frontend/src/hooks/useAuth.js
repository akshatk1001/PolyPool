import { useCallback, useEffect, useState } from 'react';

function useAuth() {
  const [currentUser, setCurrentUser] = useState(undefined);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      } else {
        setCurrentUser(null); // not authenticated
      }
    } catch (error) {
      console.log('Error fetching user:', error);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { currentUser, fetchUser };
}

export default useAuth;