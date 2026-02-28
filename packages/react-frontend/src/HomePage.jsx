import { useState } from 'react';
import AppNavbar from './AppNavbar';
import AppMainContent from './AppMainContent';
import CreateRideWindow from './CreateRideWindow';
import ProfileWindow from './ProfileWindow';
import useSignOut from './utils/signOut';
import useRides from './hooks/useRides';

function HomePage() {
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { rides, fetchRides } = useRides();
  const signOut = useSignOut();

  return (
    <div className="app">
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
      <AppMainContent rides={rides} />
    </div>
  );
}

export default HomePage;
