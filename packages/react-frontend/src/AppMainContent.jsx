import { useState } from 'react';
import SearchBar from './SearchBar.jsx';
import RidePreviewCard from './RidePreviewCard.jsx';
import filterRides from './utils/filterRides';

function AppMainContent({ rides, isLoadingRides, onRideUpdated }) {
  const [searchFilters, setSearchFilters] = useState({});

  const visibleRides = filterRides(rides, searchFilters).filter(
    (ride) => !ride.is_completed,
  );

  return (
    <main className="main-content">
      <div className="search-bar-container">
        <SearchBar onSearch={setSearchFilters} />
      </div>

      <div className="ride-grid">
        {isLoadingRides ? (
          'Loading In Rides'
        ) : visibleRides.length > 0 ? (
          visibleRides.map((ride) => (
            <RidePreviewCard
              key={ride._id}
              ride={ride}
              onRideUpdated={onRideUpdated}
            />
          ))
        ) : (
          <p>No rides found matching your search.</p>
        )}
      </div>
    </main>
  );
}

export default AppMainContent;
