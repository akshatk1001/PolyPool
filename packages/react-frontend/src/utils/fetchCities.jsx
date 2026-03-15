import { API_URL } from '../constants/api';

export default async function fetchCities() {
  const response = await fetch(`${API_URL}/api/cities`);

  if (!response.ok) {
    throw new Error('Failed to fetch cities');
  }

  return response.json();
}
