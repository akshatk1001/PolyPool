import { useState } from 'react';
import AppNavbar from './AppNavbar';
import CreateRideWindow from './CreateRideWindow';
import useSignOut from './utils/signOut';

function ProfilePage(user) {
  const [showCreateRide, setShowCreateRide] = useState(false);
  const signOut = useSignOut();

  return (
    <div className="profile-page">
      <AppNavbar
        onCreateRideClick={() => setShowCreateRide(true)}
        onProfileClick={() => {}}
        onSignOutClick={signOut}
      >
        {showCreateRide && (
          <CreateRideWindow
            onClose={() => setShowCreateRide(false)}
            onRideCreated={() => {}}
          />
        )}
      </AppNavbar>
      <div className='profile-content'>
        <img src={user.profile_pic} alt="Profile" className="profile-pic-large" />
        <h1>{user.name}</h1>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone Number:</strong> {user.phone_num}</p>
        <p><strong>Grade:</strong> {user.grade}</p>
        <p><strong>Major:</strong> {user.major}</p>
        <p><strong>Rating:</strong> {user.rating}</p>
        <p><strong>Rides Given:</strong> {user.rides_given}</p>
        <p><strong>Rides Taken:</strong> {user.rides_taken}</p>
      </div>
    </div>
  );
}

export default ProfilePage;
