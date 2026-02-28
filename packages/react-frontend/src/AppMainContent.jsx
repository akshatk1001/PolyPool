import SearchBar from './SearchBar.jsx';
import RidePreviewCard from './RidePreviewCard.jsx';

function AppMainContent({ rides }) {
  return (
    <main className="main-content">
      <div className="search-bar-container">
        <SearchBar />
      </div>

      <div className="ride-grid">
        {rides.map((ride) => (
          <RidePreviewCard key={ride._id} ride={ride} />
        ))}
      </div>
    </main>
  );
}

export default AppMainContent;
