import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from './config'; // Make sure the path is correct
import { jwtDecode } from 'jwt-decode';

const baseUrl = BASE_URL;

const authService = {
  login: async (loginData) => {
    try {
      const response = await axios.post(`${baseUrl}/api/login/`, loginData);
      const tokens = response.data.tokens;

      // Decode the access token to get user details
      const decodedToken = jwtDecode(tokens.access);
      const user = {
        id: decodedToken.user_id,
        username: decodedToken.username,
        first_name: decodedToken.first_name,
        // Extract other user details from the decoded token
      };

      // Store tokens and user in cookies
      Cookies.set('accessToken', tokens.access, { expires: 10, sameSite: 'None', secure: true });
      Cookies.set('refreshToken', tokens.refresh, { expires: 30, sameSite: 'None', secure: true });
      Cookies.set('user', JSON.stringify(user), { expires: 10, sameSite: 'None', secure: true });

      // Return access token
      return tokens.access;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid username or password');
      } else {
        throw new Error('Login failed. Please try again later. If the issue persists please contact us');
      }
    }
  },

  getUser: () => {
    const accessToken = Cookies.get('accessToken'); // Ensure that accessToken is defined
    const userCookie = Cookies.get('user');

    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      console.log('Decoded Token:', decodedToken);
    }
    return userCookie ? JSON.parse(userCookie) : null;
  },

  refreshAccessToken: async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');

      if (!refreshToken) {
        throw new Error('Refresh token not found.');
      }

      const response = await axios.post(`${baseUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      // Update the stored access token
      Cookies.set('accessToken', newAccessToken, { expires: 10, sameSite: 'None', secure: true });

      // Optional: You can also update the user data using the new access token
      await fetchUserData();
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // Handle the error, e.g., redirect to login page
      throw error; // Propagate the error to the caller if needed
    }
  },

  fetchUserData: async () => {
    try {
      const accessToken = Cookies.get('accessToken');

      if (accessToken) {
        const response = await axios.get(`${baseUrl}/api/user/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userProfile = response.data;
        console.log('user profile', userProfile);
        return userProfile;
      }
    } catch (error) {
      // Check if the error indicates an expired access token
      if (error.response && error.response.status === 401) {
        // Attempt to refresh the access token
        await authService.refreshAccessToken();
      } else {
        console.error('Error fetching user data:', error);
      }
    }
  },

  getUserRole: async (accessToken) => {
    try {
      const response = await axios.get(`${baseUrl}/get-user-role/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      // Check if the user has any roles in the 'roles' array
      const userRoles = response.data.roles || [];
      const hasRoles = userRoles.length > 0;
  
      // If the user has roles, return the primary role; otherwise, return 'anonymous'
      return hasRoles ? response.data.primary_role : 'anonymous';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'anonymous'; // Handle errors gracefully, assume anonymous role
    }
  },

  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(`${baseUrl}/api/password-reset/`, { email });
      return response.data;
    } catch (error) {
      throw error; 
    }
  },

  confirmPasswordReset: async (newPassword, resetToken) => {
    try {
      const response = await axios.post(`${baseUrl}/api/password-reset/confirm/${uidb64}/${token}/`, {
        new_password: newPassword,
        reset_token: resetToken,
      });
      return response.data;
    } catch (error) {
      throw error; // Handle errors in the component
    }
  },

};

export default authService;
