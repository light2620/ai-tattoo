// src/Pages/Admin/Users/UserDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../Api/apiProvider";
import toast from "react-hot-toast";
import Spinner from "../../../utils/Spinner/Spinner";
import "./style.css";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FaArrowLeft } from 'react-icons/fa';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import DeleteUserModal from "../../../Components/Modals/EditAndDeleteUserModals/DeleteUserModal";

const UserDetails = () => {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const { post } = useApi();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteUserPopup, setShowDeleteUserPopup] = useState(false);
  const [deleteUserData, setDeleteUserData] = useState({ name: '', uid: '' });

  async function fetchUserData() {
    setIsLoading(true);
    try {
      const response = await post(
        `https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/getUserDetailsById?uid=${uid}`
      );
      if (response.status === 200 && response.data.user) {
        setUserData(response.data.user);
        setUpdatedDetails({
          displayName: response.data.user.displayName || "",
          phoneNumber: response.data.user.phoneNumber || "",
          email: response.data.user.email || "",
          role: response.data.user.role || "",
          status: response.data.user.status || ""
        });
      } else {
        toast.error("Failed to fetch user details.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [uid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({ ...updatedDetails, [name]: value });
  };

  const handlePhoneChange = (value) => {
    setUpdatedDetails(prev => ({ ...prev, phoneNumber: value || '' }));
  };

  const handleSaveDetails = async () => {
    setIsSaving(true);
    try {
      const payload = {
        uid: userData.uid,
        updates: {
          displayName: updatedDetails.displayName,
          phoneNumber: updatedDetails.phoneNumber,
          role: updatedDetails.role,
          status: updatedDetails.status, // Include status here as well.
          email: updatedDetails.email //  also update email
        },
      };

      const response = await post(
        'https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/updateAIUser',
        payload
      );

      if (response.status === 200) {
        toast.success("User details updated successfully!");
        setIsEditMode(false);
        await fetchUserData(); // Refresh the user data
      } else {
        toast.error("Failed to update user details.");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error(error.response?.data?.message || "Something went wrong while updating.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnableEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset updatedDetails to the original userData values
    setUpdatedDetails({
      displayName: userData.displayName || "",
      phoneNumber: userData.phoneNumber || "",
      email: userData.email || "",
      role: userData.role || "",
      status: userData.status || ""
    });
  };

  const handleDeleteUserClick = () => {
    setDeleteUserData({ name: userData.displayName || 'this user', uid: userData.uid });
    setShowDeleteUserPopup(true);
  };

  const onDeleteUser = async () => {
    setIsDeleting(true);
    setShowDeleteUserPopup(false);  // Close the modal immediately

    try {
      const response = await post(
        `https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/deleteAIUser?uid=${uid}`
      );
      if (response.status === 200) {
        toast.success("User deleted successfully.");
        navigate("/users");
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user.");
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="user-details-container">
      {/* Top Navigation */}
      <div className="top-nav">
        <button className="back-btn" onClick={() => navigate("/users")}>
          <FaArrowLeft />
        </button>
        <h1 className="page-title">User Details</h1>
      </div>

      {/* User Profile Card */}
      <div className="profile-card">
        {isLoading ? (
          <div className="spinner-container">
            <Spinner />
          </div>
        ) : (
          <div className="profile-card-content">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="displayName">Full Name</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={updatedDetails.displayName}
                  onChange={handleInputChange}
                  disabled={!isEditMode || isSaving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={updatedDetails.email}
                  onChange={handleInputChange}
                  disabled={!isEditMode || isSaving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <PhoneInput
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  value={updatedDetails.phoneNumber}
                  onChange={handlePhoneChange}
                  defaultCountry="US"
                  international
                  countryCallingCodeEditable={false}
                  disabled={!isEditMode || isSaving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="creditScore">Total Credits Left</label>
                <input
                  type="text"
                  id="creditScore"
                  name="creditScore"
                  value={userData.creditScore}
                  disabled
                />
              </div>

              {/* Make email, role and status editable */}

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={updatedDetails.role}
                  onChange={handleInputChange}
                  disabled={!isEditMode || isSaving}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={updatedDetails.status}
                  onChange={handleInputChange}
                  disabled={!isEditMode || isSaving}
                >
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
              {/* New Fields (Not Editable) */}
              <div className="form-group">
                <label>Total Generated Images</label>
                <input
                  type="text"
                  value={userData.generateImages?.length || 0} // Display length of array
                  disabled
                />
              </div>

            </div>

            <div className="profile-actions">
              {isEditMode ? (
                <>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleSaveDetails}
                    disabled={isSaving || !updatedDetails.displayName.trim()}
                  >
                    {isSaving ? <i className="pi pi-spin pi-spinner"></i> : 'Save Changes'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleEnableEdit}
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className="button secondary"
                    onClick={handleDeleteUserClick}
                    disabled={isDeleting}
                  >
                    {isDeleting ? <i className="pi pi-spin pi-spinner"></i> : <HiOutlineTrash />} Delete User
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Render the DeleteUserModal */}
      <DeleteUserModal
        isOpen={showDeleteUserPopup}
        onClose={() => { setShowDeleteUserPopup(false); setDeleteUserData({ name: '', uid: '' }); }}
        onConfirm={onDeleteUser}
        userName={deleteUserData.name}
        loading={isDeleting}
      />
    </div>
  );
};

export default UserDetails;