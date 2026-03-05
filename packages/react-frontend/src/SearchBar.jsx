import { useState, useEffect } from 'react'; // Added useEffect
import Slider from '@mui/material/Slider';
import './SearchBar.css';

const SearchBar = ({onSearchResults}) => {
  const [value, setValue] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dt_value, setDtValue] = useState('');
  const [price_value, setPriceSearch] = useState(100);

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
    let dateParam;
    if (dt_value){
      dateParam = new Date(dt_value).toISOString();
    }else{
      dateParam = new Date().toISOString();
    }
    const priceParam = price_value ? `&price=${price_value}` :'';

    try {
      const url = query 
      ? `http://localhost:8000/api/rides?dest=${query}&date=${dateParam}${priceParam}`
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
    <div className="search-container" >
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
      <div className="filter-row">
        <div className="dateTime-container" >
          <label htmlFor="search_dt">Date/Time</label>
            <input
              type='datetime-local'
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
            color= "blue"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
