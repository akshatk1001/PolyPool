import { API_URL } from '../constants/api';

async function fetchUser() {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    credentials: 'include',
  });
  if (!response.ok) return null;
  return response.json();
}

export default fetchUser;
