// src/Components/Modals/AddEditPlanModal.js
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import "primeicons/primeicons.css"
import "./style.css";

import "./style.css"


const AddEditPlanModal = ({ isOpen, onClose, planData, onSave, loading }) => {
  const isEditMode = !!planData;
  const initialFormState = {
    planName: '',
    purchaseUrl: '',
    creditScore: '',
    amount: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isEditMode && planData) {
      setFormData({
        planName: planData.planName || '',
        purchaseUrl: planData.purchaseUrl || '',
        creditScore: planData.creditScore !== undefined ? String(planData.creditScore) : '',
        // API expects number, form input expects number, display might include $
        amount: planData.amount !== undefined ? String(planData.amount) : '',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [isOpen, planData, isEditMode]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.planName.trim() || !formData.purchaseUrl.trim() || formData.creditScore === '' || formData.amount === '') {
      return toast.error('Please fill in all fields.');
    }
    if (isNaN(parseFloat(formData.creditScore)) || parseFloat(formData.creditScore) < 0) {
        return toast.error('Credit score must be a non-negative number.');
    }
    if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) < 0) {
        return toast.error('Amount must be a non-negative number.');
    }

    const saveData = {
      planName: formData.planName.trim(),
      purchaseUrl: formData.purchaseUrl.trim(),
      creditScore: parseInt(formData.creditScore, 10),
      amount: parseFloat(formData.amount),
    };

    if (isEditMode && planData.id) {
      saveData.id = planData.id;
    }
    onSave(saveData);
  };

  const ensureUrlProtocol = (url) => {
    if (!url) return "";
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`; // Default to https for new entries if no protocol
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content add-edit-plan-modal-content">
        <h2 className="modal-title">{isEditMode ? 'Edit Plan' : 'Add New Plan'}</h2>
        <form onSubmit={handleSubmit} className="plan-modal-form">
          <div className="form-group">
            <label htmlFor="planName">Plan Name</label>
            <input
              type="text"
              id="planName"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              placeholder="Enter plan name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="purchaseUrl">Purchase URL</label>
            <input
              type="text"
              id="purchaseUrl"
              name="purchaseUrl"
              value={formData.purchaseUrl}
              onChange={handleChange}
              placeholder="e.g., example.com/subscribe"
              required
              onBlur={(e) => { // Optionally auto-prefix URL
                const val = e.target.value;
                if (val && !val.startsWith('http://') && !val.startsWith('https://')) {
                    handleChange({target: {name: 'purchaseUrl', value: ensureUrlProtocol(val)}})
                }
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="creditScore">Credit Score</label>
            <input
              type="number"
              id="creditScore"
              name="creditScore"
              value={formData.creditScore}
              onChange={handleChange}
              placeholder="Enter credit score"
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g., 9.99"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-button cancel-button" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="modal-button update-button" disabled={loading}> {/* "update-button" class for consistent styling */}
              {loading ?<i className="pi pi-spin pi-spinner spinner-icon"> </i> : (isEditMode ? 'Save Changes' : 'Add Plan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditPlanModal;