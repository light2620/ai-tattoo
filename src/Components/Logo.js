import React from 'react';
import '../Styles/Logo.css';
import logo from '../Assets/Logo.png';
import { useNavigate } from 'react-router-dom';
export default function Logo() {
    const navigate = useNavigate();
    return (
        <div className="logo-container">
           <img src={logo} alt="logo" onClick={() => navigate('/dashboard')} />
        </div>
    )
}