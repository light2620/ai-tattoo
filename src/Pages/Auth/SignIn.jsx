import React, { useState } from 'react';
import './style.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom'; // for routing
import { useUser } from '../../Context/userContext';
const SignIn = () => {
   const [ credentials, setCredentials ] = useState({
          email: "",
          password: ""
      })
      

  const { login,loading} = useUser(); 
  
 const handleLogin = async (e) => {
  e.preventDefault();

    await login(credentials, setCredentials);
   
};

  return (
    <div className="login">
      <form onSubmit={handleLogin} className="login-panel">
        <h1 className="heading">Sign-In</h1>
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

        <div className="lab-inp-container">
          <label htmlFor="login-password">Password</label>
          <InputText
            className="input"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            id="login-password"
            name='password'
            required
          />
        </div>

        <div className="auth-links">
          <Link to="/signup" className="auth-link">Sign Up</Link>
          <span className="divider">|</span>
          <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
        </div>

        <Button type="submit" disabled={loading} className="login-btn">
  {loading && <i className="pi pi-spin pi-spinner"></i>}
  <span>{loading ? 'Logging In...' : 'LOGIN'}</span>
</Button>

      </form>
    </div>
  );
};

export default SignIn;
