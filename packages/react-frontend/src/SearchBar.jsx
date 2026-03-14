import { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import './SearchBar.css';
import { API_URL } from './constants/api';
import fetchCities from './utils/fetchCities';
import filterCities from './utils/filterCities';

const SearchBar = ({ onSearchResults }) => {
  const [value, setValue] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [dt_value, setDtValue] = useState('');
  const [price_value, setPriceSearch] = useState(100);

  const valuetext = (value) => `$${value}`;

  const handleSlider = (event, newValue) => {
    setPriceSearch(newValue);
  };

  // load in all of the cities to list for parsing
  useEffect(() => {
    async function fetchAllCities() {
      try {
        const data = await fetchCities();
        setAllCities(data);
      } catch (error) {
        console.log('Fetch error: ', error);
      }
    }

    fetchAllCities();
  }, []);

  useEffect(() => {
    // if the input is empty don't show the dropdown
    if (!value.trim()) {
      setCityOptions([]);
      setShowDropdown(false);
      return;
    }

    const matches = filterCities(allCities, value);
    setCityOptions(matches);
    setShowDropdown(matches.length > 0);
  }, [value, allCities]);

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
    executeSearch(city);
  };

  return (
    <div className="search-container">
      <div className="input-group">
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
