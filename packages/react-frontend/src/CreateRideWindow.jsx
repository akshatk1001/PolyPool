import React, { useState } from 'react';
import './CreateRideWindow.css';

function CreateRideWindow({ onClose }) {
  const [ride, setRide] = useState({
    starting_point: '',
    destination: '',
    start_date: '',
    start_time: '',
    driver: '',
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

  // TODO: Change this to just be handleSubmit which makes a API call
  function submitForm(event) {
    event.preventDefault();

    // Combine date and time into a single datetime
    const datetime = new Date(`${ride.start_date}T${ride.start_time}`);

    const rideData = {
      starting_point: ride.starting_point,
      destination: ride.destination,
      start_time: datetime,
      driver: ride.driver,
      other_riders: ride.other_riders,
      cost: ride.cost,
      car: ride.car,
      seats: ride.seats,
      deviation: ride.deviation,
      description: ride.description,
    };

    console.log(rideData);

    // props.handleSubmit(rideData);

    setRide({
      starting_point: 'California Polytechnic University San Luis Obispo',
      destination: '',
      start_date: '',
      start_time: '',
      driver: '',
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
          <span className="close-btn" onClick={onClose}>
            ×
          </span>
        </div>

        <form className="create-ride-form">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="starting_point">Start Location</label>
              <input
                type="text"
                placeholder="Start Location"
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
                placeholder="Destination"
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
            <input
              className="full-width"
              type="number"
              placeholder="Cost per seat"
              name="cost"
              id="cost"
              value={ride.cost}
              onChange={handleChange}
            />
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
