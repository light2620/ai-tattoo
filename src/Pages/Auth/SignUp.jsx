import React from 'react'
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom'; 
import { useState } from 'react';   
import './style.css'
import { useUser } from '../../Context/userContext';
const SignUp = () => {
    const [ credentials, setCredentials ] = useState({
        name: "",
        email: "",
        password: ""
    })
    const { register,loading } = useUser();
    function handleLogin(e) {
        e.preventDefault()
        register(credentials, setCredentials);
     
    }
  return (
<div className="login">
      <form onSubmit={handleLogin} className="login-panel">
        <h1 className="heading">Sign Up</h1>
         
        <div className="lab-inp-container">
          <label htmlFor="name">Name</label>
          <InputText
            type="text"
            value={credentials.name}
            onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
            id="name"
            name='name'
            required
          />
        </div>
        <div className="lab-inp-container">
          <label htmlFor="email">Email</label>
          <InputText
            className="input"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value }   )}
            id="email"
            name='email'
            required
          />
        </div>

        <div className="lab-inp-container">
          <label htmlFor="password">Password</label>
          <InputText
            className="input"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            id="password"
            name='password'
            required
          />
        </div>

        <div className="auth-links">
          <p >Already have a account?<Link to="/signin"  className="auth-link"> Sign In</Link></p>
        </div>

        <Button type="submit" disabled={loading} className="auth-btn">
          {loading && <i className="pi pi-spin pi-spinner"></i>}
          <span>Sign up</span>
        </Button>
      </form>
    </div>
  )
}

export default SignUp
