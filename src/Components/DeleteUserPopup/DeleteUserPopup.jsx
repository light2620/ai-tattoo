
import "primeicons/primeicons.css"; 
import "./style.css";

const DeleteUserPopup = ({ onClose, onDelete, userName, loading }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container delete-popup">
        <h2>Delete User</h2>
        <p>
          Are you sure you want to delete <strong>{userName || "this user"}</strong>?
        </p>
        <div className="popup-buttons">
          <button
            className="btn btn-danger"
            onClick={onDelete}
            disabled={loading}
          >
            {loading && <i className="pi pi-spin pi-spinner spinner-icon"></i>}
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button className="btn btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserPopup;
