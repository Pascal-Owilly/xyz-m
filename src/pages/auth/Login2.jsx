import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthService from './AuthService';
import { BASE_URL } from './config'; 
import axios from 'axios';
function FlashMessage({ message, type }) {
  return (
    <div className={`flash-message ${type}`}>
      <p>{message}</p>
    </div>
  );
}

const baseUrl = BASE_URL; 

const getCsrfToken = async () => {
  try {
      const response = await axios.get(`${baseUrl}/csrf_token/`);
      console.log('crf res', response)
      return response.data.csrfToken;
  } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return null;
  }
};
const LoginTest = () => {
  const [csrfToken, setCsrfToken] = useState(null);

  const [flashMessage, setFlashMessage] = useState(null); // Initialize with null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [errorMessages, setErrorMessages] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCsrfToken = async () => {
        const token = await getCsrfToken();
        setCsrfToken(token);
    };

    fetchCsrfToken();
}, []);

const login = async (e) => {
    // Prevent the default form submission behavior if the event is provided
    if (e) {
        e.preventDefault();
    }

    try {
        // Make sure csrfToken is available and not null
        if (!csrfToken) {
            console.error('CSRF token not available');
            // Handle the absence of CSRF token, e.g., by showing an error message
            return;
        }

        // Include the CSRF token in the headers
        const response = await axios.post(
            `${baseUrl}/csrf_token/`,  // Replace with your actual login endpoint
            loginData,
            {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',  // Set the content type based on your server's expectation
                    // Add any other headers if needed
                },
            }
        );

        // Handle the response, e.g., update UI or navigate to a new page
        console.log('Login successful:', response.data);

        // Example: Redirect to the dashboard after successful login
        navigate('/supplier_dashboard');  // Replace '/dashboard' with your desired route

        // Reload the page after successful login (if needed)
        // window.location.reload();

        // Update state or perform other actions based on the response
        // ... (your existing login logic)

    } catch (error) {
        // Handle login error
        if (error.response && error.response.status === 400) {
            const errorData = error.response.data;
            setErrorMessages({ invalidCredentials: "Invalid username or password" });
            // Handle specific error cases, e.g., show error message to the user
        } else {
            console.error('Login failed:', error);
            setFlashMessage({ message: "That didn't go well!", type: 'error' });
            // Handle generic error cases, e.g., show a generic error message
        }
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
    const storedToken = Cookies.get('authToken');
    if (storedToken) {
      setIsLoggedIn(true);
    }

    // Redirect to another page if the user is already logged in
    if (isLoggedIn) {
      navigate('/supplier_dashboard'); // Replace '/dashboard' with your desired route
    }
  }, [isLoggedIn]);

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    login();
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  return (
    <div className='main-container mb-5'>

<div className='' style={{ height: 'auto', backgroundColor: 'transparent',right:0 }}>
      <div className='row m-auto' style={{ height: 'auto', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className='col-md-12'>
          <form className='what-card-btn-login p-4  ' onSubmit={handleLoginSubmit}
           style={{  
           width: '100%',
           borderRadius: '0',
           margin: 'auto',
           transition: 'top 0.3s ease-in-out',
           boxShadow: '0px 24px 36px -19px rgba(0, 0, 0, 0.09)'
            }}>
            <h3 className='text-secondary'>Login</h3>
            <hr style={{ color: '#d9d9d9' }} />
            <div className="form-group" style={{ color: '#d9d9d9', fontSize: '18px' }}>
              <label className="mt-1 text-secondary" htmlFor="email">Email</label>
              <input
                type="text"
                style={{ background: '#d9d9d9' }}
                className="form-control"
                id="email"
                name="email"
                value={loginData.email}
                placeholder="Enter username"
                onChange={handleLoginChange}
              />
            </div>

            <div className="form-group" style={{ color: '#d9d9d9', fontSize: '18px' }}>
              <label className="mt-1 text-secondary" htmlFor="password">Password</label>
              <input
                type="password"
                style={{ background: '#d9d9d9' }}
                placeholder="Enter password"
                className="form-control"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
              />
              {errorMessages.invalidCredentials && (
                <p style={{ color: 'red', fontSize:'12px'}}>{errorMessages.invalidCredentials}</p>
              )}
            </div>

            <button
                type='submit'
                className='btn btn-sm btn-outline-primary text-secondary mt-1'
                style={{ background: '#fff', width:'100%' }}
              >
              Login
            </button>
            <hr />
            <p className='mb-2 text-secondary'>
              Don't have an account? <Link to='/register'>Signup</Link>
            </p>
            <p className='mb-2 text-secondary'>
              <Link to='/password_reset'>Forgot your password?</Link>
            </p>
          </form>
        </div>
          <div className='col-md-4'></div>
        </div>
        <>
  {flashMessage && (
    <div className="flash-message text-secondary" style={{backgroundColor:'transparent',  fontWeight:'normal'}}>
      {flashMessage.message}
    </div>
  )}
  </>
    </div>
    </div>

  );
};

export default LoginTest;