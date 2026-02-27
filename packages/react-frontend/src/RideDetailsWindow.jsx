import './RideDetailsWindow.css';

function RideDetailsWindow({ ride, onClose }) {
  if (!ride) {
    return null;
  }

  const formattedDateTime = ride.start_time
    ? new Date(ride.start_time).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'N/A';

  const driverValue =
    typeof ride.driver === 'object' && ride.driver !== null
      ? ride.driver.name || ride.driver._id || 'N/A'
      : ride.driver || 'N/A';

  const otherRidersValue = Array.isArray(ride.other_riders)
    ? ride.other_riders
        .map((rider) => {
          if (typeof rider === 'object' && rider !== null) {
            return rider.name || rider._id || '';
          }
          return rider;
        })
        .filter(Boolean)
        .join(', ') || 'None'
    : 'None';

  const citiesAlongRouteValue =
    Array.isArray(ride.cities_along_route) && ride.cities_along_route.length > 0
      ? ride.cities_along_route.join(', ')
      : 'None';

  return (
    <div className="ride-details-window" onClick={onClose}>
      <div className="ride-details-card" onClick={(event) => event.stopPropagation()}>
        <div className="ride-details-header">
          <h2>Ride Details</h2>
          <span className="close-btn" onClick={onClose}>
            ×
          </span>
        </div>

        <div className="ride-details-body">
          <div className="details-row">
            <span className="details-label">Starting Point</span>
            <span className="details-value">{ride.starting_point || 'N/A'}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Destination</span>
            <span className="details-value">{ride.destination || 'N/A'}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Start Time</span>
            <span className="details-value">{formattedDateTime}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Driver</span>
            <span className="details-value">{driverValue}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Other Riders</span>
            <span className="details-value">{otherRidersValue}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Cost per Seat</span>
            <span className="details-value">${ride.cost ?? 0}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Car</span>
            <span className="details-value">{ride.car || 'N/A'}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Seats</span>
            <span className="details-value">{ride.seats ?? 0}</span>
          </div>

          <div className="details-row">
            <span className="details-label">Max Deviation (minutes)</span>
            <span className="details-value">{ride.deviation ?? 0}</span>
          </div>

          <div className="details-row details-row-description">
            <span className="details-label">Description</span>
            <span className="details-value">{ride.description || 'None'}</span>
          </div>

          <div className="details-row details-row-description">
            <span className="details-label">Cities Along Route</span>
            <span className="details-value">{citiesAlongRouteValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RideDetailsWindow;