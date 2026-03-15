import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../SearchBar.jsx';
import fetchCities from '../utils/fetchCities.jsx';

jest.mock('../utils/fetchCities.jsx', () => ({
  __esModule: true, // treat like modern import/export file
  default: jest.fn(), // exports a fake function
}));

beforeEach(() => {
  fetchCities.mockReset();
});

test('shows matching city suggestions and sends the selected city to onSearch', async () => {
  // what the fake function should return
  fetchCities.mockResolvedValue([
    { name: 'San Jose' },
    { name: 'San Francisco' },
  ]);

  const onSearch = jest.fn(); // since SearchBar needs a onSearch func in it just pass mock jest function

  render(<SearchBar onSearch={onSearch} />);

  const cityInput = screen.getByPlaceholderText('Find Your Journey');

  fireEvent.focus(cityInput);
  fireEvent.change(cityInput, { target: { value: 'San Jo' } });

  const sanJoseOption = await screen.findByText('San Jose');
  fireEvent.click(sanJoseOption);

  expect(cityInput).toHaveValue('San Jose');
  expect(onSearch).toHaveBeenLastCalledWith({
    query: 'San Jose',
    date: '',
    time: '',
    maxPrice: 100,
  });
});

test('make sure that you can only select time after selecting a date', async () => {
  fetchCities.mockResolvedValue([]);

  const onSearch = jest.fn();

  render(<SearchBar onSearch={onSearch} />);

  const dateInput = screen.getByLabelText('Date / Time');
  const timeInput = document.getElementById('search_time');

  expect(timeInput).toBeDisabled();

  fireEvent.change(dateInput, { target: { value: '2026-03-20' } });
  expect(timeInput).not.toBeDisabled();

  fireEvent.change(timeInput, { target: { value: '10:30' } });

  await waitFor(() =>
    expect(onSearch).toHaveBeenLastCalledWith({
      query: '',
      date: '2026-03-20',
      time: '10:30',
      maxPrice: 100,
    }),
  );

  fireEvent.change(dateInput, { target: { value: '' } });

  expect(timeInput).toBeDisabled();
  expect(onSearch).toHaveBeenLastCalledWith({
    query: '',
    date: '',
    time: '',
    maxPrice: 100,
  });
});

test('does not show dropdown options when no cities match the search', async () => {
  fetchCities.mockResolvedValue([
    { name: 'San Jose' },
    { name: 'San Francisco' },
  ]);

  const onSearch = jest.fn();

  render(<SearchBar onSearch={onSearch} />);

  const cityInput = screen.getByPlaceholderText('Find Your Journey');

  fireEvent.focus(cityInput);
  fireEvent.change(cityInput, { target: { value: 'Sacramento' } });

  await waitFor(() => expect(fetchCities).toHaveBeenCalledTimes(1));

  expect(screen.queryByText('San Jose')).not.toBeInTheDocument();
  expect(screen.queryByText('San Francisco')).not.toBeInTheDocument();
});
