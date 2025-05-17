import React, { useState } from 'react';
import './style.css';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom'; // for routing
import { useUser } from '../../Context/userContext';
const ForgotPassword = () => {
   const [ credentials, setCredentials ] = useState({
          email: ""
      })
  const { resetPassword,loading} = useUser(); 
  
  function handleLogin(e) {
    e.preventDefault();
    resetPassword(credentials,setCredentials);
  }

  return (
    <div className="login">
      <form onSubmit={handleLogin} className="login-panel">
        <h1 className="forgot-password-heading">Forgot Password</h1>
        <div className="lab-inp-container">
          <label htmlFor="login-email">Email</label>
          <InputText
            className="input"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            id="login-email"
            name='email'
            required
          />
        </div>
        <div>
            <Link className="auth-link" to="/signin">Back to Sign In</Link>
        </div>
        <Button type="submit" disabled={loading} className="auth-btn">
                  {loading && <i className="pi pi-spin pi-spinner"></i>}
                  <span>Submit</span>
                </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
