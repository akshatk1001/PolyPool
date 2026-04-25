import PolyPoolLogo from './imagesAndIcons/PolyPoolLogo.png';
import PolyPoolIcon from './imagesAndIcons/PolyPoolIcon.png';
import PlusIcon from './imagesAndIcons/PlusIcon.png';
import ProfileIcon from './imagesAndIcons/ProfilePic.png';
import CarIcon from './imagesAndIcons/CarIcon.png';
import fetchUser from './utils/fetchUser';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

function AppNavbar({
  onCreateRideClick,
  onProfileClick,
  onSignOutClick,
  onMyRidesClick,
  children,
}) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePicSrc, setProfilePicSrc] = useState(ProfileIcon);
  const dropdownRef = useRef(null);

  const goHome = () => navigate('/home');

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUser()
      .then((user) => setProfilePicSrc(user?.profile_pic || ProfileIcon))
      .catch(() => setProfilePicSrc(ProfileIcon));
  }, []);

  return (
    <nav className="navbar">
      <button
        className="navbar-home-icon"
        onClick={goHome}
        type="button"
        aria-label="Go to home"
      >
        <img src={PolyPoolIcon} alt="" />
      </button>

      <button
        className="navbar-logo"
        onClick={goHome}
        type="button"
        aria-label="Go to home"
      >
        <img src={PolyPoolLogo} alt="PolyPool Logo" />
      </button>

      <button
        className="createRide-button"
        onClick={onCreateRideClick}
        aria-label="Create ride"
      >
        <img src={PlusIcon} alt="Plus Icon"></img>
        <span className="nav-button-label">Create Ride</span>
      </button>

      <button
        className="my-rides-button"
        onClick={onMyRidesClick}
        aria-label="My rides"
      >
        <img src={CarIcon} alt="Car Icon" />
        <span className="nav-button-label">My Rides</span>
      </button>

      <div className="profile-dropdown" ref={dropdownRef}>
        <button
          className="profile-button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-label="Profile menu"
        >
          <img
            src={profilePicSrc}
            alt="Profile Icon"
            onError={() => setProfilePicSrc(ProfileIcon)}
          />
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => {
                setDropdownOpen(false);
                onProfileClick();
              }}
            >
              View Profile
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                setDropdownOpen(false);
                onSignOutClick();
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {children}
    </nav>
  );
}

export default AppNavbar;
