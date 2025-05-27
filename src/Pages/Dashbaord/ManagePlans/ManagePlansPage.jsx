// src/Pages/Dashbaord/ManagePlans/ManagePlansPage.jsx
import React, { useEffect, useState } from 'react';
import { useApi } from '../../../Api/apiProvider';
import SlimPlanCard from '../../../Components/PlanCard/PlanCard'; // Renamed for clarity
import Spinner from '../../../utils/Spinner/Spinner';
import './style.css';
import toast from 'react-hot-toast';
import { useUser } from '../../../Context/userContext';
import { FaCheckCircle, FaExclamationCircle, FaGift, FaRedo, FaTimesCircle } from 'react-icons/fa'; // Example icons

const ManagePlansPage = () => {
  const { get } = useApi();
  const { user } = useUser();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPlanId, setCurrentPlanId] = useState("HP8Ca2LRPpk9UptgCygT"); // Static for example
  // useEffect(() => {
  //   if (user && user.subscription && user.subscription.planId) {
  //     setCurrentPlanId(user.subscription.planId);
  //   } else {
  //     setCurrentPlanId(null);
  //   }
  // }, [user]);

  const currentPlanDetails = plans.find(p => p.id === currentPlanId);
  const availablePlans = plans.filter(p => p.id !== currentPlanId);

  useEffect(() => {
    const fetchPlansData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await get('https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/getPlans');
        if (response.data && response.data.plans) {
          setPlans(response.data.plans);
        } else {
          throw new Error("Plans data not found in response");
        }
      } catch (err) {
        const errorMessage = err.message || "Could not fetch plans.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchPlansData();
  }, [get]);

  const handlePurchasePlan = (plan) => {
    
     window.open("https://app.cercus.app/v2/preview/2GKjR6WbRpwQ8SmMzvLe", '_blank');
    // if (plan.purchaseUrl) {
    //   window.open(plan.purchaseUrl, '_blank');
    // } else {
    //   toast.error("Purchase URL not available.");
    // }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'N/A';
    return new Date(timestamp._seconds * 1000).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="manage-plans-page-container is-loading">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="manage-plans-page-container">
      <header className="manage-plans-header">
        <h1>Manage Your Subscription</h1>
        <p>Review your current plan or explore other options available to you.</p>
      </header>

      <section className="current-plan-info-section">
        <h2>Current Subscription Details</h2>
        {error && (
            <div className="plan-message error">
                <FaExclamationCircle /> {error} <button onClick={() => window.location.reload()} className="retry-button"><FaRedo/> Retry</button>
            </div>
        )}
        {!error && currentPlanDetails && (
          <div className="current-plan-details">
            <div className="detail-item">
              <span className="detail-label">Plan Name:</span>
              <span className="detail-value plan-name-highlight">{currentPlanDetails.planName} <FaCheckCircle className="success-icon" /></span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Monthly Cost:</span>
              <span className="detail-value">${currentPlanDetails.amount}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Credits:</span>
              <span className="detail-value">{currentPlanDetails.creditScore} per month</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Activated On:</span>
              <span className="detail-value">{formatDate(currentPlanDetails.createdAt)}</span>
            </div>
            {/* Add more relevant details like next billing date, status, etc. */}
            <div className="plan-actions">
                {/* <button className="action-button cancel-plan">Cancel Subscription</button> */}
                {/* <button className="action-button view-billing">View Billing History</button> */}
            </div>
          </div>
        )}
        {!error && !currentPlanDetails && !loading && (
          <div className="plan-message info">
            <FaGift /> You currently do not have an active subscription. Choose a plan below to get started!
          </div>
        )}
      </section>

      {availablePlans.length > 0 && (
        <section className="available-plans-section">
          <h2>Explore Other Plans</h2>
          <div className="slim-plans-grid">
            {availablePlans.map((plan) => (
              <SlimPlanCard
                key={plan.id}
                plan={plan}
                onSelect={() => handlePurchasePlan(plan)}
              />
            ))}
          </div>
        </section>
      )}

      {availablePlans.length === 0 && !loading && !error && (
        <section className="no-other-plans-section">
          <p>There are no other plans available at this time.</p>
        </section>
      )}
    </div>
  );
};

export default ManagePlansPage;