// CheckUserRoleUtils.js
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from './config';

const accessToken = Cookies.get('accessToken');

const refreshAccessToken = async () => {
  const baseUrl = BASE_URL;
  try {
    console.log('Fetching token refresh...');
    const refreshToken = Cookies.get('refreshToken');
    const response = await axios.post(`${baseUrl}/auth/token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    Cookies.set('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};
const fetchUserData = async () => {
  
  const baseUrl = BASE_URL;

  try {
    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
      const response = await axios.get(`${baseUrl}/auth/user/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Use userData instead of profile
      const userData = response.data;
      return userData;
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

// useEffect(() => {
//   // fetchUserData();
//   // refreshAccessToken()
//   // fetchUserData()
//   // checkUserRole()
// }, [accessToken]);

const checkUserRole = async () => {
  try {
    const baseUrl = BASE_URL;
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      return 'anonymous';
    }
    console.log('Checking user role...');
    // Make a request to your API to get user data (you need to implement this API endpoint)
    const user = await fetchUserData(baseUrl, accessToken);
    // Assuming your API returns user role as 'superuser' or 'regular'
    const userRole = user.user.role;
    console.log('User Role:', userRole);
    // Notify the user about the assigned role
    notifyUserAboutRole(userRole);
    return userRole;
  } catch (error) {
    console.error('Error checking user role:', error);
    return 'anonymous';
  }
};

const notifyUserAboutRole = (userRole) => {
  // Here you can implement your notification mechanism
  // For example, you can use a library like react-toastify to show a notification
  // or update the state in a higher-level component to display a notification banner
  // with the assigned role.
  console.log(`You have been assigned the role: ${userRole}`);
  // Implement your notification logic here
};

export { refreshAccessToken, fetchUserData, checkUserRole };
