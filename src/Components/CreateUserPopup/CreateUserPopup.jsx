import React, { useState } from "react";
import "./style.css";
import { useApi } from "../../Api/apiProvider";
import toast from "react-hot-toast";
import 'primeicons/primeicons.css'; // Make sure this is imported in your project somewhere

const CreateUserPopup = ({ onClose, fetchUserList }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const { post } = useApi();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await post(
        "https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/adminCreateUser",
        formData
      );
      console.log(response);
      if (response.status === 201) {
        await fetchUserList();
        toast.success(response.data.message);
        onClose();
      }
    } catch (err) {
      toast.error(err.response.data.error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Create User</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </label>

          <label>
            Role:
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <div className="popup-buttons">
            <button type="submit" className="add-user-btn" disabled={loading}>
              Create User
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
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPopup;
