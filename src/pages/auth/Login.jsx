import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthService from './AuthService';
import { checkUserRole } from './CheckUserRoleUtils'; // Import the checkUserRole function

function FlashMessage({ message, type }) {
  return (
    <div className={`flash-message ${type}`}>
      <p>{message}</p>
    </div>
  );
}

const LoginTest = () => {
  const [flashMessage, setFlashMessage] = useState(null); // Initialize with null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false); // New state for loading

  const navigate = useNavigate();
  const location = useLocation();

  const login = async (e) => {
    if (e) {
      e.preventDefault();
    }
  
    try {
      setLoading(true); // Set loading to true before making the login request
  
      const accessToken = await AuthService.login(loginData);
      setIsLoggedIn(true);
      Cookies.set('accessToken', accessToken, { expires: 10, sameSite: 'None', secure: true });
      
      const role = await checkUserRole();
  
      switch (role) {
        case 'superuser':
          navigate('/admin_dashboard');
          break;
        case 'regular':
          navigate('/supplier_dashboard');
          break;
        // Add more cases for other roles if needed
        default:
          navigate('/');
      }
  
      setFlashMessage({ message: `Welcome back ${loginData.username}!`, type: 'success' });
    } catch (error) {
      console.error('Login error:', error);
      setFlashMessage({ message: 'Invalid credentials. Try again.', type: 'error' });
    } finally {
      setLoading(false); // Set loading to false after the login request is complete
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
                  navigate('/slaughterhouse-dashboard');
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
      setFlashMessage({ message: 'Invalid credentials. try again. Please note that the credentials are case sensitive', type: 'error' });
    }
    finally {
      setLoading(false); // Set loading to false after the login request is complete
    }
  };
 

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  return (
    <div className='main-container '>

<div className='' style={{ height: 'auto', backgroundColor: 'transparent',right:0 }}>
      <div className='row m-auto' style={{ height: 'auto', backgroundColor: '', alignItems: 'center', justifyContent: 'center' }}>
        <div className='col-md-2'></div>
        <div className='col-md-6'>
          <form className='what-card-btn-login p-4 mb-3 bg-white' onSubmit={handleLoginSubmit}
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
              <label className="mt-1 text-secondary" htmlFor="username">Username</label>
              <input
                type="text"
                style={{ background: '#d9d9d9' }}
                className="form-control"
                id="username"
                name="username"
                value={loginData.username}
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
              disabled={loading} // Disable the button when loading is true
            >
              {loading ? (
                <div>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  {' '}Logging in...
                </div>
              ) : 'Login'}
            </button>


            <hr />
            {flashMessage && (
              <div className="flash-message text-danger" style={{backgroundColor:'transparent',  fontWeight:'normal'}}>
                {flashMessage.message}
                <hr />
              </div>
              
            )}

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

  </>
    </div>
    </div>

  );
};

export default LoginTest;