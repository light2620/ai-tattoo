import React, { useState } from 'react';
import './style.css';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom'; // for routing
import { useUser } from '../../Context/userContext';
const ForgotPassword = () => {
  const [credentials, setCredentials] = useState({
    email: ""
  })
  const { resetPassword, loading } = useUser();

  function handleLogin(e) {
    e.preventDefault();
    resetPassword(credentials, setCredentials);
  }

  return (

    <form onSubmit={handleLogin} className="auth-panel">
      <h1 className="forgot-password-heading">Forgot Password</h1>
      <div className="auth-input-container">
        <div className="auth-inputs">
          <label htmlFor="login-email">Email</label>
          <input
            className="auth-input"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            id="login-email"
            name='email'
            required
          />
        </div>
      </div>

      <div className="auth-links">
        <Link className="auth-link" to="/auth/signin">Back to Sign In</Link>
      </div>
      <button type="submit" disabled={loading} className="auth-btn">
        {loading && <i className="pi pi-spin pi-spinner"></i>}
        <span>Submit</span>
      </button>
    </form>

  );
};

export default ForgotPassword;
