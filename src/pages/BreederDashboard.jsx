import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';

import { FaBell, FaBox, FaExclamation, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import { useNavigate } from 'react-router-dom';
import SuppliedBreedsSingleUser from './breaders/SuppliedBreedsSingleUser';
import { useSupplies } from '../SuppliesContext';
import { checkUserRole } from './auth/CheckUserRoleUtils'; 
import { Link } from 'react-router-dom'; // Import Link for navigation


const Supplier = () => {



  const Greetings = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let greeting;
  
    if (currentHour < 5) {
      greeting = 'Good night';
    } else if (currentHour < 12) {
      greeting = 'Good morning';
    } else if (currentHour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }
  
    return greeting;
  };  
    
      const { setSuppliesData } = useSupplies();

      const baseUrl = BASE_URL;
      const navigate = useNavigate()
      const [profile, setProfile] = useState([]);
      const accessToken = Cookies.get('accessToken');
      const [user, setUser] = useState({});
      const [localSuppliesData, setLocalSuppliesData] = useState(null);
      const [userRole, setUserRole] = useState('')
      useEffect(() => {
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
            if (!accessToken) {
              navigate('/'); // Redirect to the home page if no access token is detected
              return;
            }
            if (accessToken) {
              const response = await axios.get(`${baseUrl}/auth/user/`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });
        
              const userProfile = response.data.user; // Access the user information correctly
              setUser(userProfile);
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
                 fetchUserData();
       }, [accessToken]);
       

       useEffect(() => {
        const checkUser = async () => {
          const role = await checkUserRole();
    
          // if (role !== 'superuser' && role !== 'admin' && role !== 'Breeder') {
          //   navigate('/unauthorized'); // Redirect unauthorized users to the home page
          //   return;
          // }
          console.log('user role from the breeder dash', role)
          setUserRole(role);
        };
    
        checkUser();
      }, [navigate]);
     
      const handleBreadSuppliesStatus = async () => {
        try {
          const response = await axios.get(`${baseUrl}/api/breader-trade/${user.id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
      
          console.log('Response Data:', response.data); // Log the entire response data
      
          // Set supplies data directly to local state
          setLocalSuppliesData(response.data);
        } catch (error) {
          console.error('Error fetching supplies data:', error);
        }
      };
      
    
      useEffect(() => {
        // Use useEffect to navigate after suppliesData is updated
        if (localSuppliesData) {
          // Navigate to the supplies page
          navigate('/supplied-breeds');
        }
      }, [localSuppliesData, navigate]);
    

  return (
    <Row className='main-container' style={{ textAlign: 'left', marginBottom: '20px', minHeight: '85vh' }}>
      <h2 className=''>Breeder Dashboard</h2> <br />

      <Col lg={{ span: 3, offset: 9 }} className='text-right'>
        <div style={{ marginBottom: '25px', padding: '5px', backgroundColor: '#e0e0e0', borderRadius: '30px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: 'auto' }}>
          <p className='text-center mt-1'>{`${Greetings()} `} </p>
          <span style={{ textTransform: 'capitalize' }}></span>
        </div>
      </Col>

      {/* Notifications */}
      <Col className='mt-2' xs={6} md={6}>
        {/* <FaBell size={20} color='white' /> */}
      </Col>
      {/* Flash message */}
      <Col xs={6} md={6}></Col>

      {/* Goat supplies status */}
      <Col xs={12} md={6} lg={4}>
        <Card className='mt-2' style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Card.Body>
            <FaBox size={40} className='mb-3' />
            <Card.Title>Supply to XYZ Abattoir</Card.Title>
            <Card.Text>Click below to supply goats to XYZ Abattoir and manage your transactions.</Card.Text>
            <a href='/breeder_invoices' className='btn btn-primary'>
              Go to Invoices
            </a>
          </Card.Body>
        </Card>
      </Col>

      {/* Bread supplies status */}
      <Col xs={12} md={6} lg={4}>
        <Card className='mt-2' style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} onClick={handleBreadSuppliesStatus}>
          <Card.Body>
            <FaBox size={40} className='mb-3' />
            <Card.Title>Bread Supplies Status</Card.Title>
            <Card.Text>Check the status of your bread supplies and manage orders efficiently.</Card.Text>
            <button onClick={handleBreadSuppliesStatus} className='btn btn-primary'>
              View Status
            </button>
          </Card.Body>
        </Card>
      </Col>

      {/* Track Payments */}
      <Col xs={12} md={6} lg={4}>
        <Card className='mt-2' style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Card.Body>
            <FaMoneyBillWave size={40} className='mb-3' />
            <Card.Title>Track Payments</Card.Title>
            <Card.Text>Monitor your payment transactions and keep track of your earnings.</Card.Text>
            <a href='#' className='btn btn-primary'>
              View Payments
            </a>
          </Card.Body>
        </Card>
      </Col>
      {localSuppliesData && (
  <Col xs={12} md={6} lg={4}>
    <Card className='mt-2' style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Card.Body>
        <h4>Additional Data</h4>
        <p>Abattoir: {localSuppliesData.abattoir}</p>
        <p>Breed: {localSuppliesData.breed}</p>
        <p>Community: {localSuppliesData.breeder_community}</p>
        <p>Number Supplied: {localSuppliesData.breeds_supplied}</p>
        <p>Breed Weight: {localSuppliesData.goat_weight} kg</p>
        <p>Vaccinated: {localSuppliesData.vaccinated ? 'Yes' : 'No'}</p>
        {/* Add more lines to display other data */}
      </Card.Body>
    </Card>
  </Col>
)}
    </Row>
  );
};

export default Supplier;
