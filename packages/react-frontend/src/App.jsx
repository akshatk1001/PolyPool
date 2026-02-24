import './App.css';
import PolyPoolLogo from './imagesAndIcons/PolyPoolLogo.png';
import PolyPoolIcon from './imagesAndIcons/PolyPoolIcon.png';
import PlusIcon from './imagesAndIcons/PlusIcon.png';
import { useState, useEffect } from 'react';
import CreateRideWindow from './CreateRideWindow';
import SearchBar from './SearchBar.jsx';
import RidePreviewCard from './RidePreviewCard.jsx';

function App() {
  const [showCreateRide, setShowCreateRide] = useState(false);
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
        {showCreateRide && (
          <CreateRideWindow onClose={() => setShowCreateRide(false)} />
        )}
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
