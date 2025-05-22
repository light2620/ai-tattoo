
import React, { useState, useEffect } from 'react';
import './style.css'; // We'll create this new CSS
import { useUser } from '../../../Context/userContext';
import { useApi } from '../../../Api/apiProvider';
import toast from 'react-hot-toast';
import "primeicons/primeicons.css";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Base styling for PhoneInput

const ProfilePage = () => {
  const { user, fetchUserDetails } = useUser(); // Assuming fetchUserDetails can refresh user context
  const { post } = useApi();

  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '', // Changed from 'phone' to match API and PhoneInput
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
          updates: { // API expects 'updates' object
            displayName: profileData.displayName,
            phoneNumber: profileData.phoneNumber
            // Email and role are typically not user-updatable through this kind of profile edit
          }
        }
      );
      if (response.status === 200 || response.data?.type === 'success') { // Check for success
        toast.success(response.data.message || 'Profile updated successfully!');
        setIsEditing(false);
        if (fetchUserDetails) { // If context has a refresh function
            fetchUserDetails(); // Refresh user data in context
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
    // Reset form to original user data from context
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
                name="displayName" // Changed from 'name'
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
                disabled // Email is generally not editable by user directly
              />
            </div>

            <div className="form-field-item">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <PhoneInput
                id="phoneNumber"
                name="phoneNumber"
                className="form-input phone-input-profile" // Custom class for PhoneInput wrapper
                placeholder="Enter phone number"
                value={profileData.phoneNumber}
                onChange={handlePhoneChange}
                defaultCountry="US"
                international
                countryCallingCodeEditable={false}
                disabled={!isEditing || loading}
              />
            </div>


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
                  type="submit" // Changed to submit
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