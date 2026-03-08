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

function RideDetailsWindow({ ride, onClose }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const passengerNames = Array.isArray(ride.other_riders)
    ? ride.other_riders
        .map((other_rider) => {
          if (typeof other_rider === 'object' && other_rider !== null)
            return other_rider.name || '';
        })
    : [];

  const totalSeats = ride.seats;
  const takenSeats = passengerNames.length;
  const remainingSeats = Math.max(totalSeats - takenSeats, 0);

  // Call updateUserAPI to add this user to the drivers requested rides
  async function createRequest() {
    if (remainingSeats === 0) {
      return;
    }

    if (!user?._id) {
      console.error('No user found.');
      return;
    }

    try {
      // update ride to list this user as passenger
      console.log('Requesting ride with ID:', ride._id);
      const rideResponse = await fetch(`${API_URL}/api/rides/${ride._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ other_rider: user._id }),
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

      onClose();
    } catch (err) {
      console.error('Error requesting ride:', err);
    }
  }

  const driverName =
    typeof ride.driver === 'object' && ride.driver !== null
      ? ride.driver.name || 'Unknown'
      : typeof ride.driver === 'string' && !/^[a-f\d]{24}$/i.test(ride.driver)
        ? ride.driver
        : 'Unknown';

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
                <span>Max Deviation: {ride.deviation ?? 0} minutes</span>
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
            <button
              className="rd-request-btn"
              disabled={!user || remainingSeats === 0}
              onClick={() => createRequest()}
            >
              Request Ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RideDetailsWindow;
