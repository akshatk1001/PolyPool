import { useState, useEffect } from 'react';
import AppNavbar from './AppNavbar';
import CreateRideWindow from './CreateRideWindow';
import useSignOut from './utils/signOut';
import fetchRides from './utils/useRides';
import fetchUser from './utils/fetchUser';
import { useNavigate } from 'react-router-dom';
import RidePreviewCard from './RidePreviewCard';


function MyRidesPage() {
  const navigate = useNavigate();
  const user  = fetchUser();
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [rides, setRides] = useState([]);
  const signOut = useSignOut();

  function loadRides() {
    fetchRides().then(setRides).catch(console.error);
  }

  useEffect(() => {
    loadRides();
  }, []);

  const driverRides = rides.filter(ride => user?.rides_as_driver?.includes(ride._id));
  const passengerRides = rides.filter(ride => user?.rides_as_passenger?.includes(ride._id));

  return (
    <div className="my-rides-page">
      <AppNavbar
        onCreateRideClick={() => setShowCreateRide(true)}
        onProfileClick={() => navigate('/profile')}
        onSignOutClick={signOut}
      >
        {showCreateRide && (
          <CreateRideWindow
            onClose={() => setShowCreateRide(false)}
            onRideCreated={loadRides}
          />
        )}
      </AppNavbar>
      <div className="rides-list">
        <h2>As Driver</h2>
        {driverRides.length > 0 ? (
          driverRides.map((ride) => 
          <RidePreviewCard key={ride._id} ride={ride} />)
           ) : (
             <p>No rides found matching your search.</p>
           )}
      </div>
      <div className="rides-list">
        <h2>As Passenger</h2>
        {passengerRides.length > 0 ? (
          passengerRides.map((ride) => 
          <RidePreviewCard key={ride._id} ride={ride} />)
           ) : (
             <p>No rides found matching your search.</p>
           )}
      </div>
    </div>
  );
}

export default MyRidesPage;