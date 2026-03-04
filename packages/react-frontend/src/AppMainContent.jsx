import SearchBar from './SearchBar.jsx';
import RidePreviewCard from './RidePreviewCard.jsx';

function AppMainContent({ rides }) {
  return (
    <main className="main-content">
      <div className="search-bar-container">
        <SearchBar onSearchResults={setRides} />
      </div>

      <div className="ride-grid">
        {rides.length > 0 ? (
             rides.map((ride) => <RidePreviewCard key={ride._id} ride={ride} />)
           ) : (
             <p>No rides found matching your search.</p>
           )}
      </div>
    </main>
  );
}

