import './MyRidesDetails.css';
import { useState, useEffect } from 'react';
import fetchUser from './utils/fetchUser';
import ReviewDriver from './ReviewDriver.jsx';
import EditRideWindow from './EditRideWindow.jsx';
import { API_URL } from './constants/api';
import {
  CalendarIcon,
  ClockIcon,
  SeatIcon,
  PersonIcon,
  CarIcon,
} from './imagesAndIcons/RideIcons.jsx';

function MyRidesDetails({ ride, isDriver, onRideUpdated }) {
  const [showEditRide, setShowEditRide] = useState(false);
  const [showReviewDriver, setShowReviewDriver] = useState(false);

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this ride?')) {
      fetch(`${API_URL}/api/rides/${ride._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then((res) => {
          if (res.ok) {
            onRideUpdated();
          } else {
            console.error('Failed to delete ride');
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this ride?')) {
      fetch(`${API_URL}/api/rides/${ride._id}/leave`, {
        method: 'POST',
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to leave ride: ${res.status}`);
          }
          return res.json();
        })
        .then(() => {
          onRideUpdated();
        })
        .catch((err) => console.error(err));
    }
  };

  const handleComplete = () => {
    if (
      window.confirm('Are you sure you want to mark this ride as completed?')
    ) {
      // Add this ride to previous_rides for everyone on the ride.
      const riderIds = [
        ...new Set(
          [ride.driver, ...(ride.other_riders ?? [])].map((rider) => rider._id),
        ),
      ];
      // Update each rider's previous_rides list with the completed ride
      riderIds.forEach((riderId) => {
        fetch(`${API_URL}/api/users/${riderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ previous_rides: ride._id }),
        }).then(() => {
          onRideUpdated();
        });
      });
      // Mark the ride as completed
      fetch(`${API_URL}/api/rides/${ride._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_completed: true }),
      }).catch((err) => console.error(err));
    }
  };

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

  const passengerNames = Array.isArray(ride.other_riders)
    ? ride.other_riders
        .map((rider) => rider.name || '')
        .filter(Boolean)
    : [];

  const waitlistNames = Array.isArray(ride.waitlist_riders)
    ? ride.waitlist_riders
        .map((rider) => rider.name || '')
        .filter(Boolean)
    : [];

  const totalSeats = ride.seats ?? 0;
  const takenSeats = passengerNames.length;
  const remainingSeats = Math.max(totalSeats - takenSeats, 0);

  const previousRides = user?.previous_rides?.includes(ride._id) ? [ride] : [];

  return (
    <div className="ride-details-card">
      <div className="rd-header">
        <h2 className="rd-title">
          {driverName}&rsquo;s Ride to {ride.destination || 'N/A'}
        </h2>
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
            <CarIcon />
            <span>{ride.car}</span>
          </div>
        </div>

        <div className="rd-subtitle-row">
          <h4 className="rd-subtitle">Passengers:</h4>
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
            Waitlist: {waitlistNames.length > 0 ? waitlistNames.join(', ') : 'None'}
          </span>
        </div>

        {ride.description && (
          <div className="rd-description">
            <span className="rd-desc-label">Description:&nbsp;</span>
            {ride.description}
          </div>
        )}

        <div className="rd-action-row">
          {isDriver && !previousRides.includes(ride) && (
            <button
              className="edit-ride-button"
              onClick={() => setShowEditRide(true)}
            >
              Edit
            </button>
          )}

          {showEditRide && (
            <EditRideWindow
              ride={ride}
              onClose={() => setShowEditRide(false)}
              onRideEdited={onRideUpdated}
            />
          )}

          {isDriver && !previousRides.includes(ride) && (
            <button className="delete-ride-button" onClick={handleDelete}>
              Delete Ride
            </button>
          )}

          {isDriver && !previousRides.includes(ride) && (
            <button className="ride-completed-button" onClick={handleComplete}>
              Mark as Completed
            </button>
          )}

          {!isDriver && !previousRides.includes(ride) && (
            <button className="cancel-ride-button" onClick={handleCancel}>
              Cancel Ride
            </button>
          )}

          {!isDriver && previousRides.includes(ride) && (
            <button
              className="review-driver-button"
              onClick={() => setShowReviewDriver(true)}
            >
              Review Driver
            </button>
          )}

          {showReviewDriver && (
            <ReviewDriver
              ride={ride}
              onClose={() => setShowReviewDriver(false)}
              onRideEdited={onRideUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MyRidesDetails;
