import "primeicons/primeicons.css";
import '../style.css'; // We'll create this shared CSS

const DeleteUserModal = ({ isOpen, onClose, onConfirm, userName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal-content">
        <h2 className="modal-title">Delete</h2>
        <p className="modal-message">
          Are you sure you want to delete {userName ? `"${userName}"` : 'this user'}?
        </p>
        <div className="modal-actions">
          <button onClick={onClose} className="modal-button cancel-button" disabled={loading}>
            Cancel
          </button>
          <button onClick={onConfirm} className="modal-button delete-button" disabled={loading}>
            {loading ? <i className="pi pi-spin pi-spinner"></i> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;