// Plans.js
import { useState, useEffect, useMemo } from "react";
import "./style.css"; // New CSS file for Plans page
import { useApi } from "../../../Api/apiProvider"; 
import toast from "react-hot-toast";
import { IoMdAdd } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
// import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"; // If pagination needed later
import Spinner from "../../../utils/Spinner/Spinner";
import AddEditPlanModal from "../../../Components/Modals/PlanEditAndDeleteModals/AddEditPlanModal";
import DeletePlanModal from "../../../Components/Modals/PlanEditAndDeleteModals/DeletePlanModal";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [actionLoading, setActionLoading] = useState(false); 

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingPlanData, setEditingPlanData] = useState(null); 

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState(null); // { id, name }

  const { get, post } = useApi(); 

  async function fetchPlans() {
    setLoading(true);
    try {
      const response = await get( 
        "https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/getPlans"
      );
      if (response.status === 200 && response.data) {
        setPlans(response.data.plans || []); 
        
      } else {
        toast.error("Failed to fetch plans.");
        setPlans([]);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
      toast.error("An error occurred while fetching plans.");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenAddModal = () => {
    setEditingPlanData(null); 
    setShowAddEditModal(true);
  };

  const handleOpenEditModal = (plan) => {
    setEditingPlanData(plan);
    setShowAddEditModal(true);
  };

  const handleOpenDeleteModal = (plan) => {
    setDeletingPlan({ id: plan.id, planName: plan.planName });
    setShowDeleteModal(true);
  };

  const handleSavePlan = async (planData) => {
    setActionLoading(true);
    const isEditMode = !!planData.id;
    const endpoint = isEditMode
      ? "https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/updatePlan"
      : "https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/addPlan";

    try {
      const response = await post(endpoint, planData);
      if (response.status === 200 || response.status === 201) {
        toast.success(`Plan ${isEditMode ? "updated" : "added"} successfully!`);
        setShowAddEditModal(false);
        fetchPlans(); // Refresh list
      } else {
        toast.error(response.data?.message || `Failed to ${isEditMode ? "update" : "add"} plan.`);
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} plan:`, err);
      toast.error(err.response?.data?.message || "An error occurred.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPlan || !deletingPlan.id) return;
    setActionLoading(true);
    try {
      const response = await post(
        "https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/deletePlan",
        { id: deletingPlan.id }
      );
      if (response.status === 200) {
        toast.success("Plan deleted successfully!");
        setShowDeleteModal(false);
        fetchPlans(); // Refresh list
      } else {
        toast.error(response.data?.message || "Failed to delete plan.");
      }
    } catch (err) {
      console.error("Error deleting plan:", err);
      toast.error(err.response?.data?.message || "An error occurred.");
    } finally {
      setActionLoading(false);
      setDeletingPlan(null);
    }
  };

  const formatCurrency = (num) => {
    if (typeof num !== 'number') return "-";
    return `$${num.toFixed(2)}`;
  };

  const ensureUrlProtocol = (url) => {
    if (!url) return "#";
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`; // Default to https
  }

  return (
    <div className="plans-page-container">
      <div className="plans-header">
        <div className="plans-header-left">
          <h1>Plans</h1>
    
        </div>
        <button
          className="new-plan-button"
          onClick={handleOpenAddModal}
        >
          <IoMdAdd size={20} /> New plan
        </button>
      </div>

      <div className="plans-content-card">
        {/* Filters could go here if needed in the future */}
        <div className="plans-table-wrapper">
          <table className="plans-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Purchase URL</th>
                <th>Credit Score</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="table-message spinner-cell">
                    <Spinner />
                  </td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan="5" className="table-message">
                    No plans found.
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id}>
                    <td>{plan.planName || "-"}</td>
                    <td>
                        <a href={ensureUrlProtocol(plan.purchaseUrl)} target="_blank" rel="noopener noreferrer">
                            {plan.purchaseUrl || "-"}
                        </a>
                    </td>
                    <td>{plan.creditScore !== undefined ? plan.creditScore : "-"}</td>
                    <td>{formatCurrency(plan.amount)}</td>
                    <td className="actions-cell">
                      <button
                        className="action-button"
                        onClick={() => handleOpenEditModal(plan)}
                        aria-label="Edit plan"
                      >
                        <FiEdit3 size={18} />
                      </button>
                      <button
                        className="action-button delete-action-icon"
                        onClick={() => handleOpenDeleteModal(plan)}
                        aria-label="Delete plan"
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination could go here if needed */}
      </div>

      <AddEditPlanModal
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        planData={editingPlanData}
        onSave={handleSavePlan}
        loading={actionLoading}
      />

      <DeletePlanModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        planName={deletingPlan?.planName}
        loading={actionLoading}
      />
    </div>
  );
};

export default Plans;