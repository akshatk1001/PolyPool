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
    fetchUser()
      .then(setUser)
      .catch(() => setUser(null));
    loadRides();
  }, []);
  const signOut = useSignOut();

  // all rides where the users ID is listed as the driver
  const driverRides = rides.filter((ride) => ride.driver?._id === user?._id);
  // all rides where the users ID is lisetd as a passenger
  const passengerRides = rides.filter((ride) =>
    Array.isArray(ride.other_riders)
      ? ride.other_riders.some((rider) => rider._id === user?._id)
      : false,
  );
  // all rides where the users ID is listed as a previous ride
  const previousRides = rides.filter((ride) =>
    Array.isArray(user?.previous_rides)
      ? user.previous_rides.some((prevRideId) => prevRideId === ride._id)
      : false,
  );

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
        <h2 className="section-header">As Driver</h2>
        {driverRides.length > 0 ? (
          driverRides.map((ride) => (
            <MyRidesDetails
              key={ride._id}
              ride={ride}
              isDriver={true}
              onRideUpdated={loadRides}
            />
          ))
        ) : (
          <p>No rides found matching your search.</p>
        )}
      </div>
      <div className="rides-list">
        <h2 className="section-header">As Passenger</h2>
        {passengerRides.length > 0 ? (
          passengerRides.map((ride) => (
            <MyRidesDetails
              key={ride._id}
              ride={ride}
              isDriver={false}
              onRideUpdated={loadRides}
            />
          ))
        ) : (
          <p>No rides found matching your search.</p>
        )}
      </div>

      <div className="rides-list">
        <h2 className="section-header">Previous Rides</h2>
        {previousRides.length > 0 ? (
          previousRides.map((ride) => (
            <MyRidesDetails
              key={ride._id}
              ride={ride}
              isDriver={false}
              onRideUpdated={loadRides}
            />
          ))
        ) : (
          <p>No Previous Rides.</p>
        )}
      </div>
    </div>
  );
}

export default MyRidesPage;
