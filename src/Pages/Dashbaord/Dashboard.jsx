import React, { useState, useEffect } from 'react';
import { useApi } from '../../Api/apiProvider';
import toast from 'react-hot-toast';
import './style.css'; // We'll create this
import Spinner from '../../utils/Spinner/Spinner';


const Card = ({ title, value, isLoading, illustration }) => (
  <div className="dashboard-stat-card">
    <div className="stat-card-info">
      <h3 className="stat-card-title">{title}</h3>
      {isLoading ? <Spinner size="small"/> : <p className="stat-card-value">{value}</p>}
    </div>
    {illustration && <div className="stat-card-illustration">{illustration}</div>}
  </div>
);



const DashboardPage = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { post } = useApi();

  useEffect(() => {
    const fetchTotalUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await post(
          "https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/listAllAIUsers"
        );
        if (response.status === 200 && response.data.users) {
          setTotalUsers(response.data.users.length);
        } else {
          toast.error("Failed to fetch user count.");
          setTotalUsers(0); // Set to 0 on error
        }
      } catch (err) {
        console.error("Error fetching user count:", err);
        toast.error("An error occurred while fetching user count.");
        setTotalUsers(0); // Set to 0 on error
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchTotalUsers();
  }, [post]);


 

  return (
    <div className="dashboard-page-content">
      <div className="dashboard-stats-grid">
    
      
        <Card
            title="Total Users"
            value={totalUsers}
            isLoading={loadingUsers}

        />
      </div>

    </div>
  );
};

export default DashboardPage;