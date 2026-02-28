import './App.css';
import { useState } from 'react';
import CreateRideWindow from './CreateRideWindow';
import ProfileWindow from './ProfileWindow';
import AppNavbar from './AppNavbar';
import AppMainContent from './AppMainContent';
import useRides from './hooks/useRides';

function App() {
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { rides, fetchRides } = useRides();

  return (
    <div className="app">
      <AppNavbar
        onCreateRideClick={() => setShowCreateRide(true)}
        onProfileClick={() => setShowProfile(true)}
      >
        {showCreateRide && (
          <CreateRideWindow
            onClose={() => setShowCreateRide(false)}
            onRideCreated={fetchRides}
          />
        )}
        {showProfile && <ProfileWindow onClose={() => setShowProfile(false)} />}
      </AppNavbar>
      <AppMainContent rides={rides} />
    </div>
  );
}

export default App;
