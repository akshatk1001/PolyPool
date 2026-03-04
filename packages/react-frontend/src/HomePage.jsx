import { useState } from 'react';
import AppNavbar from './AppNavbar';
import AppMainContent from './AppMainContent';
import CreateRideWindow from './CreateRideWindow';
import useSignOut from './utils/signOut';
import useRides from './hooks/useRides';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [showCreateRide, setShowCreateRide] = useState(false);
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
        {showProfile && <ProfilePage onClose={() => setShowProfile(false)} />}
      </AppNavbar>
      <AppMainContent rides={rides} />
    </div>
  );
}

export default HomePage;
