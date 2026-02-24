import { useState, useEffect } from 'react'; // Added useEffect
import './App.css';

const SearchBar = () => {
  const [value, setValue] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [rides, setRides] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  /*
  useEffect(() => {
    const fetchCities = async () => {
      if (!value.trim()) {
        setCityOptions([]); //eventually should autofill with most common destinations
        setShowDropdown(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/cities?dest=${value}`);
        const data = await response.json();
        
        setCityOptions(data); 
        setShowDropdown(true); 
      } catch (error) {
        console.log("Fetch error: ", error);
      }
    };

    fetchCities();
  }, [value]);*/

  const executeSearch = async (searchTerm) => {
    const query = searchTerm || value;

    if (!query.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/rides?dest=${query}`,
      );
      const data = await response.json();

      setRides(data);
      setShowDropdown(false);
    } catch (error) {
      console.log('Fetch error:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const handleOptionClick = (city) => {
    setValue(city);
    executeSearch(city);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Find Your Journey"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        style={{ width: '80%', padding: '8px' }}
      />

      {showDropdown && cityOptions.length > 0 && (
        <ul
          className="suggestions-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            zIndex: 1000,
          }}
        >
          {cityOptions.map((city, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(city)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
