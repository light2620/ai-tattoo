import React, { useState } from "react";
import "./style.css";
import { useApi } from "../../Api/apiProvider";
import { useUser } from "../../Context/userContext";
import toast from "react-hot-toast";
import 'primeicons/primeicons.css';

const EditUserPopup = ({ onClose, editUserData, setEditUserData, fetchUserList }) => {
  const [loading, setLoading] = useState(false);
  const { post } = useApi();
  const { role } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((prev) => ({
      ...prev,
      updates: {
        ...prev.updates,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await post(
        `https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/updateAIUser`,
        {
          uid: editUserData.uid,
          updates: {
            displayName: editUserData.updates.userName,
            phoneNumber: editUserData.updates.phoneNumber,
            role: editUserData.updates.role,
          },
        }
      );

      if (response.status === 200) {
        onClose();
        toast.success("User updated successfully");
        await fetchUserList();
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container-create">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="userName"
              value={editUserData.updates.userName}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </label>

          {role !== "admin" && (
            <label>
              Phone no.:
              <input
                type="number"
                name="phoneNumber"
                value={editUserData.updates.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </label>
          )}

          {role === "admin" && (
            <label>
              Role:
              <select name="role" value={editUserData.updates.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          )}

          <div className="popup-buttons-create">
            <button type="submit" className="add-user-btn" disabled={loading}>
              Update User
              {loading && (
                <i
                  className="pi pi-spin pi-spinner"
                  style={{
                    marginLeft: "8px",
                    color: "white",
                    fontSize: "1.2rem",
                    verticalAlign: "middle",
                  }}
                />
              )}
            </button>
            <button type="button" className="cancel-btn-create" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPopup;
