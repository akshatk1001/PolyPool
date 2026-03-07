async function fetchUser() {
  const response = await fetch('http://localhost:8000/api/auth/me', { credentials: 'include' });
  if (!response.ok) return null;
  return response.json();
}

export default fetchUser;
