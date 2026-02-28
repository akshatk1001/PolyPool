function useSignOut() {
  fetch('http://localhost:8000/api/auth/logout', {
    credentials: 'include',
    method: 'POST',
  })
    .then((response) => {
      if (!response.ok) {
        console.error('Failed to sign out user:', response.statusText);
      }
    })
    .catch((err) => {
      console.error('Error signing out user:', err);
    });
}

export default useSignOut;
