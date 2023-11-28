import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from './auth/config';

const Home = () => {
const navigate =useNavigate()
  const baseUrl = BASE_URL;
  const [profile, setProfile] = useState([]);

  const authToken = Cookies.get('authToken');
  const [user, setUser] = useState({})


useEffect(() => {
  const storedToken = Cookies.get('authToken'); // Retrieve the token from the cookie
  if (storedToken) {
    setIsLoggedIn(true);
  }
  fetchProfile();
  fetchUserData()
}, []);

const fetchUserData = async () => {
  try {
    const response = await axios.get(`${baseUrl}/authentication/user/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    const userData = response.data;
    setUser(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const fetchProfile = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/profile/`, {
      headers: {
        Authorization: `Token ${authToken}`,
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
		  await axios.post(`${baseUrl}/authentication/logout/`);
		  
		  // Remove the authToken cookie
		  Cookies.remove('authToken', { sameSite: 'None', secure: true });
		  window.location.reload()
	  
		  setFlashMessage({ message: 'You have successfully logged out', type: 'success' });
		  navigate('/homepage')
	  
		} catch (error) {
		  setFlashMessage({ message: 'Failed to logout', type: 'error' });
		}
	  };

	const [isChecked, setIsChecked] = useState(false);

	// Handle the change event for the checkbox
	const handleCheckboxChange = () => {
	  setIsChecked(!isChecked);
	};

	return(

		<>
		
		<div className="header">
        <div className="header-left">
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
						<a
							className="dropdown-toggle no-arrow"
							href="javascript:;"
							data-toggle="right-sidebar"
						>
							<i className="dw dw-settings2"></i>
						</a>
					</div>
				</div>
				<div className="user-notification">
					<div className="dropdown">
						<a
							className="dropdown-toggle no-arrow"
							href="#"
							role="button"
							data-toggle="dropdown"
						>
							<i className="icon-copy dw dw-notification"></i>
							<span className="badge notification-active"></span>
						</a>
						<div className="dropdown-menu dropdown-menu-right">
							<div className="notification-list mx-h-350 customscroll">
								<ul>
									<li>
										<a href="#">
											<p>
												Message: "A new supply order has been placed. Please review and confirm the details.											</p>
										</a>
									</li>
									<li>
										<a href="#">
											<p>
												Message: "The latest goat supply shipment has been dispatched. Estimated arrival time is 12/11/2023."
											</p>
										</a>
									</li>
									<li>
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
				</div>
				<div className="user-info-dropdown">
					<div className="dropdown">
					{isLoggedIn && (

						<a
							className="dropdown-toggle"
							href="#"
							role="button"
							data-toggle="dropdown"
						>
							<span className="user-icon">
							{profile && profile.profile_pic && (
                        <>
                          <img
                            src={`${baseUrl}${profile.profile_pic}`}
                            style={{ width: '55px', height:'55px'}}
                            alt=""
                          />
                        </>
							)}
							</span>
							
							<span style={{textTransform:'capitalize'}} className="user-name">{user.username}</span>
						</a>
							)}
						<div
							className="dropdown-menu dropdown-menu-right dropdown-menu-icon-list"
						>
							<a className="dropdown-item" href="/profile"
								><i className="dw dw-user1"></i> Profile</a
							>
							
							<a className="dropdown-item" href=""
								><i className="dw dw-settings2"></i> Setting</a
							>
							<a className="dropdown-item" href="faq.html"
								><i className="dw dw-help"></i> Help</a
							>

							{/* Log Out button with onClick event */}

							{isLoggedIn && (
							<a className="dropdown-item" onClick={logout}>
							<i className="dw dw-logout"></i> 
							Log Out
							</a>
							)}
						</div>
					</div>
					<div>
						{!isLoggedIn && (
							<>
							<div className='d-flex'>
							<div>
							<a href='/login'>
							<button className='mx-2 btn-outline-secondary btn-sm mt-3 text-white '>Login</button>
							</a>
</div>
<div>
							<a href='/register'>
							<button className='mx-2 mt-3 btn-outline-secondary btn-sm text-white '>Supplier SignUp</button>
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
	
	<div className="right-sidebar">
			<div className="sidebar-title">
				<h3 className="weight-600 font-16 text-blue">
					Layout Settings
					<span className="btn-block font-weight-400 font-12"
						>User Interface Settings</span
					>
				</h3>
				<div className="close-sidebar" data-toggle="right-sidebar-close">
					<i className="icon-copy ion-close-round"></i>
				</div>
			</div>
			<div className="right-sidebar-body customscroll">
				<div className="right-sidebar-body-content">
					<h4 className="weight-600 font-18 pb-10">Header Background</h4>
					<div className="sidebar-btn-group pb-30 mb-10">
						<a
							href="javascript:void(0);"
							className="btn btn-outline-primary header-white active"
							>White</a
						>
						<a
							href="javascript:void(0);"
							className="btn btn-outline-primary header-dark"
							>Dark</a
						>
					</div>

					<h4 className="weight-600 font-18 pb-10">Sidebar Background</h4>
					<div className="sidebar-btn-group pb-30 mb-10">
						<a
							href="javascript:void(0);"
							className="btn btn-outline-primary sidebar-light"
							>White</a
						>
						<a
							href="javascript:void(0);"
							className="btn btn-outline-primary sidebar-dark active"
							>Dark</a
						>
					</div>

					<h4 className="weight-600 font-18 pb-10">Menu Dropdown Icon</h4>
					<div className="sidebar-radio-group pb-10 mb-10">
						<div className="custom-control custom-radio custom-control-inline">
							{/* <input
								type="radio"
								id="sidebaricon-1"
								name="menu-dropdown-icon"
								className="custom-control-input"
								value="icon-style-1"
								
													/> */}
							<label className="custom-control-label" htmlFor="sidebaricon-1"
								><i className="fa fa-angle-down"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							{/* <input
								type="radio"
								id="sidebaricon-2"
								name="menu-dropdown-icon"
								className="custom-control-input"
								value="icon-style-2"
							/> */}
							<label className="custom-control-label" htmlFor="sidebaricon-2"
								><i className="ion-plus-round"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							{/* <input
								type="radio"
								id="sidebaricon-3"
								name="menu-dropdown-icon"
								className="custom-control-input"
								value="icon-style-3"
							/> */}
							<label className="custom-control-label" htmlFor="sidebaricon-3"
								><i className="fa fa-angle-double-right"></i
							></label>
						</div>
					</div>

				<h4 className="weight-600 font-18 pb-10">Menu List Icon</h4>
					<div className="sidebar-radio-group pb-30 mb-10">
						<div className="custom-control custom-radio custom-control-inline">
							{/* <input
								type="radio"
								id="sidebariconlist-1"
								name="menu-list-icon"
								className="custom-control-input"
								value="icon-list-style-1"
														/> */}
							<label className="custom-control-label" htmlFor="sidebariconlist-1"
								><i className="ion-minus-round"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							{/* <input
								type="radio"
								id="sidebariconlist-2"
								name="menu-list-icon"
								className="custom-control-input"
								value="icon-list-style-2"
							/> */}
							<label className="custom-control-label" htmlFor="sidebariconlist-2"
								><i className="fa fa-circle-o" aria-hidden="true"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							{/* <input
								type="radio"
								id="sidebariconlist-3"
								name="menu-list-icon"
								className="custom-control-input"
								value="icon-list-style-3"
							/> */}
							<label className="custom-control-label" htmlFor="sidebariconlist-3"
								><i className="dw dw-check"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							{/* <input
								type="radio"
								id="sidebariconlist-4"
								name="menu-list-icon"
								className="custom-control-input"
								value="icon-list-style-4"
								
							/> */}
							<label className="custom-control-label" htmlFor="sidebariconlist-4"
								><i className="icon-copy dw dw-next-2"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							{/* <input
								type="radio"
								id="sidebariconlist-5"
								name="menu-list-icon"
								className="custom-control-input"
								value="icon-list-style-5"
							/> */}
							<label className="custom-control-label" htmlFor="sidebariconlist-5"
								><i className="dw dw-fast-forward-1"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							{/* <input
								type="radio"
								id="sidebariconlist-6"
								name="menu-list-icon"
								className="custom-control-input"
								value="icon-list-style-6"
							/> */}
							<label className="custom-control-label" htmlFor="sidebariconlist-6"
								><i className="dw dw-next"></i
							></label>
						</div>
					</div>

					<div className="reset-options pt-30 text-center">
						<button className="btn btn-danger" id="reset-settings">
							Reset Settings
						</button>
					</div>
				</div>
			</div>
		</div>

<div className="left-side-bar">
  <div className="brand-logo">
  <span className='mtext' style={{ color: '#999999', fontSize: '18px' }}>
	<a href='/homepage' style={{ color: '#999999', fontSize: '18px' }}>
      XYZ Management
	  </a>
    </span>
    <div className="close-sidebar" data-toggle="left-sidebar-close">
      <i className="ion-close-round"></i>
    </div>
  </div>
  
  <div className="menu-block customscroll">
    <div className="sidebar-menu">
      <ul id="accordion-menu">
        <li className="dropdown">
          <a href="javascript:;" className="dropdown-toggle">
            <span className="micon bi bi-house"></span
            ><span className="mtext">Home</span>
          </a>
          <ul className="submenu">
		  <li><a href="admin_dashboard">SCM Administration</a></li>
            <li><a href="supplier_dashboard">Supplier Dashboard</a></li>
            <li><a href="buyer_dashboard">Buyer Dashboard </a></li>
			<li><a href="slaughterhouse-dashboard">Slaughter House</a></li>
            <li><a href="integrated_banking">Bank Dashboard </a></li>
			<li><a href="employee_dashboard">Employee Dashboard</a></li>
            <li><a href="export_handling_dashboard">Export Handling Dashboard </a></li>
            <li><a href="inventory-dashboard">Inventory Dashboard </a></li>
          </ul>
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

  <div className="mobile-menu-overlay"></div>


</>

	)
}

export default Home;




