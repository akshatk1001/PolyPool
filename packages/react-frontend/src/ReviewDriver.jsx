import { useState } from 'react';
import './CreateRideWindow.css';
import { API_URL } from './constants/api';
import { FaStar } from 'react-icons/fa';

function ReviewDriver({ onClose, ride }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const colors = {
    orange: '#FFBA5A', // Color for filled stars
    grey: '#a9a9a9', // Color for empty stars
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleMouseEnter = (value) => {
    setHover(value);
  };

  const handleMouseLeave = () => {
    setHover(rating);
  };

  function review(selectedRating) {
    const promise = fetch(`${API_URL}/api/users/${ride.driver._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ratings: selectedRating }),
    });
    return promise;
  }

  async function submitForm(event) {
    event.preventDefault();

    try {
      const response = await review(rating);
      if (response.status === 200) {
        const review = await response.json();
        console.log('Review Posted Successfully', response.status, review);
        onClose();
      } else {
        console.log('Server response error:', response.status);
      }
    } catch (error) {
      console.log('Request completely failed:', error);
    }
  }

  const driverName = ride.driver.name.split(' ')[0];
  return (
    <div className="create-ride-window">
      <div className="create-ride-card">
        <div className="create-ride-header">
          <h2>Rate {driverName}</h2>
          <span className="modal-close-btn" onClick={onClose}>
            ×
          </span>
        </div>

        <form className="create-ride-form">
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <FaStar
                key={value}
                size={50}
                onClick={() => handleRatingClick(value)}
                onMouseOver={() => handleMouseEnter(value)}
                onMouseLeave={handleMouseLeave}
                color={(hover || rating) >= value ? colors.orange : colors.grey}
                style={{ cursor: 'pointer' }}
              />
            ))}
            <p>
              Rate {driverName}: {rating} stars
            </p>
          </div>

          <button className="create-button" onClick={submitForm}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
export default ReviewDriver;
