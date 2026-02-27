import './RideDetailsWindow.css';

function RideDetailsWindow({ ride, onClose }) {
  if (!ride) {
    return null;
  }


  const driverName =
    typeof ride.driver === 'object' && ride.driver !== null
      ? ride.driver.name || 'Unknown'
      : typeof ride.driver === 'string' && !/^[a-f\d]{24}$/i.test(ride.driver)
        ? ride.driver
        : 'Unknown';

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
        .map((r) => {
          if (typeof r === 'object' && r !== null) return r.name || '';
          return typeof r === 'string' && !/^[a-f\d]{24}$/i.test(r) ? r : '';
        })
        .filter(Boolean)
    : [];

  const totalSeats = ride.seats ?? 0;
  const takenSeats = passengerNames.length;
  const remainingSeats = Math.max(totalSeats - takenSeats, 0);

  const CalendarIcon = () => (
    <svg className="rd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const ClockIcon = () => (
    <svg className="rd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  const SeatIcon = () => (
    <svg className="rd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 11a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6H5v-6z" />
      <path d="M5 17v2" />
      <path d="M19 17v2" />
      <path d="M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    </svg>
  );

  const PersonIcon = () => (
    <svg className="rd-icon" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );

  const CarIcon = () => (
    <svg className="rd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17h14v-5l-2-5H7l-2 5v5z" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );

  const WavyIcon = () => (
    <svg className="rd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12q3-4 6-4t6 4 6 4q3 0 6-4" />
    </svg>
  );

  return (
    <div className="ride-details-window" onClick={onClose}>
      <div className="ride-details-card" onClick={(e) => e.stopPropagation()}>

        <div className="rd-header">
          <h2 className="rd-title">
            {driverName}&rsquo;s Ride to {ride.destination || 'N/A'}
          </h2>
          <span className="rd-close" onClick={onClose}>&#x2715;</span>
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
              <span>Remaining available Seats: {remainingSeats}/{totalSeats}</span>
            </div>
            <div className="rd-info-item">
              <PersonIcon />
              <span>Passengers: {passengerNames.length > 0 ? passengerNames.join(', ') : 'None'}</span>
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
            <button className="rd-request-btn">Request Ride</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RideDetailsWindow;