import { API_URL } from '../constants/api';

async function fetchRideById(id) {
  const response = await fetch(`${API_URL}/api/rides/${id}`, {
    credentials: 'include',
  });
  if (!response.ok) return null;
  return response.json();
}

export default fetchRideById;
