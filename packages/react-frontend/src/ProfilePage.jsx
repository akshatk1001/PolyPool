import { useState, useEffect } from 'react';
import AppNavbar from './AppNavbar';
import CreateRideWindow from './CreateRideWindow';
import useSignOut from './utils/signOut';
import ProfileEditWindow from './ProfileEditWindow';
import fetchUser from './utils/fetchUser';
import fetchRides from './utils/fetchRides';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const signOut = useSignOut();

  const [showCreateRide, setShowCreateRide] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [user, setUser] = useState(undefined);

  function loadUser(id) {
    console.log(id);
    const id2 = id || null;
    console.log(id2);
    fetchUser(id2)
      .then(setUser)
      .catch(() => setUser(null));
  }

  const params = useParams();
  const isOwner = !params.id;

  useEffect(() => {
    if (params.id) {
      console.log('has id');
      const id = params.id;
      loadUser(id);
    } else {
      console.log('no id');
      loadUser();
    }
  }, [params.id]);

  if (!user) {
    return null;
  }

  const initials = (user.name || user.displayName || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart[0].toUpperCase())
    .join('');

  //get the amount of rides given and taken from the previous rides array. If the user is the driver, then it's a ride given, otherwise it's a ride taken
  const previousRideIds = Array.isArray(user.previous_rides)
    ? user.previous_rides.map(String)
    : [];
  const ridesGiven = previousRideIds.filter((rideId) =>
    Array.isArray(user.rides_as_driver)
      ? user.rides_as_driver.map(String).includes(rideId)
      : false,
  ).length;
  const ridesTaken = previousRideIds.filter((rideId) =>
    Array.isArray(user.rides_as_passenger)
      ? user.rides_as_passenger.map(String).includes(rideId)
      : false,
  ).length;

  //get the average rating from the ratings array. If there are no ratings, then the rating is null.
  let ratingValue = 0;
  user.ratings.map((rating) => ratingValue += rating)
  if (user.ratings.length === 0) {
    ratingValue = null;
  } else {
    ratingValue = ratingValue / user.ratings.length;
  }
  const ratingText = ratingValue !== null ? ratingValue.toFixed(1) : 'No Reviews';
  const ratingCount = user.ratings.length || 0;
  const filledStars = ratingValue !== null ? Math.round(ratingValue) : 0;
  const stars = `${'★'.repeat(filledStars)}${'☆'.repeat(5 - filledStars)}`;

  function renderField(value) {
    if (value === null || value === undefined || value === '') {
      return 'Not provided';
    }
    return value;
  }

  return (
    <div className="app">
      <AppNavbar
        onCreateRideClick={() => setShowCreateRide(true)}
        onProfileClick={() => navigate('/profile')}
        onSignOutClick={signOut}
        onMyRidesClick={() => navigate('/my-rides')}
      >
        {showCreateRide && (
          <CreateRideWindow
            onClose={() => setShowCreateRide(false)}
            onRideCreated={fetchRides}
          />
        )}
        {showProfileEdit && (
          <ProfileEditWindow
            currentUser={user}
            onClose={() => setShowProfileEdit(false)}
            onSaved={() => {
              loadUser();
              setShowProfileEdit(false);
            }}
          />
        )}
      </AppNavbar>

      <div className="profile-page">
        <section className="profile-hero-card">
          <div className="profile-hero-left">
            {user.profile_pic ? (
              <img
                src={user.profile_pic}
                alt="Profile"
                className="profile-pic-large"
              />
            ) : (
              <div className="profile-pic-fallback">{initials}</div>
            )}

            <div className="profile-identity">
              <h1>{user.name || user.displayName || 'PolyPool Rider'}</h1>
              <div
                className="profile-rating-summary"
                aria-label={`Rating ${ratingValue} out of 5 from ${ratingCount} ratings`}
              >
                <span className="profile-rating-stars">{stars}</span>
                <span className="profile-rating-text">
                  {ratingText} ({ratingCount})
                </span>
              </div>
              <p>{renderField(user.email)}</p>
              {isOwner ? (
                <button
                  type="button"
                  className="profile-edit-button"
                  onClick={() => setShowProfileEdit(true)}
                >
                  Edit Profile
                </button>
              ) : null}
            </div>
          </div>

          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <span className="profile-stat-label">Rides Given</span>
              <span className="profile-stat-value">{ridesGiven}</span>
            </div>
            <div className="profile-stat-card">
              <span className="profile-stat-label">Rides Taken</span>
              <span className="profile-stat-value">{ridesTaken}</span>
            </div>
          </div>
        </section>

        <section className="profile-details-grid">
          <article className="profile-info-card">
            <h2>Academic Info</h2>
            <div className="profile-detail-row">
              <span>Grade</span>
              <strong>{renderField(user.grade)}</strong>
            </div>
            <div className="profile-detail-row">
              <span>Major</span>
              <strong>{renderField(user.major)}</strong>
            </div>
          </article>

          <article className="profile-info-card">
            <h2>Contact</h2>
            <div className="profile-detail-row">
              <span>Phone</span>
              <strong>{renderField(user.phone_num)}</strong>
            </div>
            <div className="profile-detail-row">
              <span>Home Address</span>
              <strong>{renderField(user.home_address)}</strong>
            </div>
            <div className="profile-detail-row">
              <span>Instagram</span>
              <strong>{renderField(user.instagram)}</strong>
            </div>
          </article>

          <article className="profile-info-card">
            <h2>Vehicle</h2>
            <div className="profile-detail-row">
              <span>Car</span>
              <strong>{renderField(user.car)}</strong>
            </div>
          </article>

          <article className="profile-info-card">
            <h2>Payments</h2>
            <div className="profile-detail-row">
              <span>Venmo</span>
              <strong>{renderField(user.venmo_username)}</strong>
            </div>
            <div className="profile-detail-row">
              <span>PayPal</span>
              <strong>{renderField(user.paypal_id)}</strong>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
