import './App.css';
import PolyPoolLogo from './imagesAndIcons/PolyPoolLogo.png';
import PolyPoolIcon from './imagesAndIcons/PolyPoolIcon.png';
import PlusIcon from './imagesAndIcons/PlusIcon.png';
import { useState, useEffect } from 'react';
import CreateRideWindow from './CreateRideWindow';
import ProfileWindow from './ProfileWindow';
import SearchBar from './SearchBar.jsx';
import RidePreviewCard from './RidePreviewCard.jsx';

function App() {
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetchRides();
  }, []);

  async function fetchRides() {
    try {
      const response = await fetch('http://localhost:8000/api/rides');
      const data = await response.json();
      setRides(data);
    } catch (error) {
      console.log('Error fetching rides:', error);
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <span className="navbar-icon">
          <img src={PolyPoolIcon} alt="PolyPool Icon" />
        </span>
        <span className="navbar-logo">
          <img src={PolyPoolLogo} alt="PolyPool Logo" />
        </span>

        <button
          className="createRide-button"
          onClick={() => setShowCreateRide(true)}
        >
          <img src={PlusIcon} alt="Plus Icon"></img>
          Create Ride
        </button>

        {/* Grey person icon — opens the profile modal */}
        <button className="profile-button" onClick={() => setShowProfile(true)}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ccc"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circle for the head */}
            <circle cx="12" cy="8" r="4" />
            {/* Body arc */}
            <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
          </svg>
        </button>

        {showCreateRide && (
          <CreateRideWindow onClose={() => setShowCreateRide(false)} onRideCreated={fetchRides} />)
        }
        {showProfile && <ProfileWindow onClose={() => setShowProfile(false)} />}
      </nav>
      <main className="main-content">
        <div className="search-bar-container">
          <SearchBar />
        </div>

        <div className="ride-grid">
          {rides.map((ride) => (
            <RidePreviewCard key={ride._id} ride={ride} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;