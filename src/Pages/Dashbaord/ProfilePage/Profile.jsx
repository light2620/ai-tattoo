import React, { useState, useEffect } from 'react';
import './style.css'; // We'll create this new CSS
import { useUser } from '../../../Context/userContext';
import { useApi } from '../../../Api/apiProvider';
import toast from 'react-hot-toast';
import "primeicons/primeicons.css";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
// import { useDispatch } from 'react-redux'; // useDispatch is imported but not used, can be removed if not needed elsewhere
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const { user, fetchUserDetails } = useUser();
  const { post } = useApi();
  // const dispatch = useDispatch(); // Not used in this component currently
  const credits = useSelector((state) => state.credits.credits);
  // console.log('Credits from Redux:', credits); // For debugging

  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    role: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || user.phone || '', // Prioritize phoneNumber
        role: user.role || '' // Display role, but it's not editable here
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setProfileData((prev) => ({ ...prev, phoneNumber: value || '' }));
  };

  const handleSaveChanges = async () => {
    if (!profileData.displayName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    if (profileData.phoneNumber && !isValidPhoneNumber(profileData.phoneNumber)) {
        toast.error("Please enter a valid phone number.");
        return;
    }

    setLoading(true);
    try {
      const response = await post(
        'https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/updateAIUserProfile',
        {
          updates: {
            displayName: profileData.displayName,
            phoneNumber: profileData.phoneNumber
          }
        }
      );
      if (response.status === 200 || response.data?.type === 'success') {
        toast.success(response.data.message || 'Profile updated successfully!');
        setIsEditing(false);
        if (fetchUserDetails) {
            fetchUserDetails();
        }
      } else {
        toast.error(response.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Something went wrong while updating.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setProfileData({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || user.phone || '',
        role: user.role || ''
      });
    }
  };


  return (
    <div className="profile-page-container">
      <div className="page-header-alt">
        <h1>My Profile</h1>
      </div>

      <div className="profile-content-card">
        <form onSubmit={(e) => { e.preventDefault(); if(isEditing) handleSaveChanges(); }}>
          <div className="profile-form-grid">
            <div className="form-field-item">
              <label htmlFor="displayName" className="form-label">Full Name</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                className="form-input"
                value={profileData.displayName}
                onChange={handleChange}
                disabled={!isEditing || loading}
              />
            </div>

            <div className="form-field-item">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={profileData.email}
                disabled
              />
            </div>

            <div className="form-field-item">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <PhoneInput
                id="phoneNumber"
                name="phoneNumber"
                className="form-input phone-input-profile"
                placeholder="Enter phone number"
                value={profileData.phoneNumber}
                onChange={handlePhoneChange}
                defaultCountry="US"
                international
                countryCallingCodeEditable={false}
                disabled={!isEditing || loading}
              />
            </div>

            {/* Added Section for Credits Display */}
            <div className="form-field-item">
              <label htmlFor="creditsLeft" className="form-label">Total Credits Left</label>
              <input
                type="text" // Display as text
                id="creditsLeft"
                name="creditsLeft"
                className="form-input"
                // Use ?? for nullish coalescing to show '0' if credits are 0
                value={credits ?? 'N/A'}
                disabled // This field is not editable by the user here
              />
            </div>
             {/* You could also display the role if desired, similar to credits */}
             {/*
             <div className="form-field-item">
              <label htmlFor="role" className="form-label">Account Role</label>
              <input
                type="text"
                id="role"
                name="role"
                className="form-input"
                value={profileData.role || 'N/A'}
                disabled
              />
            </div>
            */}

          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="profile-button secondary-button"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-button primary-button"
                  disabled={loading || !profileData.displayName.trim()}
                >
                  {loading ?  <i className="pi pi-spin pi-spinner"></i> : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="profile-button primary-button"
                onClick={handleEditClick}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;