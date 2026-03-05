import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';

import userService from './services/user-service.js';
import rideService from './services/ride-service.js';
import cityService from './services/city-service.js';

dotenv.config();

const app = express();
const port = 8000;

const {
  MONGO_CONNECTION_STRING,
  MICROSOFT_CLIENT_ID,
  MICROSOFT_CLIENT_SECRET,
  SESSION_SECRET,
} = process.env;
const microsoftTenant = 'common';
mongoose.set('debug', true);

// ----Middleware----
app.use(
  cors({
    origin: 'http://localhost:5173', // where requests are allowed to come from
    credentials: true, // send the session cookie (users login state) across the site
  }),
);
app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET || 'SESSION SECRET NOT FOUND',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // SET TO SECURE IN PROD - DO NOT FORGET
  }),
);

app.use(passport.initialize());
app.use(passport.session()); // calls deserializeUser on every request to get user info

// ----Microsoft SSO config----
passport.use(
  new MicrosoftStrategy(
    {
      clientID: MICROSOFT_CLIENT_ID,
      clientSecret: MICROSOFT_CLIENT_SECRET,
      callbackURL: 'http://localhost:8000/auth/microsoft/callback',
      scope: ['openid', 'profile', 'email', 'User.Read'], // use openid connect protocol, and read profile info
      addUPNAsEmail: true, // include userPrincipalName when mail is blank
      tenant: microsoftTenant,
      passReqToCallback: true, // temporarily store user profile while asking for phone number
    },
    async (req, _accessToken, _refreshToken, profile, done) => {
      try {
        const user = await userService.findOrCreateMicrosoftUser(profile); // returns a mongo document of the user
        return done(null, user); // tell passport.use that it's job is done
      } catch (err) {
        if (err.message === 'non_calpoly_email') {
          return done(null, false); // signals auth failure
        }
        if (err.message === 'needs_phone_number') {
          // Save partial profile to session so the complete-signup endpoint can use it
          req.session.pendingUser = err.pendingUser;
          return done(null, false);
        }
        return done(err);
      }
    },
  ),
);

// store only the user id in the session cookie, not the whole user object
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

// when a request comes in to backend, passport runs this to get all user info
// stores user info in req.user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ----Connect to MongoDB----
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

// ----API Endpoints----
// Create a new ride
app.post('/api/rides', async (req, res) => {
  try {
    const ride = await rideService.createRide(req.body);
    res.status(201).json(ride);
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
    const rides = await rideService.searchRide(dest, date, price);
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update user info
app.put('/api/users/:id', async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.userId, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/rides/:id', async (req, res) => {
  try {
    const result = await rideService.updateRide(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// redirect user to Microsoft login
app.get(
  '/auth/microsoft',
  passport.authenticate('microsoft', {
    prompt: 'select_account', // always show account chooser
  }),
);

// make Microsoft redirect back here after login
app.get('/auth/microsoft/callback', (req, res, next) => {
  passport.authenticate('microsoft', (err, user) => {
    if (err) return next(err);
    if (!user) {
      // if they need phone number redirect to page with phone prompt
      if (req.session.pendingUser) {
        return res.redirect('http://localhost:5173?auth=needs_phone');
      }
      // otherwise just a normal auth failure
      return res.redirect('http://localhost:5173?auth=failed');
    }
    // have to actually log in user to session if they exist when the callback occurs
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.redirect('http://localhost:5173?auth=success');
    });
  })(req, res, next); // have to call the auth function otherwise window just got stuck
});

// user provides their phone number
app.post('/api/auth/complete-signup', async (req, res, next) => {
  const pending = req.session.pendingUser;
  const { phoneNum } = req.body;
  if (!phoneNum) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }
  // create the user
  try {
    const user = await userService.createMicrosoftUser(
      pending.microsoftId,
      pending.name,
      pending.email,
      phoneNum,
    );
    // remove the pending user since now they are fully signed up
    delete req.session.pendingUser;
    // log in user 
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ success: true });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// return currently logged-in user
app.get('/api/auth/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// log out
app.post('/api/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Logged out' });
  });
});

app.get('/api/cities/autofill', async (req, res) => {
  const dest = req.query.dest;
  try {
    const cities = await cityService.autofill(dest);
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cities', async (req, res) => {
  try {
    const cities = await cityService.getAll();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
