import filterRides from '../utils/filterRides.js';

const routeCityRides = [
  {
    _id: 'ride-1',
    destination: 'San Francisco',
    cities_along_route: ['San Jose', 'San Mateo'],
    start_time: '2026-03-20T11:00:00',
    cost: 20,
  },
  {
    _id: 'ride-2',
    destination: 'San Francisco',
    cities_along_route: ['San Jose'],
    start_time: '2026-03-20T09:00:00',
    cost: 20,
  },
  {
    _id: 'ride-3',
    destination: 'Los Angeles',
    cities_along_route: ['Bakersfield'],
    start_time: '2026-03-20T11:00:00',
    cost: 20,
  },
];

const destinationRides = [
  {
    _id: 'ride-1',
    destination: 'San Jose',
    cities_along_route: ['San Mateo'],
    start_time: '2026-03-20T10:30:00',
    cost: 20,
  },
  {
    _id: 'ride-2',
    destination: 'San Jose',
    cities_along_route: ['Sunnyvale'],
    start_time: '2026-03-20T12:00:00',
    cost: 20,
  },
  {
    _id: 'ride-3',
    destination: 'San Jose',
    cities_along_route: ['Milpitas'],
    start_time: '2026-03-19T12:00:00',
    cost: 20,
  },
  {
    _id: 'ride-4',
    destination: 'San Jose',
    cities_along_route: ['Santa Clara'],
    start_time: '2026-03-20T09:00:00',
    cost: 20,
  },
];

test(
  'return rides that pass through a city a passenger is trying to go to after the time on that specific date',
  () => {
    const results = filterRides(routeCityRides, {
      query: 'San Jose',
      date: '2026-03-20',
      time: '10:30',
      maxPrice: 25,
    });

    expect(results).toHaveLength(1);
    expect(results[0]._id).toBe('ride-1');
  },
);

test(
  'return rides that directly match the searched destination on that day at or after the searched time, but not rides on other days',
  () => {
    const results = filterRides(destinationRides, {
      query: 'San Jose',
      date: '2026-03-20',
      time: '10:30',
      maxPrice: 25,
    });

    expect(results).toHaveLength(2);
    expect(results.map((ride) => ride._id)).toEqual(['ride-1', 'ride-2']);
  },
);

test('return all rides when no filters are applied', () => {
  const results = filterRides(destinationRides, {});

  expect(results).toEqual(destinationRides);
});

test('return rides when the searched city uses different capitalization', () => {
  const results = filterRides(destinationRides, {
    query: 'san jose',
    date: '2026-03-20',
    time: '10:30',
    maxPrice: 25,
  });

  expect(results).toHaveLength(2);
  expect(results.map((ride) => ride._id)).toEqual(['ride-1', 'ride-2']);
});

test('return only rides whose cost is less than or equal to the searched price', () => {
  const rides = [
    {
      _id: 'ride-1',
      destination: 'San Jose',
      cities_along_route: ['Sunnyvale'],
      start_time: '2026-03-20T10:30:00',
      cost: 15,
    },
    {
      _id: 'ride-2',
      destination: 'San Francisco',
      cities_along_route: ['San Mateo'],
      start_time: '2026-03-20T11:00:00',
      cost: 25,
    },
    {
      _id: 'ride-3',
      destination: 'Los Angeles',
      cities_along_route: ['Bakersfield'],
      start_time: '2026-03-20T12:00:00',
      cost: 30,
    },
  ];

  const results = filterRides(rides, {
    query: '',
    date: '',
    time: '',
    maxPrice: 25,
  });

  expect(results).toHaveLength(2);
  expect(results.map((ride) => ride._id)).toEqual(['ride-1', 'ride-2']);
});
