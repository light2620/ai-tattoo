import React, { useState } from 'react';
import './style.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom'; 
import { useUser } from '../../Context/userContext';
const SignIn = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })


  const { login, loading } = useUser();

  const handleLogin = (e) => {
    e.preventDefault();

    login(credentials, setCredentials);

  };

  return (
   
      <form onSubmit={handleLogin} className="auth-panel">
        <h1 className="auth-heading">Sign-In</h1>
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

        <div className="auth-inputs">
          <label htmlFor="login-password">Password</label>
          <input
            className="auth-input"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            id="login-password"
            name='password'
            required
          />
        </div>
        </div>


        <div className="auth-links">
          <Link to="/signup" className="auth-link">Sign Up</Link>
          <span className="divider">|</span>
          <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
        </div>

        <button type="submit" disabled={loading} className="auth-btn">
          <span>Login</span>
          {loading && <i className="pi pi-spin pi-spinner"></i>}
        </button>

      </form>
 
  );
};

export default SignIn;
