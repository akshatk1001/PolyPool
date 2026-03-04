import { useState } from 'react';
import AppNavbar from './AppNavbar';
import AppMainContent from './AppMainContent';
import CreateRideWindow from './CreateRideWindow';
import ProfileWindow from './ProfileWindow';
import useSignOut from './utils/signOut';
import useRides from './hooks/useRides';

function MyRidesPage(user) {
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { rides, fetchRides } = useRides();
  const signOut = useSignOut();

  return (
    <div className="my-rides-page">
      <AppNavbar
        onCreateRideClick={() => setShowCreateRide(true)}
        onProfileClick={() => setShowProfile(true)}
        onSignOutClick={signOut}
      >
        {showCreateRide && (
          <CreateRideWindow
            onClose={() => setShowCreateRide(false)}
            onRideCreated={fetchRides}
          />
        )}
        {showProfile && <ProfileWindow onClose={() => setShowProfile(false)} />}
      </AppNavbar>
      <div className='ride-list'
        {rides.length > 0 ? (
            rides.map((ride) => <RidePreviewCard key={ride._id} ride={ride} />)
        ) : (
            <p>No rides found matching your search.</p>
        )}
      />
      </div>
  );
}

export default HomePage;
