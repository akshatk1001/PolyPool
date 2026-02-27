import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import userService from './services/user-service.js';
import rideService from './services/ride-service.js';
import cityService from './services/city-service.js';

dotenv.config();

const app = express();
const port = 8000;

const { MONGO_CONNECTION_STRING } = process.env;
mongoose.set('debug', true);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .then(() => {
    console.log('✓ Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('✗ MongoDB connection error:', error);
  });

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Create a new user
app.post('/api/users', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new ride
app.post('/api/rides', async (req, res) => {
  try {
    const ride = await rideService.createRide(req.body);
    res.status(201).json(ride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by ID
app.patch('/api/users/:id', async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all rides
app.get('/api/rides', async (req, res) => {
  const dest = req.query.dest;
  const price = req.query.price;
  const date = req.query.date;
  try {
    const rides = await rideService.searchRide(dest, price, date);
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cities/autofill',  async (req, res) => {
  const dest = req.query.dest;
  try {
    const cities = await cityService.autofill(dest);
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cities',  async (req, res) => {
  try {
    const cities = await cityService.getAll();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
