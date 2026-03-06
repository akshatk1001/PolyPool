/*
//Google maps Api requests
app.get('/api/maps/route', async (req, res ) =>{
  const origin = req.query.origin;
  const dest = req.query.dest;

  if(!origin || !dest){
    res.status(400).json({message: "Bad Request: origin or destination not provided"});
    return;
  }

  let ComputeRoutesRequest = {
    "origin": {
      "location": {
        "address": `${origin}, CA`
      },
    },
    "destination": {
      "location": {
        "address": `${dest}, CA`
      },
    },
    "routing_preference": "TRAFFIC_AWARE",
    "travel_mode": "DRIVE",
    "polylineQuality": "HIGH_QUALITY"
  };

  try {
    const route = fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': 'AIzaSyA1xtEjGzdHRTBSfxC6MgHgIW-oPT7tQ2c',
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline,routes.viewport'
      },
      body: ComputeRoutesRequest,
    })

    //this needs to update the the database with the route object
    //It also needs to save the cities passed in the database

    res.status(200).json(route);
  }catch (error){
    res.status(500).json({error: error.message})
  }
});
*/
