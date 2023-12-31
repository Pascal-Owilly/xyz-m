import axios from 'axios';
import { BASE_URL } from './config';

const baseUrl = BASE_URL;

const authService = {
  login: async (loginData) => {
    try {
      const response = await axios.post(`${BASE_URL}/authentication/login/`, loginData);
      const authToken = response.data.key;
      return authToken;
    } catch (error) {
      throw error;
    }
  },
  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/authentication/password/reset/`, { email });
      return response;
    } catch (error) {
      throw error;
    }
  },
  getUserRole: async (authToken) => {
    try {
      // Implement your API request to get the user role using the authToken
      const response = await axios.get(`${BASE_URL}/authentication/user/role/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      return response.data; // Assuming your API returns the user's role
    } catch (error) {
      throw error;
    }
  },
};

export default authService;