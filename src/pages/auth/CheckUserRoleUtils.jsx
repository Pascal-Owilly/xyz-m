import Cookies from 'js-cookie';
import AuthService from './AuthService'; // Make sure the path is correct


const checkUserRole = async () => {
    try {
      const authToken = Cookies.get('authToken'); // Get the authToken from cookies
      if (!authToken) {
        return 'anonymous'; // No authToken, assume anonymous role
      }
  
      // Make a request to your API to get user role (you need to implement this API endpoint)
      const response = await AuthService.getUserRole(authToken);

      
      // Assuming your API returns user role as 'superuser' or 'regular'

      return response.role;
    } catch (error) {
      console.error('Error checking user role:', error);
      return 'anonymous'; // Handle errors gracefully, assume anonymous role
    }
  };

  export { checkUserRole }; // Export the function