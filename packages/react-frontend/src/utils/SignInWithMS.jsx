import React, { useState, useEffect } from 'react';

function SignInWithMS() {
  const [user, setUser] = useState(null);


  function getUserInfo() {
    fetch('http://localhost:8000/api/auth/me', { credentials: 'include' })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Not authenticated');
        }
      })
      .then((data) => setUser(data))
      .catch((error) => console.error('Error fetching user info:', error));
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'success') {
      getUserInfo();
    }
  }, []);

  function signIn() {
    window.location.href = 'http://localhost:8000/auth/microsoft';
  }
  return (
    <div>
      <button onClick={signIn}>Sign in with Microsoft</button>
      {user && <p>Welcome, {user.displayName}!</p>}
      {user && <p>All info: {JSON.stringify(user, null, 2)}</p>}
    </div>
  );
}

export default SignInWithMS;
