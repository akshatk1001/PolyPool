import { useState, useEffect } from 'react'; // Added useEffect
import Slider from '@mui/material/Slider';
import './SearchBar.css';

const SearchBar = ({onSearchResults}) => {
  const [value, setValue] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [rides, setRides] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dt_value, setDtValue] = useState('');
  const [price_value, setPriceSearch] = useState([0, 100]);

  const valuetext = (value) => `$${value}`;

  const handleSlider = (event, newValue) => {
    setPriceSearch(newValue);
  };

  useEffect(() => {
    const fetchCities = async () => {
      if (!value.trim()) {
        setCityOptions([]); 
        setShowDropdown(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/cities/autofill?dest=${value}`);
        const data = await response.json();
        
        setCityOptions(data); 
        setShowDropdown(true); 
      } catch (error) {
        console.log("Fetch error: ", error);
      }
    };

    const debounceTimer = setTimeout(fetchCities, 300); 
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const executeSearch = async (searchTerm) => {
    const query = searchTerm || value;
    const dateParam = dt_value ? `&date=${dt_value}` : '';

    try {
      const url = query 
      ? `http://localhost:8000/api/rides?dest=${query}${dateParam}`
      : `http://localhost:8000/api/rides`;

      const response = await fetch(url);
      const data = await response.json();

      onSearchResults(data);
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
      />

      {showDropdown && cityOptions.length > 0 && (
        <ul className="suggestions-dropdown">
          {cityOptions.map((city, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(city.name)}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
      <div className="dateTime-container" style={{position: 'relative'}}>
        <label htmlFor="search_dt">Start Date</label>
          <input
            type='datetime-local'
            name="search_dt"
            id="search_dt"
            value={dt_value.search_dt}
            onChange={(e) => setDtValue(e.target.value)}
            style = {{padding: '6px', boxSizing: 'border-box'}}
            />
      </div>
      <Slider
        label='Price range'
        value={value}
        onChange={handleSlider}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        color= "blue"
      />
    </div>
  );
};

export default SearchBar;
