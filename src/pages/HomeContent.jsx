import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import { Container, Col, Row } from 'react-bootstrap';
import { FaCheckCircle, FaMoneyBill, FaShieldAlt, FaUsers, FaCogs } from "react-icons/fa";
import { checkUserRole } from "./auth/CheckUserRoleUtils";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthService from './auth/AuthService'
import backgroundSvg from '../../images/home2.png';
import { FaUserPlus } from 'react-icons/fa'; // Import FaUserPlus icon from react-icons library

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
          <p className='text-center mx-auto text-dark' style={{width:'60%'}}>
            You currently have no role. Please be patient as we assign you a role.
            If you feel there's an issue with your session, please contact us{' '}
            {/* <a className='bg-success text-white mx-2' href="/contact">here</a> */}
          </p>
        </div>
      );
    }
    if (userRole === 'no_role') {

      return (
        <div>
          <p className='text-center mx-auto text-dark' style={{width:'60%'}}>
            You currently have no role. Please be patient as we assign you a role.
            If you feel there's an issue with your session, please contact us{' '}
            {/* <a href="/contact">here</a>. */}
          </p>
        </div>
      );
    }

    // You can add an else block or handle other cases if needed
  };

// Login
const [flashMessage, setFlashMessage] = useState(null); // Initialize with null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [errorMessages, setErrorMessages] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const login = async (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      const accessToken = await AuthService.login(loginData); // Update this line
      setIsLoggedIn(true);
      Cookies.set('accessToken', accessToken, { expires: 10, sameSite: 'None', secure: true });
      // Fetch user role
      const role = await checkUserRole();

      // Redirect based on user role
      switch (role) {
        case 'superuser':
          navigate('/admin_dashboard');
          break;
        case 'regular':
          navigate('/supplier_dashboard');
          break;
        // Add more cases for other roles if needed

        default:
          // Redirect to the default page (e.g., home page)
          navigate('/');
      }

      // Reload the page after successful login

      setFlashMessage({ message: `Welcome back ${loginData.username}!`, type: 'success' });
    } catch (error) {
      setFlashMessage({ message: `Filed to login `, type: 'danger' });
    }
  };
  
  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage(null); // Remove the flash message after 2 seconds
      }, 3000); 
  
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  useEffect(() => {
    const storedToken = Cookies.get('accessToken');
    if (storedToken) {
      setIsLoggedIn(true);
    }

    // Redirect to another page if the user is already logged in
    if (isLoggedIn) {
      // navigate('/supplier_dashboard'); // Replace '/dashboard' with your desired route
      console.log('login success')
    }
  }, [isLoggedIn]);

  const handleLoginSubmit = async (event) => {
    try {
      event.preventDefault();
      
      // Log the login data for debugging purposes
      console.log('loginData:', loginData);
  
      // Call the AuthService.login function and await the result
      const accessToken = await AuthService.login(loginData);
  
      // Set the user as logged in
      setIsLoggedIn(true);
  
      // Fetch user role
      const role = await checkUserRole();
  
      // Redirect based on user role
      switch (role) {
        case 'superuser':
          navigate('/admin_dashboard');
          break;
        case 'admin':
          navigate('/admin_dashboard');
          break;
          case 'admin':
            navigate('/admin_dashboard');
            break;
            case 'Breeder':
              navigate('/supplier_dashboard');
              break;
            case 'buyer':
              navigate('/buyer_dashboard');
              break;
                case 'warehouse personnel':
                  navigate('/warehouse');
                  break;
              case 'inventory manager':
                navigate('/inventory');
                break;
                case 'Slaughterhouse Manager':
                  navigate('/inventory');
                  break;

        // Add more cases for other roles if needed
  
        default:
          // Redirect to the default page (e.g., home page)
          navigate('/');
      }
  
      // Note: Removing the page reload for testing
      // window.location.reload();
      window.location.reload();

      // Set a flash message for successful login
      setFlashMessage({ message: `Welcome back ${loginData.username}!`, type: 'success' });
    } catch (error) {
      // Handle login error
      // For example, log the error to the console for debugging
      console.error('Login error:', error);
  
      // You might want to set a flash message for unsuccessful login
      setFlashMessage({ message: 'Invalid credentials. try again.', type: 'error' });
    }
  };
 

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

// End Login

// hero

  return (
    <>
      <div className="main-container" style={{ minHeight: '85vh'}}>

     <Container className='' fluid style={{}}>
  <Row>
    <Col md={12}>
      {userRole && (
        <div style={{ textAlign: 'right', marginTop: 'px' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#666666' }}>{`Welcome, ${username}!`} <br />
            <span className='mx-3' style={{ fontSize: '14px', color: '#666666' }}>Role: {userRole}</span>
          </span>
        </div>
      )}
      {renderRoleNotification()}
    </Col>


    <Col md={8}>
      <div className="text-center p-5 bg-image rounded-3" style={{ height: '400px' }}>
        <div className="mask">
          <div className="mt- h-100">
            <div className="text-info">
              <h2 className="mb- text-secondary" style={{ color: 'blue', textAlign: 'center' }}>
                Supply breeds to XYZ abattoir and get paid seamlessly
              </h2>
              <a className="btn mt-3 btn-outline-primary btn-lg" href="/register" role="button">
  <FaUserPlus className="mr-2" /> Register Now!
</a>            </div>
          </div>
        </div>
      </div>
    </Col>

    {/* {!isLoggedIn && ( */}
      <Col md={4}>
        <div className='p-5' style={{ width: '100%', backgroundColor: 'transparent', right: 0 }}>
          <div className='row m-auto bg-' style={{ height: 'auto', backgroundColor: '', alignItems: 'center', justifyContent: 'center' }}>
            <img src={backgroundSvg} />
          </div>
        </div>
      </Col>
    {/* )} */}
  </Row>
</Container>

        
      </div>
    </>
  );
};

export default HomeContent;
