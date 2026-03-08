import { useState, useEffect } from 'react';
import './MyRidesPage.css';
import AppNavbar from './AppNavbar';
import CreateRideWindow from './CreateRideWindow';
import useSignOut from './utils/signOut';
import fetchRides from './utils/useRides';
import fetchUser from './utils/fetchUser';
import { useNavigate } from 'react-router-dom';
import MyRidesDetails from './MyRidesDetails';


function MyRidesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(undefined);
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [rides, setRides] = useState([]);

  function loadRides() {
    fetchRides().then(setRides).catch(console.error);
  }

  useEffect(() => {
    fetchUser().then(setUser).catch(() => setUser(null));
    loadRides();
  }, []);
  const signOut = useSignOut();

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
          <MyRidesDetails key={ride._id} ride={ride} isDriver={true} onRideUpdated={loadRides} />)
           ) : (
             <p>No rides found matching your search.</p>
           )}
      </div>
      <div className="rides-list">
        <h2>As Passenger</h2>
        {passengerRides.length > 0 ? (
          passengerRides.map((ride) => 
          <MyRidesDetails key={ride._id} ride={ride} isDriver={false} onRideUpdated={loadRides} />)
           ) : (
             <p>No rides found matching your search.</p>
           )}
      </div>
    </div>
  );
}

export default MyRidesPage;