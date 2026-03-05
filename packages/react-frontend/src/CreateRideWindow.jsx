import React, { useState, useEffect } from 'react';
import './CreateRideWindow.css';
import useFetchUser from './utils/fetchUser';

function CreateRideWindow({ onClose, onRideCreated }) {
  const user = useFetchUser();

  useEffect(() => {
    if (user === null) {
      console.error('User is not signed in');
    }
  }, [user]);

  const [ride, setRide] = useState({
    starting_point: '',
    destination: '',
    start_date: '',
    start_time: '',
    driver: user?._id,
    other_riders: [],
    cost: 0,
    car: '',
    seats: 0,
    deviation: 0,
    description: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setRide({
      ...ride,
      [name]: value,
    });
  }

  // Prevent scroll from changing number inputs
  function handleWheel(event) {
    event.target.blur();
  }

  function postRide(rideData) {
    const promise = fetch('http://localhost:8000/api/rides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rideData),
    });
    return promise;
  }

  async function submitForm(event) {
    event.preventDefault();
    const datetime = new Date(`${ride.start_date}T${ride.start_time}`);

    if (!user) {
      console.error('No user found. Cannot create ride without a driver.');
      return;
    }

    const rideData = {
      starting_point: ride.starting_point,
      destination: ride.destination,
      start_time: datetime,
      driver: user._id,
      other_riders: ride.other_riders,
      cost: ride.cost,
      car: ride.car,
      seats: ride.seats,
      deviation: ride.deviation,
      description: ride.description,
    };

    try {
      const promise = await postRide(rideData);
      if (promise.status === 201) {
        // TODO: Show success message
        console.log('Ride created successfully', promise.status);
        onClose();
        onRideCreated();
      } else {
        // TODO: Show error message
        console.log('Server response error:', promise.status);
      }
    } catch (error) {
      console.log('Request completely failed:', error);
    }

    // reset ride to default values
    setRide({
      starting_point: 'California Polytechnic University San Luis Obispo',
      destination: '',
      start_date: '',
      start_time: '',
      driver: user._id,
      other_riders: [],
      cost: 0,
      car: '',
      seats: 0,
      deviation: 0,
      description: '',
    });
  }

  return (
    <div className="create-ride-window">
      <div className="create-ride-card">
        <div className="create-ride-header">
          <h2>Create Ride</h2>
          <span className="modal-close-btn" onClick={onClose}>
            ×
          </span>
        </div>

        <form className="create-ride-form">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="starting_point">Start Location</label>
              <input
                type="text"
                placeholder="Cal Poly"
                name="starting_point"
                id="starting_point"
                value={ride.starting_point}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="destination">Destination</label>
              <input
                type="text"
                placeholder="San Francisco"
                name="destination"
                id="destination"
                value={ride.destination}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="start_date">Start Date</label>
              <input
                type="date"
                name="start_date"
                id="start_date"
                value={ride.start_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="start_time">Start Time</label>
              <input
                type="time"
                name="start_time"
                id="start_time"
                value={ride.start_time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field full-width">
            <label htmlFor="cost">Cost per Seat</label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <input
                className="full-width"
                type="number"
                placeholder="0"
                name="cost"
                id="cost"
                value={ride.cost}
                onChange={handleChange}
                onWheel={handleWheel}
              />
            </div>
          </div>

          <div className="form-field full-width">
            <label htmlFor="seats">Number of Seats</label>
            <input
              className="full-width"
              type="number"
              placeholder="Number of seats"
              name="seats"
              id="seats"
              value={ride.seats}
              onChange={handleChange}
              onWheel={handleWheel}
            />
          </div>

          <div className="form-field full-width">
            <label htmlFor="deviation">Max Deviation Time (minutes)</label>
            <input
              className="full-width"
              type="number"
              placeholder="Max Deviation Time (minutes)"
              name="deviation"
              id="deviation"
              value={ride.deviation}
              onChange={handleChange}
              onWheel={handleWheel}
            />
          </div>

          <div className="form-field full-width">
            <label htmlFor="car">Car Model</label>
            <input
              className="full-width"
              type="text"
              placeholder="Car Model"
              name="car"
              id="car"
              value={ride.car}
              onChange={handleChange}
            />
          </div>

          <div className="form-field full-width">
            <label htmlFor="description">Ride Description</label>
            <textarea
              className="full-width"
              placeholder="Ride Description"
              rows="4"
              name="description"
              id="description"
              value={ride.description}
              onChange={handleChange}
            />
          </div>

          <button className="create-button" onClick={submitForm}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRideWindow;
