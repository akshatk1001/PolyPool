import React, { useState } from 'react';

function RideForm(props) {
  const [ride, setRide] = useState({
    starting_point: 'Cal Poly',
    destination: '',
    start_time: '',
    driver: '',
    other_riders: [],
    cost: 0,
    car: '',
    seats: 0,
    deviation: 0,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setRide({
      ...ride,
      [name]: value,
    });
  }

  function submitForm() {
    props.handleSubmit(ride);
    setRide({
      starting_point: 'Cal Poly',
      destination: '',
      start_time: '',
      driver: '',
      other_riders: [],
      cost: 0,
      car: '',
      seats: 0,
      deviation: 0,
    });
  }

  return (
    <form>
      <label htmlFor="starting_point">Starting Point</label>
      <input
        type="text"
        name="starting_point"
        id="starting_point"
        value={ride.starting_point}
        onChange={handleChange}
      />

      <label htmlFor="destination">Destination</label>
      <input
        type="text"
        name="destination"
        id="destination"
        value={ride.destination}
        onChange={handleChange}
      />

      <label htmlFor="start_time">Start Time</label>
      <input
        type="datetime-local"
        name="start_time"
        id="start_time"
        value={ride.start_time}
        onChange={handleChange}
      />

      <label htmlFor="driver">Driver</label>
      <input
        type="text"
        name="driver"
        id="driver"
        value={ride.driver}
        onChange={handleChange}
      />

      <label htmlFor="other_riders">Other Riders</label>
      <input
        type="text"
        name="other_riders"
        id="other_riders"
        value={ride.other_riders}
        onChange={handleChange}
      />

      <label htmlFor="cost">Cost</label>
      <input
        type="number"
        name="cost"
        id="cost"
        value={ride.cost}
        onChange={handleChange}
      />

      <label htmlFor="car">Car</label>
      <input
        type="text"
        name="car"
        id="car"
        value={ride.car}
        onChange={handleChange}
      />

      <label htmlFor="seats">Seats</label>
      <input
        type="number"
        name="seats"
        id="seats"
        value={ride.seats}
        onChange={handleChange}
      />

      <label htmlFor="deviation">Deviation</label>
      <input
        type="number"
        name="deviation"
        id="deviation"
        value={ride.deviation}
        onChange={handleChange}
      />

      <input type="button" value="Submit" onClick={submitForm} />
    </form>
  );
}

export default RideForm;
