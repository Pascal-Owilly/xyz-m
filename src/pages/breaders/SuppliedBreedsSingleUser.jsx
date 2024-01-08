import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../auth/config';

const SuppliedBreedsSingleUser = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [localSuppliesData, setLocalSuppliesData] = useState(null);
  const [user, setUser] = useState({ id: 123 }); // Replace with actual user data
  const [accessToken, setAccessToken] = useState('accessToken'); // Replace with actual access token

  const baseUrl = BASE_URL; // Replace with your actual base URL

  const fetchUserSupplies = async () => {
    try {
      if (!user || !user.id || !accessToken) {
        console.error('User, user id, or access token is undefined');
        return;
      }

      const response = await axios.get(`${baseUrl}/api/breader-trade/${user.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Response Data:', response.data);

      setLocalSuppliesData(response.data);
    } catch (error) {
      console.error('Error fetching supplies data:', error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      console.log('fetching token refresh ... ');
  
      const refreshToken = Cookies.get('refreshToken'); // Replace with your actual cookie name
  
      const response = await axios.post(`${baseUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      });
  
      const newAccessToken = response.data.access;
      setAccessToken(newAccessToken);
  
      // Fetch user data using the new access token
      await fetchUserData();
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // Handle the error, e.g., redirect to the login page
    }
  };
  
  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');

      if (accessToken) {
        const response = await axios.get(`${baseUrl}/auth/user/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userProfile = response.data;
        setUser(userProfile); // Set the user object in the state
      }
    } catch (error) {
      // Check if the error indicates an expired access token
      if (error.response && error.response.status === 401) {
        // Attempt to refresh the access token
        await refreshAccessToken();
      } else {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserSupplies();
    setShowDetails(true);
  }, [user, accessToken]);

  if (!localSuppliesData || !showDetails) {
    return (
      <div className='main-container'>
        <p>No data available</p>
      </div>
    );
  }

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    cursor: 'pointer',
  };

  const tableStyle = {
    borderCollapse: 'collapse',
    margin: '20px 0',
    display: showDetails ? 'table' : 'none',
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#333',
    width: '40%',
  };

  const valueStyle = {
    // width: '60%',
  };

  return (
    <div className='main-container' style={{ textAlign: 'left', marginBottom: '20px', minHeight: '85vh' }}>
      <h3 className='text-success mt-3 mb-3'>Supplied Breeds to the Abattoir</h3>
      <div style={cardStyle} onClick={() => setShowDetails(!showDetails)}>
        <h4>{localSuppliesData.breed}</h4>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={tdStyle}><span style={labelStyle}> Date Supplied:</span></td>
              <td style={{ ...tdStyle, ...valueStyle }}>{new Date(localSuppliesData.transaction_date).toLocaleString()}</td>
            </tr>
            <tr>
              <td style={tdStyle}><span style={labelStyle}>Name of breed:</span></td>
              <td style={{ ...tdStyle, ...valueStyle }}>{localSuppliesData.breed}</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuppliedBreedsSingleUser;
