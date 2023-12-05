import React, { useState, useEffect } from 'react';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { checkUserRole } from './auth/CheckUserRoleUtils'; // Update the path accordingly


const Admin = () => {
  const navigate = useNavigate()

  const baseUrl = BASE_URL;

  const [breadersCount, setBreadersCount] = useState(0);
  const authToken = Cookies.get('authToken');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Define the fetchData function inside the useEffect
    const fetchData = async () => {
      try {
        // Fetch data from Django API endpoint
        const response = await fetch(`${baseUrl}/api/breader-count/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        const data = await response.json();
        setBreadersCount(data.breader_count);
        console.log('count', data.breader_count);
      } catch (error) {
        console.error('Error fetching breaders count:', error);
      }
    };

    // Call fetchData unconditionally
    fetchData();
  }, [baseUrl, authToken]); // Include dependencies in the dependency array

  useEffect(() => {
    // Fetch data from Django API endpoint
    fetch(`${baseUrl}/api/breader-count/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setBreadersCount(data.breader_count);
        console.log('count', data.breader_count);
      })
      .catch(error => console.error('Error fetching breaders count:', error));
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const userRole = await checkUserRole(); // Use the checkUserRole function
      // Set the userRole state or perform other actions based on the role
      setUserRole(userRole);

      // Check if the user has superuser role, if not, redirect
      if (userRole !== 'superuser') {
        navigate('/unauthorized'); // Redirect to the unauthorized page
      }
    };

    checkUser();
  }, [navigate]);
  

	return(

		<>
  <div className="main-container">
  <div className="">
  <div className="container-fluid" style={{minHeight:'72vh'}}>
	<h2 className='' style={{marginBottom:'6vh'}}>SCM Administration </h2>
  <div className="row">

    <div className="col-lg-3 col-md-6 mb-3">
      <div className="card-box height-100-p widget-style3">
        <div className="d-flex flex-wrap">
          <div className="widget-data">
            <div className="weight-700 font-24 text-dark">Buyers</div>
            <div className="font-14 text-secondary weight-500">5000</div>
          </div>
          <div className="widget-icon">
            <div className="icon" data-color="#09cc06">
              <i className="fas fa-plane"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="col-lg-3 col-md-6 mb-3">
    <a href='/breaders'>

      <div className="card-box height-100-p widget-style3">
        <div className="d-flex flex-wrap">
          <div className="widget-data">
            <div className="weight-700 font-24 text-dark">Breaders</div>
            <div className="font-14 text-secondary weight-500">{breadersCount}</div>
          </div>
          <div className="widget-icon">
            <div className="icon" data-color="#09cc06">
              <i className="fas fa-plane"></i>
            </div>
          </div>
        </div>
      </div>
      </a>
    </div>

    <div className="col-lg-3 col-md-6 mb-3">
      <div className="card-box height-100-p widget-style3">
        <div className="d-flex flex-wrap">
          <div className="widget-data">
            <div className="weight-700 font-24 text-dark">Earnings</div>
            <div className="font-14 text-secondary weight-500">Kes 5,000,000</div>
          </div>
          <div className="widget-icon">
            <div className="icon" data-color="#09cc06">
              <i className="fas fa-plane"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="col-lg-3 col-md-12 mb-3">
      <div className="card-box height-100-p widget-style3">
        <div className="d-flex flex-wrap">
          <div className="widget-data">
            <div className="weight-700 font-24 text-dark">Communities</div>
            <div className="font-14 text-secondary weight-500">3000</div>
          </div>
          <div className="widget-icon">
            <div className="icon" data-color="#09cc06">
              <i className="fas fa-plane"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="card-box height-100-p widget-style3">
        <div className="d-flex flex-wrap">
          <div className="widget-data">
            <div className="weight-700 font-24 text-dark">Inventory</div>
            <div className="font-14 text-secondary weight-500">500 Breads</div>
          </div>
          <div className="widget-icon">
            <div className="icon" data-color="#09cc06">
              <i className="fas fa-plane"></i>
            </div>
          </div>
        </div>
      </div>

	

  </div>
</div>

			</div>
			</div>

</>

	)
}

export default Admin;




