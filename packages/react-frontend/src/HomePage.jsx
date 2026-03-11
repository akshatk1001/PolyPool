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
  const [selectedRide, setSelectedRide] = useState(null);
  const signOut = useSignOut();
  let params = useParams();

  function loadRides() {
    fetchRides().then(setRides).catch(console.error);
  }

  useEffect(() => {
    loadRides();
  }, []);

  useEffect(() => {
    if (params.rideId) {
      const ride = rides.find(r => r._id === params.rideId);
      setSelectedRide(ride);
    } else {
      setSelectedRide(null);
    }
  }, [rides, params.rideId]);

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
          ride = {selectedRide} 
          onClose= {() => navigate('/home')}
          onRideUpdated={loadRides}
        />
      )}
    </div>
  );
}

export default HomePage;
