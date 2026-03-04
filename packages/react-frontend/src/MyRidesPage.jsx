import { useState } from 'react';
import AppNavbar from './AppNavbar';
import AppMainContent from './AppMainContent';
import CreateRideWindow from './CreateRideWindow';
import useSignOut from './utils/signOut';
import useRides from './hooks/useRides';
import useAuth from './hooks/useAuth';
import { useNavigate } from 'react-router-dom';


function MyRidesPage() {
  const navigate = useNavigate();
  const { currentUser: user } = useAuth();
  const [showCreateRide, setShowCreateRide] = useState(false);
  const { rides, fetchRides } = useRides();
  const signOut = useSignOut();

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
            onRideCreated={fetchRides}
          />
        )}
      </AppNavbar>
      <div className="rides-list">
        <h2>As Driver</h2>
        {user.rides_as_driver.length > 0 ? (
          user.rides_as_driver.map((rideId) => 
          <RidePreviewCard key={rideId} ride={rides.find((r) => r._id === rideId)} />)
           ) : (
             <p>No rides found matching your search.</p>
           )}
      </div>
      <div className="rides-list">
        <h2>As Passenger</h2>
        {user.rides_as_rider.length > 0 ? (
          user.rides_as_rider.map((rideId) => 
          <RidePreviewCard key={rideId} ride={rides.find((r) => r._id === rideId)} />)
           ) : (
             <p>No rides found matching your search.</p>
           )}
      </div>
    </div>
  );
}

export default MyRidesPage;