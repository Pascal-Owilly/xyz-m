import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from './config';
import defaultIng from '../../../images/default.png'; 

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const baseUrl = BASE_URL;
  const accessToken = Cookies.get('accessToken'); // Get the authentication token from cookies

  const refreshAccessToken = async () => {
    try {
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
        setUserProfile(userProfile);
        console.log('user profile', userProfile)
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
    fetchUserData();
  }, []);

  return (
    <div className='main-container'>
    <div 
    style={{
      background: 'linear-gradient(to right, #4caf50, #2196f3)', // Green to Blue gradient
      color: '#111',
      padding: '5px',
      minHeight: '100vh',
      
    }}
  >
    <div className='container-fluid'>
      <div className='row'>
      <div className='col-md-4 d-flex justify-content-center align-items-center' style={{ marginTop: '10vh', borderRadius: '15px', height:'10vh' }}>
      <img src={defaultIng} className='img img-rounded' style={{ marginTop: '7vh', borderRadius: '100%' }} alt="Profile" />
    </div>
        <div className='col-md-8'>
        {userProfile && userProfile.user ? (
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'transparent',
          borderRadius: '8px',
          padding: '5px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          marginTop:'10vh'

        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              {/* Profile Name */}
              <h1 style={{ textTransform: 'capitalize', fontSize: '24px', margin: 0 }}>
                {userProfile.user.username}'s Profile
              </h1>
              {/* Role */}
              <h2 style={{ fontSize: '18px', marginRight: '2rem' }}>Role: {userProfile.user.groups} Breeder</h2>
            </div>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left' }}>Email:</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{userProfile.user.email}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left' }}>First Name:</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{userProfile.user.first_name}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left' }}>Last Name:</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{userProfile.user.last_name}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left' }}>Community:</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{userProfile.user.community}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left' }}>Country:</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{userProfile.user.country}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left' }}>Head of Family:</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{userProfile.user.head_of_family ? 'Yes' : 'No'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    ) : (
      <p>Loading...</p>
    )}
        </div>
      </div>
    </div>
   
  </div> 
  </div>
   );
};

export default Profile;
