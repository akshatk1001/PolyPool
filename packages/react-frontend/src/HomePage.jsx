import { useState, useEffect } from 'react';
import AppNavbar from './AppNavbar';
import AppMainContent from './AppMainContent';
import CreateRideWindow from './CreateRideWindow';
import useSignOut from './utils/signOut';
import fetchRides from './utils/useRides';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [rides, setRides] = useState([]);
  const signOut = useSignOut();

  function loadRides() {
    fetchRides().then(setRides).catch(console.error);
  }

  useEffect(() => {
    loadRides();
  }, []);

  return (
    <div className="app">
      <AppNavbar
        onCreateRideClick={() => setShowCreateRide(true)}
        onProfileClick={() => navigate('/profile')}
        onMyRidesClick={() => navigate('/my-rides')}
        onSignOutClick={signOut}
      >
        {showCreateRide && (
          <CreateRideWindow
            onClose={() => setShowCreateRide(false)}
            onRideCreated={loadRides}
          />
        )}
      </AppNavbar>
      <AppMainContent rides={rides} />
    </div>
  );
}

export default HomePage;
