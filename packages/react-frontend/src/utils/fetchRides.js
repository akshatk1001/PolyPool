import { API_URL } from '../constants/api';

async function fetchRides() {
  const response = await fetch(`${API_URL}/api/rides`);
  return response.json();
}

export default fetchRides;
