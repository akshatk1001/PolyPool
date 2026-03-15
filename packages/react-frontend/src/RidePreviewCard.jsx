import './RidePreviewCard.css';
import ProfilePic from './imagesAndIcons/ProfilePic.png';
import Star from './imagesAndIcons/star.png';
import { useNavigate } from 'react-router-dom';

function RidePreviewCard({ ride }) {
  const navigate = useNavigate();

  // get average rating for driver
  const driverRating =
    Array.isArray(ride.driver?.ratings) && ride.driver.ratings.length > 0
      ? (
          ride.driver.ratings.reduce((sum, rating) => sum + rating, 0) /
          ride.driver.ratings.length
        ).toFixed(1)
      : 'No Ratings';

  const formattedDate = new Date(ride.start_time).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const passengerNames = Array.isArray(ride.other_riders)
    ? ride.other_riders.map((otherRider) => otherRider.name || '')
    : [];

  const totalSeats = ride.seats;
  const takenSeats = passengerNames.length;
  const remainingSeats = Math.max(totalSeats - takenSeats, 0);

  return (
    <>
      <button
        className="ride-preview"
        onClick={() => navigate(`/home/${ride._id}`)}
      >
        {' '}
        <img
          src={ride.driver?.profile_pic || ProfilePic}
          alt="driver"
          className="profile-pic"
        />
        <div className="ride-info">
          <h2 className="destination">{ride.destination}</h2>
          <div className="driver-row">
            <span className="driver-name">{ride.driver?.name || 'Driver'}</span>
            <span className="rating">
              Rating: {driverRating}{' '}
              <img className="star-icon" src={Star} alt="star" />
            </span>
          </div>
          <div className="ride-details">
            <div className="time">
              <strong>Date/Time:</strong> {formattedDate}
            </div>
            <div className="seats">
              <strong>Seats Remaining: </strong>
              {remainingSeats}/{totalSeats}
            </div>
          </div>
        </div>
        <div className="ride-meta">
          <div className="price">${ride.cost}</div>
        </div>
      </button>
      
      {showRideDetails && (
        <RideDetailsWindow
          ride={ride}
          onClose={() => setShowRideDetails(false)}
          onRideUpdated={onRideUpdated}
        />
      )}
    </>
  );
}

export default RidePreviewCard;
