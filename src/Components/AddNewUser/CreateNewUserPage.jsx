import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'primeicons/primeicons.css';
import 'react-phone-number-input/style.css'; 

import { useApi } from '../../Api/apiProvider';

import './style.css';

const CreateNewUserPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const { post } = useApi();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return toast.error('Full name is required.');
    }
    if (!formData.email.trim()) {
      return toast.error('Email is required.');
    }
    if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
      return toast.error('Please enter a valid phone number.');
    }
    if (!formData.role) {
      return toast.error('Role is required.');
    }

    setLoading(true);
    try {
      
      const response = await post(
        'https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/adminCreateUser',
        formData
      );

      if (response.status === 200 || response.status === 201) { 
        toast.success(response.data.message || 'User created successfully!');
        navigate('/dashboard/users'); 
      } else {
        toast.error(response.data.message || 'Failed to create user.');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      toast.error(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-page-container">
      <div className="page-header">
        <h1>Create a new user</h1>
        
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="add-user-form-group">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </div>

            <div className="add-user-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

            <div className="add-user-form-group">
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
                className="phone-input-custom"
              />
            </div>

            <div className="add-user-form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
             
              </select>
            </div>
          </div>

          <div className="form-footer">
            <p className="password-note">
              * A password generation link will be sent to the user's email.
            </p>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? <i className="pi pi-spin pi-spinner"></i> : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewUserPage;