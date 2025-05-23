// src/Components/PlanCard/SlimPlanCard.jsx
import React from 'react';
import './style.css'; // New CSS file for this card
import { FaArrowRight, FaDollarSign, FaRocket } from 'react-icons/fa';

const SlimPlanCard = ({ plan, onSelect }) => {
  if (!plan) return null;

  const { planName, amount, creditScore } = plan;

  return (
    <div className="slim-plan-card" onClick={() => onSelect(plan)} role="button" tabIndex="0" onKeyPress={(e) => e.key === 'Enter' && onSelect(plan)}>
      <div className="slim-plan-card-header">
        <h3 className="slim-plan-name">{planName}</h3>
      </div>
      <div className="slim-plan-card-body">
        <div className="slim-plan-detail price">
          <FaDollarSign className="detail-icon" />
          <span className="amount-value">${amount}</span>
          <span className="per-month">/ month</span>
        </div>
        <div className="slim-plan-detail credits">
          <FaRocket className="detail-icon" />
          <span>{creditScore} Credits</span>
        </div>
        {/* You can add a short feature list here if needed */}
        {/* <ul className="features-list">
          <li>Feature 1</li>
          <li>Feature 2</li>
        </ul> */}
      </div>
      <div className="slim-plan-card-footer">
        <button className="select-plan-button">
          Choose Plan <FaArrowRight className="arrow-icon"/>
        </button>
      </div>
    </div>
  );
};

export default SlimPlanCard;