import { useState, useEffect, useRef } from 'react'; // Added useEffect
import Slider from '@mui/material/Slider';
import './SearchBar.css';
import { API_URL } from './constants/api';

const SearchBar = ({ onSearchResults }) => {
  const [value, setValue] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dt_value, setDtValue] = useState('');
  const [price_value, setPriceSearch] = useState(100);

  const valuetext = (value) => `$${value}`;
  const searchContainerRef = useRef(null);

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
        const response = await fetch(
          `${API_URL}/api/cities/autofill?dest=${value}`,
        );
        const data = await response.json();

        setCityOptions(data);
      } catch (error) {
        console.log('Fetch error: ', error);
      }
    };

    const debounceTimer = setTimeout(fetchCities, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

   useEffect(() =>{
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false); // ...close the dropdown!
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 

  const executeSearch = async (searchTerm) => {
    const query = searchTerm || value;
    let dateParam;
    if (dt_value) {
      dateParam = new Date(dt_value).toISOString();
    } else {
      dateParam = new Date().toISOString();
    }
    const priceParam = price_value ? `&price=${price_value}` : '';

    try {
      const url = query
        ? `${API_URL}/api/rides?dest=${query}&date=${dateParam}${priceParam}`
        : `${API_URL}/api/rides`;

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
    setShowDropdown(false);
    executeSearch(city);
  };

  return (
    <div className="search-container">
      <div className="input-group" ref={searchContainerRef}>
        <input
          type="text"
          className="search-bar"
          placeholder="Find Your Journey"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
        />

        {showDropdown && cityOptions.length > 0 && (
          <ul className="suggestions-dropdown">
            {cityOptions.map((city, index) => (
              <li key={index} onClick={() => handleOptionClick(city.name)}>
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="filter-row">
        <div className="dateTime-container">
          <label htmlFor="search_dt">Date/Time</label>
          <input
            className="date-input"
            type="datetime-local"
            name="search_dt"
            id="search_dt"
            value={dt_value}
            onChange={(e) => setDtValue(e.target.value)}
          />
        </div>

        <div className="slider-container">
          <label>Price Range: 0 - ${price_value}</label>
          <Slider
            value={price_value}
            onChange={handleSlider}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            min={0}
            max={100}
            color="blue"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
