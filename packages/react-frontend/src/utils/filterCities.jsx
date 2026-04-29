const filterCities = (cities, query) => {
  const normalizedQuery = query.trim().toLowerCase();

  let startWithCities = [];
  let includesCities = [];

  cities.forEach((city) => {
    const cityName = city.name.toLowerCase();
    if (cityName.startsWith(normalizedQuery)) {
      startWithCities.push(city);
    }
    if (
      cityName.includes(normalizedQuery) &&
      !cityName.startsWith(normalizedQuery)
    ) {
      includesCities.push(city);
    }
  });
  return [...startWithCities, ...includesCities].slice(0, 20);
};

export default filterCities;
