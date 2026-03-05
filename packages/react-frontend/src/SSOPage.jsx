import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SSOPage.css';
import PolyPoolLogo from './imagesAndIcons/PolyPoolLogo.png';
import CalPolyLogo from './imagesAndIcons/Cal_Poly_Mustangs_logo.svg';
import useFetchUser from './utils/fetchUser';


function SSOPage() {
  const navigate = useNavigate();
  const user = useFetchUser();

  // if user is already signed in, send them to home page
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user]);

  // show alert if failed auth, or prompt for phone if new user
  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // ie http://localhost:5173?auth=failed
    const auth = params.get('auth');
    // remove the query in the link since we are addressing the alert
    window.history.replaceState({}, '', window.location.pathname);

    if (auth === 'failed') {
      alert(
        'Only Cal Poly email addresses (@calpoly.edu) are allowed to sign in. Please try again with a valid Cal Poly account.',
      );
    } else if (auth === 'needs_phone') {
      const phone = window.prompt('Enter your phone number to complete sign-up:');
      if (phone.length !== 10) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }

      fetch('http://localhost:8000/api/auth/complete-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phoneNum: phone.replace(/\D/g, '') }),
      }).then((res) => {
        if (res.ok) navigate('/home');
        else alert('Sign-up failed.');
      });
    }
  }, []);

  function signIn() {
    window.location.href = 'http://localhost:8000/auth/microsoft';
  }

  return (
    <div className="sso-page">
      <span className="background">
        <span className="sso-frame">
          <img className="polypool-logo" src={PolyPoolLogo} alt="SSO Logo" />
          <button className="sso-button" onClick={signIn}>
            <img src={CalPolyLogo} alt="Cal Poly Logo" className="sso-logo" />
            Sign in with Cal Poly
          </button>
          {user && <p>Welcome, {user.displayName}!</p>}
        </span>
      </span>
    </div>
  );
}

export default SSOPage;
