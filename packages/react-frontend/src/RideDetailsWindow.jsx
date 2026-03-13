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
  const [joinStatus, setJoinStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const passengerNames = Array.isArray(ride.other_riders)
    ? ride.other_riders.map((otherRider) => otherRider.name || '')
    : [];

  const waitlistNames = Array.isArray(ride.waitlist_riders)
    ? ride.waitlist_riders.map((waitlistedRider) => waitlistedRider.name || '')
    : [];

  const totalSeats = ride.seats;
  const takenSeats = passengerNames.length;
  const remainingSeats = Math.max(totalSeats - takenSeats, 0); //extra safety check for race conditions or bad data
  const isCurrentUserPassenger = Array.isArray(ride.other_riders)
    ? ride.other_riders.some((rider) => rider._id === user?._id) || user?._id === ride.driver._id
    : false;

  // Call updateUserAPI to add this user to the drivers requested rides
  async function createRequest() {
    if (isRequesting || isCurrentUserPassenger || isCurrentUserWaitlisted) {
      return;
    }

    if (!user?._id) {
      console.error('No user found.');
      return;
    }

    try {
      setIsRequesting(true);
      setJoinStatus(null);

      const rideResponse = await fetch(`${API_URL}/api/rides/${ride._id}/join`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!rideResponse.ok) {
        console.error('Failed to join ride:', rideResponse.status);
        return;
      }

      const responsePayload = await rideResponse.json();
      setJoinStatus(responsePayload.status || 'joined');
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

            <div className="rd-info-item">
              <PersonIcon />
              <span>
                Waitlist:{' '}
                {waitlistNames.length > 0 ? waitlistNames.join(', ') : 'None'}
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
              disabled={
                !user ||
                remainingSeats === 0 ||
                isRequesting ||
                isCurrentUserPassenger
              }
              onClick={() => createRequest()}
            >
              {isCurrentUserPassenger
                ? 'Joined Ride'
                : isCurrentUserWaitlisted
                  ? 'On Waitlist'
                  : joinStatus === 'waitlisted'
                    ? 'On Waitlist'
                    : joinStatus === 'joined'
                      ? 'Joined Ride'
                : isRequesting
                  ? 'Joining...'
                  : remainingSeats > 0
                    ? 'Join Ride'
                    : 'Join Waitlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RideDetailsWindow;
