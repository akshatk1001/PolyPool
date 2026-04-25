import { useState, useEffect, useRef } from 'react'; // Added useEffect
import Slider from '@mui/material/Slider';
import './SearchBar.css';
import fetchCities from './utils/fetchCities';
import filterCities from './utils/filterCities';
import { DEFAULT_MAX_PRICE } from './utils/filterRides';

const SearchBar = ({ onSearch }) => {
  const [citySearched, setCitySearched] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [price_value, setPriceSearch] = useState(DEFAULT_MAX_PRICE);
  const cityOptions = citySearched.trim()
    ? filterCities(allCities, citySearched)
    : [];

  const valuetext = (value) => `$${value}`;
  const searchContainerRef = useRef(null);

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
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowDropdown(false); // ...close the dropdown!
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const filters = {
      query: citySearched,
      date: dateValue,
      time: timeValue,
      maxPrice: price_value,
    };

    onSearch(filters);
  }, [citySearched, dateValue, timeValue, onSearch, price_value]);

  const handleOptionClick = (city) => {
    setCitySearched(city);
    setShowDropdown(false);
  };

  return (
    <div className="search-container">
      <div className="input-group" ref={searchContainerRef}>
        <input
          type="text"
          className="search-bar"
          placeholder="Find Your Journey"
          value={citySearched}
          onChange={(e) => {
            setCitySearched(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={() => setShowDropdown(false)}
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
          <label htmlFor="search_date">Date / Time</label>
          <div className="dateTime-inputs">
            <input
              className="date-input"
              type="date"
              name="search_date"
              id="search_date"
              value={dateValue}
              onChange={(e) => {
                const nextDate = e.target.value;
                setDateValue(nextDate);

                if (!nextDate) {
                  setTimeValue('');
                }
              }}
            />
            <input
              className="date-input"
              type="time"
              name="search_time"
              id="search_time"
              value={timeValue}
              disabled={!dateValue}
              onChange={(e) => setTimeValue(e.target.value)}
            />
          </div>
        </div>

        <div className="slider-container">
          <label>Price Range: 0 - ${price_value}</label>
          <Slider
            value={price_value}
            onChange={handleSlider}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            min={0}
            max={DEFAULT_MAX_PRICE}
            color="blue"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
