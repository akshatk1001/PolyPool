export const DEFAULT_MAX_PRICE = 100;

function normalizeQuery(query = '') {
  return query.trim().toLowerCase();
}

function getSearchDate(date) {
  if (!date) {
    return null;
  }

  const [year, month, day] = date.split('-').map(Number);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day)
  ) {
    return null;
  }

  return { year, month, day };
}

function getSearchTime(time) {
  if (!time) {
    return null;
  }

  const [hours, minutes] = time.split(':').map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return { hours, minutes };
}

function hasPriceFilter(maxPrice) {
  return (
    !Number.isNaN(maxPrice) &&
    maxPrice <= DEFAULT_MAX_PRICE
  );
}

function matchesQuery(ride, normalizedQuery) {
  if (!normalizedQuery) {
    return true;
  }

  const destination = ride.destination.toLowerCase();
  const routeCities = Array.isArray(ride.cities_along_route)
    ? ride.cities_along_route.some((city) =>
        city.toLowerCase().includes(normalizedQuery),
      )
    : false;

  return destination.includes(normalizedQuery) || routeCities != false;
}

function matchesDate(ride, searchDate) {
  if (!searchDate) {
    return true;
  }

  const rideDate = new Date(ride.start_time);

  return (
    rideDate.getFullYear() === searchDate.year &&
    rideDate.getMonth() + 1 === searchDate.month &&
    rideDate.getDate() === searchDate.day
  );
}

function matchesTime(ride, searchTime) {
  if (!searchTime) {
    return true;
  }

  const rideDate = new Date(ride.start_time);

  if (Number.isNaN(rideDate.getTime())) {
    return false;
  }

  // Convert both times to minutes since midnight for easier comparison
  const rideMinutes = rideDate.getHours() * 60 + rideDate.getMinutes();
  const searchMinutes = searchTime.hours * 60 + searchTime.minutes;

  // show all rides on that date after the search time
  return rideMinutes >= searchMinutes;  
}

function matchesPrice(ride, maxPrice, usePriceFilter) {
  if (!usePriceFilter) {
    return true;
  }

  const rideCost = Number(ride.cost);
  return rideCost <= maxPrice;
}

export function filtersApplied(filters) {
  const normalizedQuery = normalizeQuery(filters.query);
  const searchDate = getSearchDate(filters.date);
  const searchTime = getSearchTime(filters.time);

  return Boolean(
    normalizedQuery ||
      searchDate ||
      searchTime ||
      hasPriceFilter(filters.maxPrice),
  );
}

export default function filterRides(rides, filters) {

  if (!filtersApplied(filters)) {
    return rides;
  }

  const normalizedQuery = normalizeQuery(filters.query);
  const searchDate = getSearchDate(filters.date);
  const searchTime = searchDate ? getSearchTime(filters.time) : null;
  const usePriceFilter = hasPriceFilter(filters.maxPrice);

  return rides.filter(
    (ride) =>
      matchesQuery(ride, normalizedQuery) &&
      matchesDate(ride, searchDate) &&
      matchesTime(ride, searchTime) &&
      matchesPrice(ride, filters.maxPrice, usePriceFilter),
  );
}
