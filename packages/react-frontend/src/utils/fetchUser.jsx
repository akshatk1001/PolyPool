import { useEffect, useState } from 'react';

function useFetchUser() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in

  useEffect(() => {
    fetch('http://localhost:8000/api/auth/me', { credentials: 'include' })
      .then((response) => {
        if (response.ok) return response.json();
        return null;
      })
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user:', err));
  }, []);

  return user;
}

export default useFetchUser;
