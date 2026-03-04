import { useState } from 'react';
import AppNavbar from './AppNavbar';
import AppMainContent from './AppMainContent';
import CreateRideWindow from './CreateRideWindow';
import ProfilePage from './ProfilePage';
import useSignOut from './utils/signOut';
import useRides from './hooks/useRides';
import { useNavigate } from 'react-router-dom';

function MyRidesPage(user) {
  const navigate = useNavigate();
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { rides, fetchRides } = useRides();
  const signOut = useSignOut();

  return (
    <div className="app">
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
        {rides.length > 0 ? (
             rides.map((ride) => <RidePreviewCard key={ride._id} ride={ride} />)
           ) : (
             <p>No rides found matching your search.</p>
           )}
      </div>
      <div className="rides-list">
        <h2>As Passenger</h2>
        {rides.length > 0 ? (
             rides.map((ride) => <RidePreviewCard key={ride._id} ride={ride} />)
           ) : (
             <p>No rides found matching your search.</p>
           )}
      </div>
    </div>
  );
}

export default MyRidesPage;