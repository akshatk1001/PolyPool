import { useState, useEffect } from 'react';
import SearchBar from './SearchBar.jsx';
import RidePreviewCard from './RidePreviewCard.jsx';

function AppMainContent({ rides }) {
  const [filteredRides, setFilteredRides] = useState(rides);

  useEffect(() => {
    setFilteredRides(rides);
  }, [rides]);

  return (
    <main className="main-content">
      <div className="search-bar-container">
        <SearchBar onSearchResults={setFilteredRides} />
      </div>

      <div className="ride-grid">
        {filteredRides.length > 0 ? (
             filteredRides.map((ride) => <RidePreviewCard key={ride._id} ride={ride} />)
           ) : (
             <p>No rides found matching your search.</p>
           )}
      </div>
    </main>
  );
}

export default AppMainContent;
