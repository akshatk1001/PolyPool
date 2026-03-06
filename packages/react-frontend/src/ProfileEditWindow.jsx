import { useState, useEffect } from 'react';
import './ProfileEditWindow.css';
import CAL_POLY_MAJORS from './constants/calPolyMajors';

const YEAR_OPTIONS = [
  { label: 'Freshman', value: '1' },
  { label: 'Sophomore', value: '2' },
  { label: 'Junior', value: '3' },
  { label: 'Senior', value: '4' },
  { label: '5th Year+', value: '5' },
  { label: 'Graduate Student', value: '6' },
];

function formatPhoneNumber(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)} - ${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)} - ${digits.slice(3, 6)} - ${digits.slice(6)}`;
}

function parsePhoneNumber(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 10);
  if (digits.length !== 10) {
    return null;
  }
  return Number(digits);
}

function normalizeProfileForForm(user) {
  if (!user) {
    return null;
  }

  return {
    ...user,
    phone_num: formatPhoneNumber(user.phone_num),
  };
}

function sanitizeCarValue(value) {
  return value
    .replace(/[^a-zA-Z0-9 .,'-]/g, '')
    .replace(/\s{2,}/g, ' ')
    .slice(0, 60);
}

function ProfileEditWindow({ currentUser, onClose, onSaved }) {
  // profile holds all the user fields from the backend
  const [profile, setProfile] = useState(normalizeProfileForForm(currentUser));

  const userId = currentUser?._id || currentUser?.id;

  // Fetch user data when the modal opens
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    if (!userId) {
      return;
    }

    fetch(`http://localhost:8000/api/users/${userId}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load profile: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setProfile(normalizeProfileForForm(data)))
      .catch((err) => console.log('Failed to load profile:', err));
  }, [currentUser, userId]);

  // Updates a single field in the profile state when an input changes
  function handleChange(event) {
    const { name, value } = event.target;
    let normalizedValue = value;

    if (name === 'phone_num') {
      normalizedValue = formatPhoneNumber(value);
    }

    if (name === 'car') {
      normalizedValue = sanitizeCarValue(value);
    }

    setProfile({
      ...profile,
      [name]: normalizedValue,
    });
  }

  // Sends the updated fields to the backend via PATCH
  async function handleSave(event) {
    event.preventDefault();
    if (!userId) {
      console.log('Cannot save profile: missing user ID');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: profile.name,
          phone_num: parsePhoneNumber(profile.phone_num),
          grade: profile.grade,
          major: profile.major,
          home_address: profile.home_address,
          car: profile.car,
          email: profile.email,
          venmo_username: profile.venmo_username,
          paypal_id: profile.paypal_id,
          instagram: profile.instagram,
        }),
      });
      if (res.ok) {
        console.log('Profile saved');
        const updatedUser = await res.json();
        if (onSaved) {
          onSaved(updatedUser);
        }
        onClose();
      } else {
        console.log('Failed to save profile:', res.status);
      }
    } catch (error) {
      console.log('Save request failed:', error);
    }
  }

  // Show nothing while data is loading
  if (!profile) {
    return (
      <div className="profile-window">
        <div className="profile-card">
          <div className="profile-header">
            <h2>Profile</h2>
            <span className="modal-close-btn" onClick={onClose}>
              ×
            </span>
          </div>
          <form className="profile-form">
            <p>Unable to load profile data.</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-window">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profile</h2>
          <span className="modal-close-btn" onClick={onClose}>
            ×
          </span>
        </div>

        <form className="profile-form" onSubmit={handleSave}>

          <div className="form-field full-width">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={profile.name || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={profile.email || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="phone_num">Phone Number</label>
              <input
                type="tel"
                name="phone_num"
                id="phone_num"
                placeholder="xxx - xxx - xxxx"
                value={profile.phone_num || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="grade">Grade (Year)</label>
              <select
                name="grade"
                id="grade"
                value={profile.grade || ''}
                onChange={handleChange}
              >
                <option value="">Select year</option>
                {YEAR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="major">Major</label>
              <input
                type="text"
                name="major"
                id="major"
                list="cal-poly-major-options"
                placeholder="Major"
                value={profile.major || ''}
                onChange={handleChange}
              />
              <datalist id="cal-poly-major-options">
                {CAL_POLY_MAJORS.map((major) => (
                  <option key={major} value={major} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="form-field full-width">
            <label htmlFor="home_address">Home Address</label>
            <input
              type="text"
              name="home_address"
              id="home_address"
              placeholder="Home Address"
              value={profile.home_address || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-field full-width">
            <label htmlFor="car">Car</label>
            <input
              type="text"
              name="car"
              id="car"
                placeholder="Car details"
              value={profile.car || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="venmo_username">Venmo</label>
              <input
                type="text"
                name="venmo_username"
                id="venmo_username"
                placeholder="@username"
                value={profile.venmo_username || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="paypal_id">PayPal</label>
              <input
                type="text"
                name="paypal_id"
                id="paypal_id"
                placeholder="PayPal ID"
                value={profile.paypal_id || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field full-width">
            <label htmlFor="instagram">Instagram</label>
            <input
              type="text"
              name="instagram"
              id="instagram"
              placeholder="@handle"
              value={profile.instagram || ''}
              onChange={handleChange}
            />
          </div>

          <button className="save-button" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileEditWindow;
