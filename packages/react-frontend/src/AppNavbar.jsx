import PolyPoolLogo from './imagesAndIcons/PolyPoolLogo.png';
import PolyPoolIcon from './imagesAndIcons/PolyPoolIcon.png';
import PlusIcon from './imagesAndIcons/PlusIcon.png';

function AppNavbar({ onCreateRideClick, onProfileClick, onSignOutClick, children }) {
  return (
    <nav className="navbar">
      <span className="navbar-icon">
        <img src={PolyPoolIcon} alt="PolyPool Icon" />
      </span>
      <span className="navbar-logo">
        <img src={PolyPoolLogo} alt="PolyPool Logo" />
      </span>

      <button className="createRide-button" onClick={onCreateRideClick}>
        <img src={PlusIcon} alt="Plus Icon"></img>
        Create Ride
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

    <button className = "createRide-button" onClick={onSignOutClick}>
      Sign Out
    </button>

      {children}
    </nav>
  );
}

export default AppNavbar;
