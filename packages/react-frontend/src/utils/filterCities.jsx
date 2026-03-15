const filterCities = (cities, query) => {
  const normalizedQuery = query.trim().toLowerCase();

  return cities
    .filter((city) => city.name.toLowerCase().includes(normalizedQuery))
    .slice(0, 10);
};

export default filterCities;
