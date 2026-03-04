import { useCallback, useEffect, useState } from 'react';

function useRides() {
  const [rides, setRides] = useState([]);

  const fetchRides = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/rides');
      const data = await response.json();
      setRides(data);
    } catch (error) {
      console.log('Error fetching rides:', error);
    }
  }, []);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  return { rides, fetchRides };
}

export default useRides;
