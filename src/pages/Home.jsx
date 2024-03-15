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
import logo from '../../images/intellima logo.jpeg';

import { checkUserRole } from './auth/CheckUserRoleUtils'; // Update the path accordingly
import defaultImg from './../../images/default.png'
import { Link } from 'react-router-dom';
import sidebarimg from '../../images/goat_1.jpg';
// import { FaSignInAlt, FaUserPlus, FaUserCog, FaHome, FaTruck, FaBoxOpen, FaMapMarkedAlt } from 'react-icons/fa'; // Import icons from react-icons library
import { FaSignInAlt, FaUserPlus, FaUserCog, FaHome, FaTruck, FaBoxOpen, FaMapMarkedAlt, FaShippingFast, FaArchive,FaTools, FaSellcast,FaMoneyCheckAlt, FaExchangeAlt, FaAccessibleIcon, FaShopify, FaShip , FaGlobe, FaGlobeAfrica, FaGlobeAmericas, FaStreetView} from 'react-icons/fa';

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
  if (accessToken && baseUrl) {
    fetchUserData();
  }
}, [accessToken, baseUrl]);


useEffect(() => {
  // Check user role and update state
  checkUserRole().then((role) => {
    setUserRole(role);
  })
  }, []);

  
useEffect(() => {
	setDefaultBackgroundColor('#0074cc');
	setDefaultTextColor('#fff');
  }, []);

  
  const handleCloseSidebar = () => {
	setIsRightSidebarVisible(false)
  };

  // New state for managing background color
  const [backgroundColor, setBackgroundColor] = useState('#001b31'); // Set the initial background color
 
  useEffect(() => {
    const storedToken = Cookies.get('accessToken');
    if (storedToken) {
      setIsLoggedIn(true);

    }

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
      if(!accessToken){
        navigate('/')
      }
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
  
const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user's authentication state

const logout = async () => {
  try {
    await axios.post(`${baseUrl}/api/logout/`);
    Cookies.remove('accessToken', { sameSite: 'None', secure: true });
    Cookies.remove('refreshToken');
    navigate('/')
    Cookies.remove('user')
    window.location.reload();
    setIsRightSidebarVisible(false);
    setIsProfileDropdownVisible(false);
    setIsSettingsDropdownVisible(false);
    setIsLeftSidebarVisible(false);


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
    const handleLinkClick = () => {
      console.log('Link clicked!');
    };

    const renderDashboards = () => {
      switch (userRole) {
        case 'superuser':
      return (
        <>
                     <hr />

<li style={{ display: 'flex', alignItems: 'center' }}>
  <FaTools style={{ marginRight: '12px', color: 'white', fontSize: '20px'}}/>
  <a href="/sellers">
    Sellers 
    </a>
</li>
<span className='mx-3' style={{ display: 'flex', alignItems: 'center' }}>
  <a href="/register-seller">
  <FaUserPlus style={{ marginRight: '12px', color: '#f9f9f9', fontSize: '16px'}}/>
  <span  style={{ marginRight: '12px', color: '#f9f9f9', fontSize: '10px'}}>
  Register seller
  </span>
    </a>
</span>
<hr />


<li style={{ display: 'flex', alignItems: 'center' }}>
  <FaTruck style={{ marginRight: '12px', color: 'white', fontSize: '20px'}}/>
  <a href="/supplier_dashboard">Suppliers </a>
</li>

<li style={{ display: 'flex', alignItems: 'center' }}>
  <FaSellcast style={{ marginRight: '12px', color: 'white', fontSize: '20px'}}/>
  <a href="/inventory-confirmation">Stock shift </a>
</li>
<li style={{ display: 'flex', alignItems: 'center' }}>
  <FaExchangeAlt style={{ marginRight: '12px', color: 'white', fontSize: '20px' }} />
  <a href="/buyer_dashboard" >
    Buyers
  </a>
</li>

<li style={{ display: 'flex', alignItems: 'center' }}>
  <FaMoneyCheckAlt style={{ marginRight: '12px', color: 'white', fontSize: '20px'}}/>
  <a href="/bank_teller_dashboard">Bank </a>
</li>

{/* <li style={{ display: 'flex', alignItems: 'center' }}>
<FaMapMarkedAlt style={{ marginRight: '12px', color: 'white', fontSize: '20px' }} />
  <a href="/customer_service_dashboard">Customer Care</a>
</li> */}        
<li style={{ display: 'flex', alignItems: 'center' }}>
  <FaStreetView style={{ marginRight: '12px', color: 'white', fontSize: '20px'}}/>
  <a href="/control-centers-list">Control centers</a>
</li>

<li style={{ display: 'flex', alignItems: 'center' }}>
<FaGlobe style={{ marginRight: '12px', color: 'white', fontSize: '20px'}} />
  <a href="/dispatch_and_shipping">Export Management </a></li>
        </>
      );

      case 'admin':
        return (
          <>
                        <hr />

          <li style={{ display: 'flex', alignItems: 'center' }}>
            <FaTools style={{ marginRight: '12px', color: 'white', fontSize: '20px'}}/>
            <a href="/sellers">
              Sellers 
              </a>
          </li>
          
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <FaTruck style={{ marginRight: '12px', color: 'white', fontSize: '20px'}}/>
            <a href="/supplier_dashboard">Suppliers </a>
          </li>
         
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <FaSellcast style={{ marginRight: '12px', color: 'white', fontSize: '20px'}}/>
            <a href="/inventory-confirmation">Stock shift </a>
          </li>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <FaExchangeAlt style={{ marginRight: '12px', color: 'white', fontSize: '20px' }} />
            <a href="/buyer_dashboard" >
              Buyers
            </a>
          </li>

          <li style={{ display: 'flex', alignItems: 'center' }}>
            <FaMoneyCheckAlt style={{ marginRight: '12px', color: 'white', fontSize: '20px'}}/>
            <a href="/bank_teller_dashboard">Bank </a>
          </li>
          
          {/* <li style={{ display: 'flex', alignItems: 'center' }}>
          <FaMapMarkedAlt style={{ marginRight: '12px', color: 'white', fontSize: '20px' }} />
            <a href="/customer_service_dashboard">Customer Care</a>
          </li> */}        
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <FaStreetView style={{ marginRight: '12px', color: 'white', fontSize: '20px'}}/>
            <a href="/control-centers-list">Control centers</a>
          </li>
        
          <li style={{ display: 'flex', alignItems: 'center' }}>
          <FaGlobe style={{ marginRight: '12px', color: 'white', fontSize: '20px'}} />
            <a href="/dispatch_and_shipping">Export Management </a></li>
    
        </>
                      
        );
        case 'regular':
          return (
            <>
              {/* Add more inventordashboards for regular user */}
            </>
          );
        case 'buyer':
          return (
            <>
<li style={{ display: 'flex', alignItems: 'center' }}>
                <FaHome style={{ marginRight: '12px', color: 'white', fontSize: '20px' }} />
                <a href="/buyer_dashboard" onClick={handleLinkClick}>
                  Buyer Dashboard
                </a>
              </li>
                          </>
          );
          case 'warehouse_personnel':
          return (
            <>
              <li><a href="/warehouse">Warehouse Dashboard</a></li>
              <li><a href="/buyer_dashboard">Buyer Dashboard</a></li>
              <li><a href="/export_handling_dashboard">Export Handling Dashboard </a></li>
              <li><a href="/dispatch_and_shipping">Dispatch & Shipping </a></li>
              <li><a href="/arrival">Arrival & Reception </a></li>

            </>
          );
          case 'slaughterhouse_manager':
            return (
              <>

<li style={{ display: 'flex', alignItems: 'center' }}>
                <FaTruck style={{ marginRight: '12px', color: 'white', fontSize: '20px'}}/>
                <a href="/slaughterhouse-dashboard">Slaughterhouse Dashboard</a>
              </li>
              </>
            );
            case 'breeder':
              return (
                <>

<li style={{ display: 'flex', alignItems: 'center' }}>
                <FaTruck style={{ marginRight: '12px', color: 'white', fontSize: '20px'}}/>
                <a href="/supplier_dashboard">Breeder Dashboard</a>
              </li>
                </>
              );
              case 'inventory_manager':
              return (
                <>

                  <li><a href="/supplier_dashboard">Breeder Dashboard</a></li>
                  <li>
                  
                     <a href="/inventory-dashboard">Inventory Dashboard </a>
                  </li>
                  
                  {/* Add more dashboards for buyer */}
                </>
              );
        // Add cases for other roles as needed...
        default:
          return null; // No specific dashboard for unknown roles
      }
    };
	  

	return(

		<>
      <div className="page-container" style={{ backgroundColor: backgroundColor, color: '#999999' }}>

	  <div className="header" style={{ width: isLeftSidebarVisible ? 'calc(100% - 279px)' : '100%', backgroundColor: '#fff', color: '#666666', zIndex: 999 }}>
        <div className="header-left" onClick={handleLeftSidebarToggle}>
          <div className="menu-icon bi bi-list"></div>
         
        </div>


        <div className="header-right">
       
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

{isLoggedIn && (

<div className="dashboard-setting user-notification">
    <div className="dropdown">
      <span
        className="dropdown-toggle no-arrow"
        data-toggle="right-sidebar"
        onClick={handleRightSidebarToggle}
      >
        <i className="dw dw-notification text-dark" style={{cursor:'pointer'}}></i>
      </span>
    </div>
  </div>
    )}
	

	 <div className="user-info-dropdown mx-3"
	 
	 >
        <div className="dropdown"
		      onClick={handleProfileDropdownToggle} 

		>
          {isLoggedIn && (
            <a className="dropdown-toggle" href="#" role="button" data-toggle="dropdown"
			>
              <span className="user-icon">
              <img
                      src={defaultImg}
                      style={{ width: '55px', height: '55px' }}
                      alt=""
                    />
                    
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
                {user && user.username}
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
      <button className="mx-2 btn-secondary btn-sm mt-3 text-dark" style={{ background: 'white', border: '1px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}>
        <FaSignInAlt className="mr-2" /> Login
      </button>
    </a>
  </div>
  <div>
  <a href="/register">
    <button className="mx-2 mt-3 btn-outline-secondary btn-sm text-white" style={{ background: '#28a745', border: '1px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}>
      <FaUserPlus className="mr-2" /> SignUp
    </button>
  </a>
</div>
</div>
            </>
          )}
        </div>
      </div>

      {/* <img src={logo} /> */}
     
	</div>    
    </div>
	

		{isLeftSidebarVisible && (

<div className="left-side-bar"
  style={{
    position: '',
    top: 0,
    left: 0,
    minHeight: '200vh',
    width: isLeftSidebarVisible ? '279px' : '0',
    transition: 'left 0.3s ease',
    // backgroundImage: `linear-gradient(rgb(75, 73, 172, 0.7), rgb(75, 73, 172, 0.7)), url(${sidebarimg})`,
    backgroundImage: 'black',
    backgroundSize: 'cover',
    backgroundColor: '#001b42',
    // overflow:'scroll',
  }}
>
	
  <div className="brand-logo">
  <span className='mtext' style={{ color: '#999999', fontSize: '18px' }}>
	<a href='/' style={{ color: '#fff', fontSize: '18px', fontWeight:'' }}>
      Intellima SCM
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

<a href='/'>
        <li className="dropdown">
		<span href="" className="dropdown-toggle" style={{color:'#fff', fontWeight: 800}}>
   <span className="micon bi bi-house" style={{color:'#fff', fontWeight: 400}}></span>
   <span className="mtext" style={{color:'#fff', fontWeight: 500, letterSpacing:'2px'}}>Home</span>
</span>

{isDashboardsVisible && (
  <ul className="menu-dashboards" style={{ maxHeight: '500px', transition: 'max-height 0.3s ease', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent' }}>
    {renderDashboards()}
  </ul>
)}
        </li>
        </a>

        <li>
          <div className="dropdown-divider"></div>
        </li>
      </ul>
    </div>
  </div>
</div>
)}

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
					Notifications
					<span className="btn-block font-weight-400 font-12"
						>Your notifications will appear here
            </span>
					
				</h3>
				<div className="close-sidebar" data-toggle="right-sidebar-close text-white " onClick={handleCloseSidebar}
>
					<i className="icon-copy ion-close-round"></i>
				</div>
			</div>
			<div className="right-sidebar-bod customscrol">
				<div className="right-sidebar-bod-conten">
					

					<h4 className="weight-600 font-18 pb-10"></h4>
					<div className="sidebar-btn-group pb-30 mb-10">
					
					</div>

					<div className="reset-options pt-30 text-center">

					</div>
				</div>
			</div>
		</div>
            
  <div className="mobile-menu-overlay"></div>

</div>
</>

	)
}

export default Home;




