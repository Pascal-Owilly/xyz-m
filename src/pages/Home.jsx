import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import './Home.css';
// Example in your JavaScript or TypeScript file
import '../../vendors/styles/core.css';
import '../../vendors/styles/icon-font.min.css';
import '../../vendors/styles/style.css';
import AuthService from './auth/AuthService'; // Make sure the path is correct
import { jwtDecode } from 'jwt-decode';

import { checkUserRole } from './auth/CheckUserRoleUtils'; // Update the path accordingly

const Home = () => {
const navigate =useNavigate()


  const baseUrl = BASE_URL;
  const [profile, setProfile] = useState([]);
  // const [user, setUser] = useState(null);

  const accessToken = Cookies.get('accessToken');
  const [user, setUser] = useState(null); // Initialize with null or an empty object
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] = useState(false);
  const [isSettingsDropdownVisible, setIsSettingsDropdownVisible] = useState(false);
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isDashboardsVisible, setIsDashboardsVisible] = useState(true);
  const [isNotificationPanelVisible, setIsNotificationPanelVisible] = useState(false);

  const [defaultBackgroundColor, setDefaultBackgroundColor] = useState('#ffffff');
const [defaultTextColor, setDefaultTextColor] = useState('#000000');
const [userRole, setUserRole] = useState('loading'); // Initialize with 'loading'

useEffect(() => {
  // Check user role and update state
  checkUserRole().then((role) => {
    setUserRole(role);
  })
  });


const toggleNotificationPanel = () => {
	setIsNotificationPanelVisible(!isNotificationPanelVisible);
  };
  
  
useEffect(() => {
	setDefaultBackgroundColor('0074cc');
	setDefaultTextColor('#fff');
  }, []);

  const handleResetSettings = () => {
	setBackgroundColor(defaultBackgroundColor);
	setTextColor(defaultTextColor);
  };
  
  const handleCloseSidebar = () => {
	setIsRightSidebarVisible(false)
  };

  // New state for managing background color
  const [backgroundColor, setBackgroundColor] = useState('#0074cc'); // Set the initial background color
  const [textColor, setTextColor] = useState('#000000'); // Set the initial text color

    // Function to handle background color change
	const handleBackgroundColorChange = (color) => {
		setBackgroundColor(color);
		// Set text color based on background color
		setTextColor(color === '#ffffff' ? '#ffffff' : '#000000');
	  };

  const handleDashboardsToggle = () => {
	console.log('Toggle function called');
	setIsDashboardsVisible(!isDashboardsVisible);
 };
 

  useEffect(() => {
    const storedToken = Cookies.get('accessToken');
    if (storedToken) {
      setIsLoggedIn(true);
    }
    fetchProfile();
    fetchUserData();

    // Determine initial state for the left sidebar based on the device width
    const handleWindowSizeChange = () => {
      if (window.innerWidth <= 768) {
        setIsLeftSidebarVisible(false);
      } else {
        setIsLeftSidebarVisible(true);
      }
    };

    // Set initial state on mount
    handleWindowSizeChange();

    // Add event listener for window resize to handle responsive changes
    window.addEventListener('resize', handleWindowSizeChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [accessToken, baseUrl]);

  const refreshAccessToken = async () => {
    try {
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
  

const fetchProfile = async () => {
  try {
    const response = await axios.get(`${baseUrl}/auth/user/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userProfile = response.data;
    setProfile(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user's authentication state

const logout = async () => {
  try {
    await axios.post(`${baseUrl}/auth/logout/`);
    Cookies.remove('accessToken', { sameSite: 'None', secure: true });
    window.location.reload();
    setIsRightSidebarVisible(false);
    setIsProfileDropdownVisible(false);
    setIsSettingsDropdownVisible(false);
    setIsLeftSidebarVisible(false);

    // Redirect based on user role
    switch (userRole) {
      case 'superuser':
        navigate('/');
        break;
      case 'regular':
        navigate('/');
        break;
      // Add more cases for other roles if needed
      default:
        navigate('/');
    }
  } catch (error) {
    console.error('Failed to logout', error);
  }
};

  

  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownVisible(!isProfileDropdownVisible);
  };

  const handleSettingsDropdownToggle = () => {
    setIsSettingsDropdownVisible(!isSettingsDropdownVisible);
  };

  const handleLeftSidebarToggle = () => {
    setIsLeftSidebarVisible(!isLeftSidebarVisible);
  };


	const [isChecked, setIsChecked] = useState(false);

	// Handle the change event for the checkbox
	const handleCheckboxChange = () => {
	  setIsChecked(!isChecked);
	};

	const handleRightSidebarToggle = () => {
		setIsRightSidebarVisible(!isRightSidebarVisible);
	  };
	  

	return(

		<>
      <div className="page-container" style={{ backgroundColor: backgroundColor, color: textColor }}>

	  <div className="header" style={{ width: isLeftSidebarVisible ? 'calc(100% - 279px)' : '100%', backgroundColor: backgroundColor, color: textColor }}>
        <div className="header-left" onClick={handleLeftSidebarToggle}>
          <div className="menu-icon bi bi-list"></div>
          <div className="search-toggle-icon bi bi-search" data-toggle="header_searc"></div>
          <div className="header-search">
            <form>
              <div className="form-group mb-0">
                <i className="dw dw-search2 search-icon"></i>
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search Here"
                />
                <div className="dropdown">
                  <a
                    className="dropdown-toggle no-arrow"
                    href="#"
                    role="button"
                    data-toggle="dropdown"
                  >
                    <button className="btn btn-primary">Search</button>
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="header-right">
		<div className="dashboard-setting user-notification">
        <div className="dropdown">
          <span
            className="dropdown-toggle no-arrow"
            data-toggle="right-sidebar"
            onClick={handleRightSidebarToggle}
          >
            <i className="dw dw-settings2 text-white" style={{cursor:'pointer'}}></i>
          </span>
        </div>
      </div>

	  <div
        className="right-sidebar"
        style={{
          position: 'fixed',
          top: '70px',
          right: isRightSidebarVisible ? '0' : '-300px',
          width: '300px',
          height: '100%',
          backgroundColor: '', 
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', 
          transition: 'right 0.3s ease',
        }}
      ></div>
				<div className="user-notification" >
					<div className="dropdown text-white" >
					<span
						className={`dropdown-toggle no-arrow ${isNotificationPanelVisible ? 'active' : ''}`}
						data-toggle="dropdown"
						onClick={toggleNotificationPanel}
						>
						<i className="icon-copy dw dw-notification text-white" style={{cursor:'pointer'}}></i>
						<span className="badge notification-active "></span>
					</span>

					{isNotificationPanelVisible && (

					<div className='notification-panel bg-light'
					style={{
						position: 'fixed',
						top: '75px',
						right: isRightSidebarVisible ? '-300px' : '0', 
						width: '300px',
						height: '100%',
						backgroundColor: '',
						boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
						transition: 'right 0.3s ease',
					  }}
					>
						<div className="dropdown-men dropdown-menu-right p-3" style={{fontSize:'14px'}}> 
							<div className="notification-lis mx-h-350 customscrol">
								<ul>
								<h5 className='mt-2 mb-2' style={{color:'#999999'}}>Notifications for you</h5>

									<li style={{color:'#999999'}}>
										<a href="#">
											<p>
												Message: "A new supply order has been placed. Please review and confirm the details.											</p>
										</a>
									</li>
									<li style={{color:'#999999'}}>
										<a href="#">
											<p>
												Message: "The latest goat supply shipment has been dispatched. Estimated arrival time is 12/11/2023."
											</p>
										</a>
									</li>
									<li style={{color:'#999999'}}>
										<a href="#">
											<p>
												Message: "Inventory levels are running low for certain goat products. Consider placing a new supply order.
											</p>
										</a>
									</li>
									<li>
										<a href="#">
											<p>
												Message: "A supplier has reported a quality issue with a recent goat supply. Please investigate and take necessary actions.
											</p>
										</a>
									</li>
									
								</ul>
							</div>
						</div>
						</div>
						)}
					</div>	
				</div>

	 <div className="user-info-dropdown"
	 
	 >
        <div className="dropdown"
		      onClick={handleProfileDropdownToggle} 

		>
          {isLoggedIn && (
            <a className="dropdown-toggle" href="#" role="button" data-toggle="dropdown"
			>
              <span className="user-icon">
                {profile && profile.profile_pic && (
                  <>
                    <img
                      src={`${baseUrl}${profile.profile_pic}`}
                      style={{ width: '55px', height: '55px' }}
                      alt=""
                    />
                  </>
                )}
              </span>
              <span style={{ textTransform: 'capitalize' }} className="user-name text-white">
                {/* {user.first_name} */}
              </span>
            </a>
          )}
          {isProfileDropdownVisible && (
            <div className=" dropdown-menu-right dropdown-menu-icon-list"
			style={{
				position: 'fixed',
				top: '70px',
				width: '300px',
				margin:'5px 20px 0	 0',
				backgroundColor: 'rgb(249, 250, 251)', 
				boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', 
			  }}
			>
              <a className="dropdown-item" href="/profile">
                <i className="dw dw-user1"></i> Profile
              </a>
              <a className="dropdown-item" href="">
                <i className="dw dw-settings2" ></i> Setting
              </a>
              <a className="dropdown-item" href="faq.html">
                <i className="dw dw-help"></i> Help
              </a>
              {isLoggedIn && (
                <a className="dropdown-item" onClick={() => logout()}>
                  <i className="dw dw-logout"></i> Log Out
                </a>
              )}
            </div>
          )}
        </div>
        <div>
          {!isLoggedIn && (
            <>
              <div className="d-flex">
                <div>
                  <a href="/login">
                    <button className="mx-2 btn-outline-secondary btn-sm mt-3 text-white">
                      Login
                    </button>
                  </a>
                </div>
                <div>
                  <a href="/register">
                    <button className="mx-2 mt-3 btn-outline-secondary btn-sm text-white">
                      SignUp
                    </button>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
		<div className="github-link">
			<a href="https://github.com/mariallugare" target="_blank"
				><img src="vendors/images/github.svg" alt=""
			/></a>
		</div>
	</div>    
    </div>
	<div className="right-sidebar p-3" style={{
          position: 'fixed',
          top: 0,
          right: isRightSidebarVisible ? '0' : '-300px',
          width: '300px',
          height: '100%',
        //   backgroundColor: '#343A40', 
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', 
          transition: 'right 0.3s ease',
          zIndex: 1000, 
		  overflow:'hidden',
        }}>
			<div className="sidebar-title">
				<h3 className="weight-60 font-16 text-blue">
					Page Settings
					<span className="btn-block font-weight-400 font-12"
						>User interface</span
					>
				</h3>
				<div className="close-sidebar" data-toggle="right-sidebar-close text-white " onClick={handleCloseSidebar}
>
					<i className="icon-copy ion-close-round"></i>
				</div>
			</div>
			<div className="right-sidebar-bod customscrol">
				<div className="right-sidebar-bod-conten">
					

					<h4 className="weight-600 font-18 pb-10">Navigation Background</h4>
					<div className="sidebar-btn-group pb-30 mb-10">
					<button
                className={`btn btn-outline-primary header-white ${
                  backgroundColor === '#001f33' ? 'active' : ''
                }`}
                onClick={() => handleBackgroundColorChange('#111')}
              >
                White 
              </button>
              <button
                className={`btn btn-outline-primary header-dark ${
                  backgroundColor === '#001f33' ? 'active' : ''
                }`}
                onClick={() => handleBackgroundColorChange('#343A40')}
              >
                Dark 
              </button>
					</div>

					<div className="reset-options pt-30 text-center">
					<button className="btn btn-danger" id="reset-settings" onClick={handleResetSettings}>
							Reset to default settings
						</button>
					</div>
				</div>
			</div>
		</div>

		{isLeftSidebarVisible && (

<div className="left-side-bar"
style={{
	position: 'fixed',
	top: 0,
	left: 0,
	height: '100%',
	width: isLeftSidebarVisible ? '279px' : '0',
	overflowX: 'hidden',
	overflowY: 'hidden',
	transition: 'left 0.3s ease',
	backgroundColor: backgroundColor,
  }}
>
	
  <div className="brand-logo">
  <span className='mtext' style={{ color: '#999999', fontSize: '18px' }}>
	<a href='/' style={{ color: '#fff', fontSize: '18px', fontWeight:'bold' }}>
      XYZ Management
	  </a>
    </span>
    <div className="close-sidebar" data-toggle="left-sidebar-close"
	onClick={handleCloseSidebar}
	>
      <i className="ion-close-round" onClick={handleLeftSidebarToggle}></i>
    </div>
  </div>
  
  <div className="menu-block customscroll" >
    <div className="sidebar-menu">
      <ul id="accordion-menu" >
        <li className="dropdown">
		<span href="" className="dropdown-toggle" style={{color:'#fff', fontWeight: 800}}>
   <span className="micon bi bi-house" style={{color:'#fff', fontWeight: 800}}></span>
   <span className="mtext" style={{color:'#fff', fontWeight: 800}}>Home</span>
</span>

{isDashboardsVisible && (

		<ul className="menu-dashboards" style={{ maxHeight: isDashboardsVisible ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
			          {userRole === 'superuser' && ( // Render only if user is a superuser
		  <li><a href="admin_dashboard">SCM Administration</a></li>
                )}
            <li><a href="supplier_dashboard">Supplier Dashboard</a></li>
            <li><a href="buyer_dashboard">Buyer Dashboard </a></li>
			<li><a href="slaughterhouse-dashboard">Slaughter House</a></li>
      {userRole === 'superuser' && ( // Render only if user is a superuser
            <li><a href="inventory-dashboard">Inventory Dashboard </a></li>
            )}
                        {userRole === 'superuser' && ( // Render only if user is a superuser

            <li><a href="warehouse">Warehouse Dashboard </a></li>
                        )}
            <li><a href="integrated_banking">Bank Dashboard </a></li>
			<li><a href="employee_dashboard">Employee Dashboard</a></li>
            <li><a href="export_handling_dashboard">Export Handling Dashboard </a></li>
            
    		</ul>
)}
        </li>

        <li>
          <a href="calendar.html" className="dropdown-toggle no-arrow">
            <span className="micon bi bi-calendar4-week"></span
            ><span className="mtext">Calendar</span>
          </a>
        </li>

        <li>
          <a href="invoice.html" className="dropdown-toggle no-arrow">
            <span className="micon bi bi-receipt-cutoff"></span
            ><span className="mtext">Invoice</span>
          </a>
        </li>
        <li>
          <div className="dropdown-divider"></div>
        </li>
      </ul>
    </div>
  </div>
</div>
)}

  <div className="mobile-menu-overlay"></div>

</div>
</>

	)
}

export default Home;




