import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000'; // Replace with your API base URL

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
      const response = await axios.post(`${BASE_URL}/api/auth/password/reset/`, { email });
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