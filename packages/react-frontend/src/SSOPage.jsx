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
  }, [user, navigate]);

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
