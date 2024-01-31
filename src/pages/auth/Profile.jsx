import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from './config';
import defaultIng from '../../../images/profile.webp';
import { checkUserRole } from './CheckUserRoleUtils'; 
import { useNavigate } from 'react-router-dom';
const Profile = () => {
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState(null);
  const baseUrl = BASE_URL;
  const accessToken = Cookies.get('accessToken'); // Get the authentication token from cookies
  const [userRole, setUserRole] = useState('loading'); // Initialize with 'loading'



  useEffect(() => {
     // Check if accessToken is available
     if (!accessToken) {
      // No accessToken, navigate to home page
      navigate('/');
      return;
    }
    // Check user role and update state
    checkUserRole().then((role) => {
      setUserRole(role);
    })
    }, []);

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
    <div className='' style={{
      background: 'rgb(248, 250, 251)', 
      color: '#111',
      padding: '5px',
      minHeight: '100vh',
    }}>
    <div className='main-container' style={{
    width: '100%',
    backgroundColor: 'rgb(249, 250, 251)', // Corrected syntax for rgb
    color: 'rgb(153, 153, 153)' // Corrected syntax for rgb
  }}>
    <div 
    
  >
    <div className='container'>
      

    <hr />

      <div className='row'>
  
      <div className='col-md-4'>
     

      <img src={defaultIng} className='img img-rounded'  alt="Profile" />
    </div>
    <div className='col-md-8'>
        {userProfile && userProfile.user ? (
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: '#fff',
          borderRadius: '8px',
          padding: '5px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          // marginTop:'10vh'

        }}
      >
        <div style={{ display: '', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              {/* Profile Name */}

              {/* Role */}
              <h2 style={{ fontSize: '18px', marginRight: '', fontWeight: 'bold', color: 'black' }}>
  Role: {userProfile.user.role ? userProfile.user.role.charAt(0).toUpperCase() + userProfile.user.role.slice(1) : 'No Role'}
</h2>            </div>
<table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #ddd', borderRadius: '5px' }}>
          <tbody>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
      <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Username:</td>
      <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{userProfile.user.username}</td>
    </tr>
           <tr>
      <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email:</td>
      <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{userProfile.user.email}</td>
    </tr>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left' }}>First Name:</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{userProfile.user.first_name}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Last Name:</td>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{userProfile.user.last_name}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left' }}>Market:</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{userProfile.user.market}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left' }}>Community:</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{userProfile.user.community}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', textAlign: 'left' }}>County:</td>
              <td style={{ padding: '10px', textAlign: 'left' }}>{userProfile.user.county}</td>
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
  </div>
   );
};

export default Profile;
