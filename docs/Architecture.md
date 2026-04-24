This repository has 2 npm workspaces in it. The root has the shared scripts like the format script and tests, while the actual app code lives in `packages/`.

- `packages/react-frontend`
- `packages/express-backend`

The frontend and backend communicate using API requests through HTTP

Very rough structure:

```text
NodeDemons/
  docs/
  packages/
    react-frontend/
    express-backend/
  test/
  package.json
```

The frontend is a React app built using Vite. It contains the UI, page routing, ride browsing, ride creation/editing flows, profile page, and the login screen. All of the route setup is in `src/App.jsx`.

Important files in the frontend are:

- `SSOPage.jsx` handles Microsoft SSO for Cal Poly students
- `ProtectedRoute.jsx` checks that the current user is authenticated before letting them into the app
- `AppNavbar.jsx`, `SearchBar.jsx`, `RidePreviewCard.jsx`, `RideDetailsWindow.jsx`, and `CreateRideWindow.jsx` is how the user browses/creates rides
- `MyRidesPage.jsx` and `MyRidesDetails.jsx` handle the rides the current user is involved in

In the frontend there is also a `src/utils/` folder which has small files that are used to make fetch calls to the backend for things like getting all the rides, users, cities, and logging out.

`packages/express-backend` is the backend Express app. All of the routes are in `backend.js`. In this file, we define the middleware, authentication flow, and the API endpoints.

The backend architecture is mostly split like this:

- `backend.js`
- `models/` = MongoDB schemas
- `services/` = backend logic that the routes call

- `models/user.js` stores our users users profile info, ratings, and ride information
- `models/ride.js` stores ride posts, driver/passenger data associated with that ride, route info, cost, seats, and if the ride is completed yet
- `models/city.js` stores city data used for autofill

- `services/google-maps-service.js` calls Google Routes and Places APIs to get route data and cities along the route

Authentication is implemented in backend with `passport-microsoft` and using `express-session`. The frontend sends the user to `/auth/microsoft`, Microsoft redirects back to `/auth/microsoft/callback`, and then the backend stores the session id and sends the user back to the frontend. After that, the frontend checks `/api/auth/me` to see who is logged in.

One request looks like this:

1. A user signs in from the React frontend.
2. The backend authenticates them using Microsoft and stores the session ID.
3. The frontend calls backend API routes for rides, with the user ID included in the request.
4. The backend checks the session ID to verify the user, then uses the user ID to get or update ride data in MongoDB.
5. The backend returns JSON to the frontend, and the React components update the UI.

**UML Diagram - last updated 3/15/2026:**
Figma Link: https://www.figma.com/board/vP3tHSQf8J5GEG0kMZ0X2v/TE4-UML?node-id=0-1&t=HjtDQ9mcThU6Kaa0-1

![alt text](UMLDiagramImage.png)

**Product Vision Figma - last updated 2/19/2026**
Figma Link: https://www.figma.com/design/9DdxCP4K1tvcXp29jImVUI/Landing-Page?node-id=0-1&t=ctl6FK2GTfFJ0gH3-1

**SSO Flow Explanation Figma**
Figma Link: https://www.figma.com/design/tW9RnoUSAp65Nabwq26i8n/SSO-Flowchart?node-id=0-1&t=AcUh7Wd0ThItlHOT-1
