import './RidePreviewCard.css';
import ProfilePic from './imagesAndIcons/ProfilePic.png';
import Star from './imagesAndIcons/Star.png';
import { useState } from 'react';

function RidePreviewCard({ ride }) {
  const formattedDate = new Date(ride.start_time).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <button className="ride-preview">
      <div className="ride-left">
        <img
          src={ride.driver?.profile_pic || ProfilePic}
          alt="driver"
          className="profile-pic"
        />
      </div>

      <div className="ride-right">
        <div className="ride-top">
          <div>
            <h2 className="destination">{ride.destination}</h2>
            <div className="driver-name">{ride.driver?.name || 'Driver'}</div>
            <div className="rating">Rating: {ride.driver?.rating || 0}</div>
            <img src={Star} alt="star" className="star-icon" />
          </div>

          <div className="price">${ride.cost}</div>
        </div>

        <div className="ride-details">
          <div>
            <strong>Date/Time:</strong> {formattedDate}
          </div>
          <div>
            <strong>Number of Seats:</strong> {ride.seats}
          </div>
        </div>
      </div>
    </button>
  );
}

export default RidePreviewCard;
