// src/Pages/Dashbaord/ManagePlans/ManagePlansPage.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useApi } from '../../../Api/apiProvider';
import SlimPlanCard from '../../../Components/PlanCard/PlanCard';
import Spinner from '../../../utils/Spinner/Spinner';
import './style.css';
import toast from 'react-hot-toast';
import { useUser } from '../../../Context/userContext';
import { FaCheckCircle, FaExclamationCircle, FaGift, FaRedo } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setCredits } from '../../../Redux/creditSlice';
import PaymentStatusModal from '../../../Components/PaymentStatusModal/PaymentStatusModal';

const ManagePlansPage = () => {
  const { get, post } = useApi();
  const { user, fetchUserData } = useUser();
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalMessage, setPaymentModalMessage] = useState('');
  const [paymentModalStatus, setPaymentModalStatus] = useState('loading');
  const paymentCheckIntervalRef = useRef(null);
  const selectedPlanRef = useRef(null);
  const CHECKING_PAYMENT_BASE_MESSAGE = "Payment Processing....";

  useEffect(() => {
    if (user && user.subscription && user.subscription.planId) {
      setCurrentPlanId(user.subscription.planId);
    } else {
      setCurrentPlanId(null);
    }
  }, [user]);

  const currentPlanDetails = plans.find(p => p.id === currentPlanId);

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

  const stopPaymentCheck = useCallback(() => {
    if (paymentCheckIntervalRef.current) {
      clearInterval(paymentCheckIntervalRef.current);
      paymentCheckIntervalRef.current = null;
    }
  }, []);

  const checkPaymentStatus = useCallback(async () => {
    if (!selectedPlanRef.current) {
      console.error("No selected plan to check payment for. Stopping check.");
      stopPaymentCheck();
      setIsPaymentModalOpen(false);
      return;
    }

    try {
      const response = await post('https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/checkPaymentStatus');
      console.log("Payment status API response:", response);

      if (response.data && response.data.hasNewPayment && response.data.newPayments.length > 0) {
        const payment = response.data.newPayments[0];

        if (payment.payment_status === 'succeeded') {
          stopPaymentCheck();
          setPaymentModalStatus('success');
          setPaymentModalMessage(`Your subscription is now active!`);
          toast.success(`Successfully subscribed to ${selectedPlanRef.current.planName}!`);

          dispatch(setCredits(selectedPlanRef.current.creditScore));
          if (fetchUserData) {
            await fetchUserData();
          } else {
            setCurrentPlanId(selectedPlanRef.current.id);
          }

          setTimeout(() => {
            setIsPaymentModalOpen(false);
            setPaymentModalStatus('loading');
          }, 3000);
        } else if (payment.payment_status === 'failed' || payment.payment_status === 'canceled') {
          stopPaymentCheck();
          setPaymentModalStatus('failure');
          setPaymentModalMessage(`Payment ${payment.payment_status}. Please try again or contact support.`);
          toast.error(`Payment ${payment.payment_status}. Please try again.`);

          setTimeout(() => {
            setIsPaymentModalOpen(false);
            setPaymentModalStatus('loading');
          }, 4000);
        }
      }
    } catch (err) {
      console.error("Error calling checkPaymentStatus API:", err);
    }
  }, [post, stopPaymentCheck, dispatch, fetchUserData]);

  const handlePurchasePlan = (plan) => {
    if (!user || !user.displayName || !user.email) {
      toast.error("User details not available. Please log in again.");
      return;
    }
    if (plan.purchaseUrl) {
      selectedPlanRef.current = plan;
      setPaymentModalStatus('loading');
      setPaymentModalMessage(`${CHECKING_PAYMENT_BASE_MESSAGE}`);
      setIsPaymentModalOpen(true);

      const paymentWindow = window.open(`${plan.purchaseUrl}?full_name=${encodeURIComponent(user.displayName)}&email=${encodeURIComponent(user.email)}`, '_blank');

      if (paymentWindow) {
        stopPaymentCheck();
        checkPaymentStatus();
        paymentCheckIntervalRef.current = setInterval(checkPaymentStatus, 3000);
      } else {
        setIsPaymentModalOpen(false);
        toast.error("Could not open payment window. Please ensure pop-ups are not blocked.");
        selectedPlanRef.current = null;
      }
    } else {
      toast.error("Purchase URL not available for this plan.");
    }
  };

  useEffect(() => {
    return () => {
      stopPaymentCheck();
    };
  }, [stopPaymentCheck]);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'N/A';
    return new Date(timestamp._seconds * 1000).toLocaleDateString();
  };

  return (
    <div className="manage-plans-page-container">
      <PaymentStatusModal
        isOpen={isPaymentModalOpen}
        status={paymentModalStatus}
        message={paymentModalMessage}
        planName={selectedPlanRef.current?.planName}
      />

      <header className="page-header">
        <h1>Manage Your Plan</h1>
        <p>Review or change your current subscription.</p>
      </header>

      <section className="current-plan-section">
        <h2>Current Plan</h2>
        {loading ? (
          <div className="plan-loading">
            <Spinner />
          </div>
        ) : (
          <>
            {error && (
              <div className="error-message">
                <FaExclamationCircle /> {error}
                <button onClick={() => window.location.reload()} className="retry-button">
                  <FaRedo /> Retry
                </button>
              </div>
            )}
            {!error && currentPlanDetails && (
              <div className="plan-details">
                <div className="plan-info">
                  <span className="plan-name">{currentPlanDetails.planName} <FaCheckCircle className="success-icon" /></span>
                  <span>${currentPlanDetails.amount} / month</span>
                  <span>{currentPlanDetails.creditScore} Credits</span>
                  <span>Activated: {formatDate(currentPlanDetails.createdAt)}</span>
                </div>
              </div>
            )}
            {!error && !currentPlanDetails && (
              <div className="no-plan-message">
                <FaGift /> No active subscription.
              </div>
            )}
          </>
        )}
      </section>

      <section className="available-plans-section">
        <h2>Available Plans</h2>
        {loading ? (
          <div className="plans-loading">
            <Spinner />
          </div>
        ) : (
          <>
            {plans.length > 0 && (
              <div className="plan-grid">
                {plans.map((plan) => (
                  <SlimPlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={() => handlePurchasePlan(plan)}
                  />
                ))}
              </div>
            )}

            {plans.length === 0 && !loading && !error && currentPlanDetails && (
              <div className="no-plans-available">No other plans available at this time.</div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ManagePlansPage;