import axios from 'axios';
import { BASE_URL } from './config';
import Cookies from 'js-cookie';
const baseUrl = BASE_URL; 
import { jwtDecode } from 'jwt-decode';
const authService = {
  
  login: async (loginData) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login/`, loginData);
      const tokens = response.data.tokens;

      // Decode the access token to get user details
      const decodedToken = jwtDecode(tokens.access);
      const user = {
        id: decodedToken.user_id,
        username: decodedToken.username,
        // Extract other user details from the decoded token
      };

      // Store tokens and user in cookies
      Cookies.set('accessToken', tokens.access, { expires: 10, sameSite: 'None', secure: true });
      Cookies.set('refreshToken', tokens.refresh, { expires: 30, sameSite: 'None', secure: true });
      Cookies.set('user', JSON.stringify(user), { expires: 10, sameSite: 'None', secure: true });

      // Return access token
      return tokens.access;
    } catch (error) {
      // Handle login error
      throw error;
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
  

handleTokenRefresh: async () => {
  try {
      const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh: Cookies.get('refreshToken') });
      const newAccessToken = response.data.access;

      // Update the stored access token
      Cookies.set('accessToken', newAccessToken, { expires: 10, sameSite: 'None', secure: true });

      return newAccessToken;
  } catch (error) {
      // Handle token refresh error (e.g., redirect to login page)
      throw error;
  }
},

  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/password/reset/`, { email });
      return response;
    } catch (error) {
      throw error;
    }
  },
  getUserRole: async (accessToken) => {
    try {
      // Implement your API request to get the user role using the authToken
      const response = await axios.get(`${baseUrl}/auth/api/user/role/`, {
        headers: {
          Authorization: `Token ${accessToken}`,
        },
      });

      return response.data; // Assuming your API returns the user's role
    } catch (error) {
      throw error;
    }
  },
};

export default authService;