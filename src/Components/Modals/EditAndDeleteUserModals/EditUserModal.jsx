// src/Components/Modals/EditUserModal.js
import React, { useState, useEffect } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import toast from 'react-hot-toast';
import { useApi } from '../../../Api/apiProvider';
import 'react-phone-number-input/style.css'; 
import { FiInfo } from 'react-icons/fi'; 
import 'react-phone-number-input/style.css'; 
import './style.css';
import "primeicons/primeicons.css";


const EditUserModal = ({ isOpen, onClose, userData, fetchUserList }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    role: 'user',
    // email is not directly editable in this design, but needed for context
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const { post } = useApi();

  useEffect(() => {
    if (userData && userData.updates) {
      setFormData({
        displayName: userData.updates.userName || '',
        phoneNumber: userData.updates.phoneNumber || '',
        role: userData.updates.role || 'user',
        email: userData.email || '', // Assuming email is part of the top-level userData passed in
      });
    }
  }, [userData]);

  if (!isOpen || !userData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.displayName.trim()) {
      return toast.error('Full name is required.');
    }
    if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
      return toast.error('Please enter a valid phone number.');
    }

    setLoading(true);
    try {
      const payload = {
        uid: userData.uid,
        updates: {
          displayName: formData.displayName,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          // If email needs to be updated, include it here.
          // email: formData.email, // The provided API structure doesn't show email in updates
        },
      };
      const response = await post(
        'https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/updateAIUser',
        payload
      );

      if (response.status === 200) {
        toast.success(response.data.message || 'User updated successfully!');
        fetchUserList(); // Refresh the user list
        onClose(); // Close the modal
      } else {
        toast.error(response.data.message || 'Failed to update user.');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Determine if account is verified (example logic, adapt as needed)
  // The image shows this for an "Active" user.
  const isVerified = userData.status === 'Active';


  return (
    <div className="modal-overlay">
      <div className="modal-content edit-user-modal-content">
        <h2 className="modal-title">Update User</h2>

        {isVerified && (
          <div className="verification-banner">
            <FiInfo size={20} className="info-icon" />
            <span>Account is verified</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-user-form">
          <div className="form-group">
            <label htmlFor="displayName">Full name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone No</label>
            <PhoneInput
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              defaultCountry="US"
              international
              countryCallingCodeEditable={false}
              className="phone-input-custom-modal"
            />
          </div>
          {/* Display email if needed, non-editable based on design */}
          {/* <div className="form-group">
            <label>Email</label>
            <input type="text" value={formData.email} readOnly disabled />
          </div> */}


          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-button cancel-button" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="modal-button update-button" disabled={loading}>
              {loading ? <i className="pi pi-spin pi-spinner"></i> : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;