import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from './auth/config';

import { FaCheckCircle, FaMoneyBill, FaShieldAlt, FaUsers, FaCogs } from "react-icons/fa";
import { checkUserRole } from "./auth/CheckUserRoleUtils";
const HomeContent = () => {
  const baseUrl = BASE_URL;

  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchUserData(); // Fetch user data when the component mounts
    fetchUserRole(); // Fetch user role when the component mounts
  }, []);

  const fetchUserRole = async () => {
    try {
      const role = await checkUserRole();
      setUserRole(role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      console.log('fetching token refresh ... ')

      const refreshToken = Cookies.get('refreshToken'); // Replace with your actual cookie name
  
      const response = await axios.post(`${baseUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      });
  
      const newAccessToken = response.data.access;
      // Update the stored access token
      Cookies.set('accessToken', newAccessToken);
      // Optional: You can also update the user data using the new access token
      await fetchUserData();
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // Handle the error, e.g., redirect to login page
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
        setProfile(userProfile);
        setUsername(userProfile.user.first_name + " " + userProfile.user.last_name); // Set the username
        // console.log('user profile', userProfile.user.first_name)
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

  const renderRoleNotification = () => {
    if (userRole === 'No role') {
      return (
        <div>
          <p className='text-center mx-auto' style={{width:'60%'}}>
            You currently have no role. Please be patient as we assign you a role.
            If you feel there's an issue with your session, please contact us{' '}
            <a href="/contact">here</a>.
          </p>
        </div>
      );
    }
    // You can add an else block or handle other cases if needed
  };


  return (
    <>
      <div className="main-container" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        <div style={{ width: '97%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        {/* Display user role and greeting */}
      {userRole && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E8B57' }}>{`Welcome, ${username}!`} 
          {/* <span className='mx-3' style={{ fontSize: '20px', color: '#2E8B57' }}>Role: {userRole}</span> */}
          </p>
        </div>
      )}
            {renderRoleNotification()}

          <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>

            <h3 style={{ marginBottom: '20px', color: '#2E8B57', textAlign: 'left' }}>Are You a Breeder?</h3>
            <ul className="p-3" style={{ fontSize: '16px', lineHeight: '1.6' }}>
              <li style={{ marginBottom: '20px' }}>
                <FaCheckCircle style={{ color: '#2E8B57', marginRight: '10px' }} />
                Supply breeds to XYZ abattoir and get paid seamlessly.
              </li>
              <li style={{ marginBottom: '20px' }}>
                <FaShieldAlt style={{ color: '#2E8B57', marginRight: '10px' }} />
                Secure authentication for the check-in of goats.
              </li>
              <li style={{ marginBottom: '20px' }}>
                <FaMoneyBill style={{ color: '#2E8B57', marginRight: '10px' }} />
                Integrated banking for swift and hassle-free payments.
              </li>
              <li style={{ marginBottom: '20px' }}>
                <FaUsers style={{ color: '#2E8B57', marginRight: '10px' }} />
                Be part of a transparent and efficient goat supply chain management system.
              </li>
              <li>
                <FaCogs style={{ color: '#2E8B57', marginRight: '10px' }} />
                Explore advanced features for effective breeding management.
              </li>
            </ul>
          </div>
          <br /><br />
          <a href='register' style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn btn-success btn-lg">
              Register Now
            </button>
          </a>
        </div>
      </div>
    </>
  );
};

export default HomeContent;
