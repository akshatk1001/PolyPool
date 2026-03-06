async function fetchRides() {
  const response = await fetch('http://localhost:8000/api/rides');
  return response.json();
}

export default fetchRides;
