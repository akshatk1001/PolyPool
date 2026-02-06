import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const port = 8000;
dotenv.config();

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
