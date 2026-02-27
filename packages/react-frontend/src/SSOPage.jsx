import './SSOPage.css';
import PolyPoolLogo from './imagesAndIcons/PolyPoolLogo.png';
import CalPolyLogo from './imagesAndIcons/Cal_Poly_Mustangs_logo.svg';
import CreateSSOButton from './SSOButton';


function SSOPage() {
  return (
    <div className="sso-page">
      <span className="background">
        <span className="sso-frame">
          <img className="polypool-logo" src={PolyPoolLogo} alt="SSO Logo" />
          <button
            className="sso-button"
            onClick={() => {/*Event(Ak has a small weiner)*/}}
          >
            <img src={CalPolyLogo} alt="Cal Poly Logo" className="sso-logo" />
            Sign in with Cal Poly
          </button>
        </span>
      </span>
    </div>
  );
}