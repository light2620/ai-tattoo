import { useEffect, useState } from "react";
import "./style.css";
import { useApi } from "../../../Api/apiProvider";
import CreateUserPopup from "../../../Components/CreateAndEditUserPopup/CreateUserPopup";
import DeleteUserPopup from "../../../Components/DeleteUserPopup/DeleteUserPopup";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import EditUserPopup from "../../../Components/CreateAndEditUserPopup/EidtUserPopup";
const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showEditUserPopup, setEditUserPopup] = useState(false);
  const [showDeleteUserPopup, setShowDeleteUserPopup] = useState(false)
  const [editUserData, setEditUserData] = useState({
    uid: "",
    updates: {}
  })
  const [deleteUserData, setDeleteUserData] = useState({
    name: "",
    uid: ""
  })
  const { post } = useApi();

  async function fetchUserList() {
    try {
      setLoading(true);
      const response = await post(
        "https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/listAllAIUsers"
      );

      if (response.status === 200) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  async function onDelete() {
    try {
      setLoading(true);
      const response = await post(`https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/deleteAIUser?uid=${deleteUserData.uid}`)
      if (response.status === 200) {
        toast.success(response.data.message);
        setDeleteUserData({
          name: "",
          uid: ""
        })
        setShowDeleteUserPopup(false);
        setLoading(false);
        await fetchUserList();
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserList();
  }, []);


  return (
    <div className="user-page">
      <button
        className="create-user-btn"
        onClick={() => {
          console.log("Pop-up opens")
          setShowCreatePopup(true)
        }}
      >
        Create User
      </button>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th># Images Generated</th>
            <th>Credit Left</th>
            <th>Phone Number</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                Loading users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No users found.
              </td>
            </tr>
          ) : (
            users.map(
              ({
                uid,
                displayName,
                email,
                role,
                status,
                generateImages,
                creditScore,
                phoneNumber,
              }) => (
                <tr key={uid}>
                  <td>{displayName || "-"}</td>
                  <td>{email || "-"}</td>
                  <td>{role || "-"}</td>
                  <td>{status || "-"}</td>
                  <td>{generateImages ? generateImages.length : 0}</td>
                  <td>{creditScore !== undefined ? creditScore : "-"}</td>
                  <td>{phoneNumber || "-"}</td>
                  <td className="action">
                    <span
                      className="delete-user"
                      onClick={() => {
                        setShowDeleteUserPopup(true);
                        setDeleteUserData({
                          name: displayName,
                          uid,
                        })
                      }}>
                      <MdDelete size={25} />
                    </span>

                    <span
                      className="edit-user"
                      onClick={() => {
                        setEditUserData({
                          uid,
                          updates: {
                            userName: displayName || "",
                            phoneNumber: phoneNumber || "",
                            role: role || "user",
                          }
                        });
                        setEditUserPopup(true);
                      }}
                    >
                      <FaEdit size={23} />
                    </span>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>


      {showCreatePopup && (
        <CreateUserPopup
          onClose={() => setShowCreatePopup(false)}
          fetchUserList={fetchUserList}
        />
      )}

      {
        showDeleteUserPopup &&
        <DeleteUserPopup
          userName={deleteUserData.name}
          onDelete={() => {
            onDelete()
          }}
          onClose={() => {
            setShowDeleteUserPopup(false);
          }}
          loading={loading}
        />
      }

      {
        showEditUserPopup &&
        <EditUserPopup
          editUserData={editUserData}
          setEditUserData={setEditUserData}
          fetchUserList={fetchUserList}
          onClose={() => setEditUserPopup(false)}
        />
      }

    </div>
  );
}

export default User;
