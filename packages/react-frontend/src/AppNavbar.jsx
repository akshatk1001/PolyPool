import PolyPoolLogo from './imagesAndIcons/PolyPoolLogo.png';
import PolyPoolIcon from './imagesAndIcons/PolyPoolIcon.png';
import PlusIcon from './imagesAndIcons/PlusIcon.png';
import { useNavigate } from 'react-router-dom';

function AppNavbar({ onCreateRideClick, onProfileClick, onSignOutClick, onMyRidesClick, children }) {
  const navigate = useNavigate();

  const goHome = () => navigate('/home');

  return (
    <nav className="navbar">
      <button className="navbar-icon" onClick={goHome} type="button" aria-label="Go to home">
        <img src={PolyPoolIcon} alt="PolyPool Icon" />
      </button>
      <button className="navbar-logo" onClick={goHome} type="button" aria-label="Go to home">
        <img src={PolyPoolLogo} alt="PolyPool Logo" />
      </button>

      <button className="createRide-button" onClick={onCreateRideClick}>
        <img src={PlusIcon} alt="Plus Icon"></img>
        Create Ride
      </button>

      <button className="my-rides-button" onClick={onMyRidesClick}>
        My Rides
      </button>

      <button className="profile-button" onClick={onProfileClick}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
        </svg>
      </button>

    <button className="signout-button" onClick={onSignOutClick}>
      Sign Out
    </button>

      {children}
    </nav>
  );
}

export default AppNavbar;
