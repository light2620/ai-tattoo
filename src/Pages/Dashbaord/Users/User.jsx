
import { useEffect, useState, useMemo } from "react";
import "./style.css";
import { useApi } from "../../../Api/apiProvider";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

import { IoMdAdd } from "react-icons/io";
import { FiSearch, FiEdit3 } from "react-icons/fi";

import { MdDelete } from "react-icons/md"; 
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import Spinner from "../../../utils/Spinner/Spinner";
import EditUserModal from "../../../Components/Modals/EditAndDeleteUserModals/EditUserModal";
import DeleteUserModal from "../../../Components/Modals/EditAndDeleteUserModals/DeleteUserModal";


const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); 
  const [showEditUserPopup, setEditUserPopup] = useState(false);
  const [showDeleteUserPopup, setShowDeleteUserPopup] = useState(false);
  const navigate = useNavigate();
  const [editUserData, setEditUserData] = useState(null);
  const [deleteUserData, setDeleteUserData] = useState({
    name: "",
    uid: "",
  });
  const { post } = useApi();

  const [activeTab, setActiveTab] = useState("All");
  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  async function fetchUserList() {
    setLoading(true);
    try {
      const response = await post(
        "https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/listAllAIUsers"
      );
      if (response.status === 200) {
        setUsers(response.data.users || []);

      } else {
        toast.error("Failed to fetch users.");
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching user list:", err);
      toast.error("An error occurred while fetching users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function onDeleteUser() {
    setActionLoading(true); 
    try {
      const response = await post(
        `https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/deleteAIUser?uid=${deleteUserData.uid}`
      );
      if (response.status === 200) {
        toast.success(response.data.message || "User deleted successfully.");
        setShowDeleteUserPopup(false);
        setDeleteUserData({ name: "", uid: "" });
        
        await fetchUserList();
      } else {
        toast.error(response.data.message || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("An error occurred while deleting the user.");
    } finally {
      setActionLoading(false);
    }
  }

  useEffect(() => {
    fetchUserList();
  }, []);

  const processedUsers = useMemo(() => {
    let filtered = Array.isArray(users) ? [...users] : [];
    if (activeTab !== "All") {
      filtered = filtered.filter(
        (user) => user.status && user.status.toLowerCase() === activeTab.toLowerCase()
      );
    }
    if (selectedRole) {
     
      filtered = filtered.filter((user) => user.role === selectedRole.toLocaleLowerCase());
  
    }
    if (searchQuery) {
      const lowerSearchQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          (user.displayName && user.displayName.toLowerCase().includes(lowerSearchQuery)) ||
          (user.email && user.email.toLowerCase().includes(lowerSearchQuery)) ||
          (user.phoneNumber && user.phoneNumber.includes(lowerSearchQuery))
      );
    }
    return filtered;
  }, [users, activeTab, selectedRole, searchQuery]);

  const totalPages = Math.ceil(processedUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsersToDisplay = processedUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Pagination handlers (handlePaginate, handleNextPage, handlePrevPage) remain the same

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleEditModalOpen = (user) => {
    setEditUserData({ 
      uid: user.uid,
      email: user.email, 
      status: user.status, 
      updates: { 
        userName: user.displayName || "",
        phoneNumber: user.phoneNumber || "",
        role: user.role || "user",
      }
    });
    setEditUserPopup(true);
  };

  const handleDeleteConfirmation = (user) => {
    setDeleteUserData({
      name: user.displayName || "this user",
      uid: user.uid,
    });
    setShowDeleteUserPopup(true);
  };

  return (
    <div className="users-page-container">
      <div className="users-header">
        <div className="users-header-left">
          <h1>Users</h1>
          <div className="breadcrumbs">Dashboard / Users</div>
        </div>
        <button
          className="new-user-button"
          onClick={() => navigate('new')} 
        >
          <IoMdAdd size={20} /> New user
        </button>
      </div>

      <div className="users-content-card">
        {/* Filters and Tabs remain the same */}
        <div className="users-controls">
          <div className="tabs">
            {["All", "Active", "Pending"].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                onClick={() => { setActiveTab(tab); setCurrentPage(1);}}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="filters">
            <div className="role-filter">
              <select
                value={selectedRole}
                onChange={(e) => {setSelectedRole(e.target.value); setCurrentPage(1);}}
              >
                <option value="">Role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="search-filter">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
              />
            </div>
          </div>
        </div>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="table-message spinner-cell">
                    <Spinner />
                  </td>
                </tr>
              ) : currentUsersToDisplay.length === 0 ? (
                <tr>
                  <td colSpan="5" className="table-message">
                    No users found.
                  </td>
                </tr>
              ) : (
                currentUsersToDisplay.map((user) => (
                  <tr key={user.uid}>
                    <td>
                      <div className="user-name">{user.displayName || "-"}</div>
                      <div className="user-email">{user.email || "-"}</div>
                    </td>
                    <td>{user.phoneNumber || "-"}</td>
                    <td>{user.role || "-"}</td>
                    <td>
                      <span
                        className={`status-badge status-${(user.status || "").toLowerCase()}`}
                      >
                        {user.status || "-"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-button"
                        onClick={() => handleEditModalOpen(user)} // Updated handler
                        aria-label="Edit user"
                      >
                        <FiEdit3 size={18} />
                      </button>
                      <button
                        className="action-button delete-action-icon" // Added class for specific styling if needed
                        onClick={() => handleDeleteConfirmation(user)}
                        aria-label="Delete user"
                      >
                        <MdDelete size={18} /> {/* Changed Icon */}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination controls remain the same */}
        { !loading && processedUsers.length > usersPerPage && (
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1} aria-label="Previous page">
            <MdKeyboardArrowLeft size={24} />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} aria-label="Next page">
            <MdKeyboardArrowRight size={24} />
          </button>
        </div>
        )}
      </div>

      <EditUserModal
        isOpen={showEditUserPopup}
        onClose={() => { setEditUserPopup(false); setEditUserData(null);}}
        userData={editUserData}
        fetchUserList={fetchUserList}
        // loading prop is handled internally by EditUserModal
      />

      <DeleteUserModal
        isOpen={showDeleteUserPopup}
        onClose={() => { setShowDeleteUserPopup(false); setDeleteUserData({name: '', uid: ''})}}
        onConfirm={onDeleteUser}
        userName={deleteUserData.name}
        loading={actionLoading} // Use actionLoading for modal button state
      />
    </div>
  );
};

export default User;