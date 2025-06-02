import React from 'react';
import Spinner from '../../utils/Spinner/Spinner';
import { FaCheckCircle, FaTimesCircle, FaThumbsUp } from 'react-icons/fa'; // FaThumbsUp for success, FaTimesCircle for failure
import './style.css';

const PaymentStatusModal = ({ isOpen, status, message, planName }) => {
  if (!isOpen) {
    return null;
  }

  let iconComponent;
  let statusClass = '';

  switch (status) {
    case 'loading':
      iconComponent = <Spinner />;
      statusClass = 'loading';
      break;
    case 'success':
      iconComponent = <FaThumbsUp className="status-icon success" />;
      statusClass = 'success';
      break;
    case 'failure':
      iconComponent = <FaTimesCircle className="status-icon failure" />;
      statusClass = 'failure';
      break;
    default:
      iconComponent = <Spinner />; // Default to loading if status is unknown
      statusClass = 'loading';
  }

  return (
    <div className="payment-status-modal-overlay">
      <div className={`payment-status-modal-content ${statusClass}`}>
        <div className="modal-icon-container">
          {iconComponent}
        </div>
        <p className="modal-message">{message}</p>
      </div>
    </div>
  );
};

export default PaymentStatusModal;