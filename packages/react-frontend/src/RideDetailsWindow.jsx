import { useEffect, useState } from 'react';
import './RideDetailsWindow.css';
import fetchUser from './utils/fetchUser.jsx';
import { API_URL } from './constants/api';
import {
  CalendarIcon,
  ClockIcon,
  SeatIcon,
  PersonIcon,
  CarIcon,
  WavyIcon,
} from './imagesAndIcons/RideIcons';
import ProfilePic from './imagesAndIcons/ProfilePic.png';
import { useNavigate } from 'react-router-dom';

function RideDetailsWindow({ ride, onClose, onRideUpdated }) {
  const [user, setUser] = useState(undefined);
  const [isRequesting, setIsRequesting] = useState(false); // if the user has clicked to request ride
  const [requestSuccess, setRequestSuccess] = useState(false);
  const navigate = useNavigate();
  const [newWaypoint, setNewWaypoint] = useState('');

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const passengerNames = Array.isArray(ride.other_riders)
    ? ride.other_riders.map((otherRider) => otherRider.name || '')
    : [];

  const totalSeats = ride.seats;
  const takenSeats = passengerNames.length;
  const remainingSeats = Math.max(totalSeats - takenSeats, 0);
  // Check if the current user is already a passenger in this ride
  const isCurrentUserPassenger = Array.isArray(ride.other_riders)
    ? ride.other_riders.some((rider) => rider._id === user?._id) ||
      user?._id === ride.driver._id
    : false;

  // Call updateUserAPI to add this user to the drivers requested rides
  async function createRequest() {
    // don't allow req if its full or user is alr in requesting state or user is already a passenger
    if (remainingSeats === 0 || isRequesting || isCurrentUserPassenger) {
      return;
    }

    if (!user?._id) {
      console.error('No user found.');
      return;
    }

    try {
      setIsRequesting(true);
      setRequestSuccess(false);

      // update ride to list this user as passenger
      console.log('Requesting ride with ID:', ride._id);
      const baseWaypoints = Array.isArray(ride.waypoints) ? ride.waypoints : [];
      let newWaypoints = [...baseWaypoints];
      if (
        newWaypoint.trim() !== ride.destination &&
        !baseWaypoints.includes(newWaypoint.trim())
      ) {
        newWaypoints = [...baseWaypoints, newWaypoint.trim()];
      }

      const rideResponse = await fetch(`${API_URL}/api/rides/${ride._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ other_rider: user._id , waypoints: newWaypoints }),
        credentials: 'include',
      });

      if (!rideResponse.ok) {
        console.error('Failed to add passenger to ride:', rideResponse.status);
        return;
      }

      // update user list to add this ride as a ride the user is a passenger in
      console.log('Updating user to be as a passenger in their profile');
      const userResponse = await fetch(`${API_URL}/api/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rides_as_passenger: ride._id }),
        credentials: 'include',
      });

      if (!userResponse.ok) {
        console.error('Failed to add ride to user:', userResponse.status);
        return;
      }

      setRequestSuccess(true);
      onRideUpdated();
    } catch (err) {
      console.error('Error requesting ride:', err);
    } finally {
      setIsRequesting(false);
    }
  }

  const driverName = ride.driver?.name || 'Unknown';

  const startDate = ride.start_time
    ? new Date(ride.start_time).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      })
    : 'N/A';

  const startTime = ride.start_time
    ? new Date(ride.start_time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="ride-details-window" onClick={onClose}>
      <div className="ride-details-card" onClick={(e) => e.stopPropagation()}>
        <div className="rd-header">
          <h2 className="rd-title">
            <button
              className="profile-pic-btn"
              onClick={() => navigate(`/profile/${ride.driver._id}`)}
            >
              {' '}
              <img
                src={ride.driver?.profile_pic || ProfilePic}
                alt="Driver Profile"
                className="profile-pic-small"
              />
            </button>
            {driverName}&rsquo;s Ride to {ride.destination || 'N/A'}
          </h2>
          <span className="rd-close" onClick={onClose}>
            &#x2715;
          </span>
        </div>

        <div className="rd-body">
          <div className="rd-subtitle-row">
            <h3 className="rd-subtitle">Ride Details</h3>
            <span className="rd-price">${ride.cost ?? 0}</span>
          </div>

          <div className="rd-info-grid">
            <div className="rd-info-item">
              <span className="rd-desc-label">From:&nbsp;</span>
              {ride.starting_point || 'N/A'}
            </div>
            <div className="rd-info-item">
              <span className="rd-desc-label">To:&nbsp;</span>
              {ride.destination || 'N/A'}
            </div>
          </div>

          <div className="rd-info-grid">
            <div className="rd-info-item">
              <CalendarIcon />
              <span>Date: {startDate}</span>
            </div>
            <div className="rd-info-item">
              <ClockIcon />
              <span>Time: {startTime}</span>
            </div>

            <div className="rd-info-item">
              <SeatIcon />
              <span>
                Remaining available Seats: {remainingSeats}/{totalSeats}
              </span>
            </div>
            <div className="rd-info-item">
              <PersonIcon />
              <span>
                Passengers:{' '}
                {passengerNames.length > 0 ? passengerNames.join(', ') : 'None'}
              </span>
            </div>

            {ride.car && (
              <div className="rd-info-item">
                <CarIcon />
                <span>{ride.car}</span>
              </div>
            )}

            {ride.car && (
              <div className="rd-info-item">
                <WavyIcon />
                <span>
                  Willing to stop along the way? {ride.deviation ? 'Yes' : 'No'}
                </span>
              </div>
            )}
          </div>

          {ride.description && (
            <div className="rd-description">
              <span className="rd-desc-label">Description:&nbsp;</span>
              {ride.description}
            </div>
          )}

          <div className="rd-action-row">
            <label htmlFor="rd-info-item"> Where would you like to be dropped off? </label>
              <input
                type="text"
                name="waypoint"
                id="waypoint"
                value={newWaypoint}
                onChange={(e) => setNewWaypoint(e.target.value)}
              />
            <button
              className="rd-request-btn"
              disabled={
                !user ||
                remainingSeats === 0 ||
                isRequesting ||
                isCurrentUserPassenger
              }
              onClick={() => createRequest()}
            >
              {isCurrentUserPassenger || requestSuccess
                ? 'Already In Ride'
                : isRequesting
                  ? 'Requesting...'
                  : 'Request Ride'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RideDetailsWindow;
