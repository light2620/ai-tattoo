import React, { useState, useEffect } from 'react';
import './style.css';
import { useUser } from '../../../Context/userContext';
import { useApi } from '../../../Api/apiProvider';
import toast from 'react-hot-toast';
const Profile = () => {
  const { user } = useUser();
  const { post } = useApi();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      setLoading(true);
      try {
        const response = await post(
          'https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/updateAIUserProfile',
          {
            updates: {
              displayName: profileData.name,
              phoneNumber: profileData.phone
            }
          }
        );
        toast.success(response.data.message);
      } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Something went wrong while updating.');
      } finally {
        setLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <div className="profile-form">
        <div className="profile-form-group">
          <label>Name:</label>
          <input
            name="name"
            value={profileData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-form-group">
          <label>Email:</label>
          <input
            name="email"
            value={profileData.email}
            onChange={handleChange}
            disabled
          />
        </div>

        <div className="profile-form-group">
          <label>Phone:</label>
          <input
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="profile-form-group">
          <label>Role:</label>
          <input
            name="role"
            value={profileData.role}
            disabled
          />
        </div>

        <button className="edit-btn" onClick={handleEditToggle} disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
