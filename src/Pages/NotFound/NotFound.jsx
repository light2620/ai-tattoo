import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Style.css';

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">Oops! The page you're looking for doesn't exist.</p>
      <p className="notfound-message">Redirecting to home in {countdown} seconds...</p>
      <Link to="/" className="notfound-button">
        Go to Home
      </Link>
    </div>
  );
}
