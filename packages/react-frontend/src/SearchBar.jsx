import { useEffect, useState } from 'react';
import './App.css';


function fetchRides(value){
    const promise = fetch("http:localhost:8000/rides");
    return promise;
}

const SearchBar = () => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch(
          `http://localhost:8000/rides/search?q=${value}`
        );

        setSuggestions(data.rides);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [value]);

  return (
    <input
        type="text"
        className="search-bar"
        placeholder="Find Your Journey"
        value={value}
        onChange={(e) => {
            setValue(e.target.value);
        }}
    />
  );
};

export default SearchBar;