import './App.css';
import PolyPoolLogo from './imagesAndIcons/PolyPoolLogo.png';
import PolyPoolIcon from './imagesAndIcons/PolyPoolIcon.png';
import PlusIcon from './imagesAndIcons/PlusIcon.png';
import { useState } from 'react';
import CreateRideWindow from './CreateRideWindow';
import SearchBar from './SearchBar.jsx';

function App() {
  const [showCreateRide, setShowCreateRide] = useState(false);

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
        <SearchBar />
      </main>
    </div>
  );
}

export default App;
