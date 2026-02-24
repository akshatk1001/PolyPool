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
            Rating: {ride.driver?.rating || 0}{' '}
            <img className="star-icon" src={Star} alt="star" />
          </span>
        </div>
      </div>

      <div className="ride-meta">
        <div className="price">${ride.cost}</div>
        <div className="time">
          <strong>Date/Time:</strong> {formattedDate}
        </div>
        <div className="seats">
          <strong>Seats:</strong> {ride.seats}
        </div>
      </div>
    </button>
  );
}

export default RidePreviewCard;
