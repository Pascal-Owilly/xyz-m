import axios from 'axios';
import { BASE_URL } from './config';
import Cookies from 'js-cookie';

const baseUrl = BASE_URL;

// Set up Axios interceptors
axios.interceptors.request.use(
  (config) => {
    // Add X-CSRFToken header to all requests
    const csrfToken = Cookies.get('X-CSRFToken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    console.log('headers found', csrfToken);

    return config;
  },
  (error) => {
    console.log('headers not found');

    return Promise.reject(error);
  }
);

const authService = {
  getCsrfToken: async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/csrf_token/`);
      const csrfToken = response.data.csrf_token;

      // Log the CSRF token
      console.log('CSRF Token:', csrfToken);

      // Store the CSRF token in a cookie
      Cookies.set('X-CSRFToken', csrfToken, { sameSite: 'None', secure: false });

      // Set the CSRF token in axios defaults
      axios.defaults.headers.common['X-CSRFToken'] = csrfToken;

      return csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return null;
    }
  },
  
  login: async (loginData, csrfToken) => {
    try {
      console.log('Headers before login request:', axios.defaults.headers.common);
  
      const response = await axios.post(`${baseUrl}/accounts/login/`, loginData, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Headers after login request:', axios.defaults.headers.common);
  
      console.log('Your CSRF token:', response.data.csrf_token);
  
      if (response.status === 200) {
        const authToken = response.data.key;
        console.log('authtoken', authToken);
        return authToken;
      } else {
        console.error('Login failed with status code:', response.status);
        console.error('Error details:', response.data);
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },
  

  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(`${baseUrl}/accounts/password/reset/`, { email });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  getUserRole: async (authToken) => {
    try {
      // Implement your API request to get the user role using the authToken
      const response = await axios.get(`${baseUrl}/authentication/user/role/`, {
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
