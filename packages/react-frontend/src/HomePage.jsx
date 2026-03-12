import { useState, useEffect } from 'react';
import AppNavbar from './AppNavbar';
import AppMainContent from './AppMainContent';
import CreateRideWindow from './CreateRideWindow';
import useSignOut from './utils/signOut';
import fetchRides from './utils/useRides';
import { useNavigate, useParams } from 'react-router-dom';
import RideDetailsWindow from './RideDetailsWindow';

function HomePage() {
  const navigate = useNavigate();
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [rides, setRides] = useState([]);
  const signOut = useSignOut();
  let params = useParams();
  const selectedRide = params.rideId
    ? rides.find((r) => r._id === params.rideId)
    : null;

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
      <AppMainContent rides={rides} onRideUpdated={loadRides} />

      {selectedRide && (
        <RideDetailsWindow
          ride={selectedRide}
          onClose={() => navigate('/home')}
          onRideUpdated={loadRides}
        />
      )}
    </div>
  );
}

export default HomePage;
