import { API_URL } from '../constants/api';

async function fetchUser(id) {
  if (!id) {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    });
    if (!response.ok) return null;
    return response.json();
  } else {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) return null;
    return response.json();
  }
}

export default fetchUser;
