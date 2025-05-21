
import 'primeicons/primeicons.css';

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

      <form onSubmit={handleLogin} className="auth-panel">
        <h1 className="auth-heading">Sign Up</h1>
      <div className="auth-input-container">
       <div className="auth-inputs">
          <label htmlFor="name">Name</label>
          <input
            className="auth-input"
            type="text"
            value={credentials.name}
            onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
            id="name"
            name='name'
            required
          />
        </div>
        <div className="auth-inputs">
          <label htmlFor="email">Email</label>
          <input
            className="auth-input"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value }   )}
            id="email"
            name='email'
            required
          />
        </div>

        <div className="auth-inputs">
          <label htmlFor="password">Password</label>
          <input
            className="auth-input"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            id="password"
            name='password'
            required
          />
        </div>
      </div>
        

        <div className="auth-links">
          <p >Already have a account?<Link to="/signin"  className="auth-link"> Sign In</Link></p>
        </div>

        <button type="submit" disabled={loading} className="auth-btn">
          <span>{loading ? "Submitting" : "Sign up"}</span>
          {loading && <i className="pi pi-spin pi-spinner"></i>}
        </button>
      </form>

  )
}

export default SignUp
