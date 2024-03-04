import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container } from 'react-bootstrap';

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

      const [emptyHistoryMessageVisible, setEmptyHistoryMessageVisible] = useState(false);


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
          const response = await axios.get(`${baseUrl}/api/breader-trade/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
      
          console.log('Response Data:', response.data);
      
          // Check if the supply history is empty
          if (response.data.length === 0) {
            // Show the empty history message
            setEmptyHistoryMessageVisible(true);
            // Do not proceed further
            return;
          }
      
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
    <Container fluid>
  <Row className='main-container' style={{ textAlign: 'left', marginBottom: '20px', minHeight: '85vh' }}>
    <div className='p-3'>
      <h5 className='mb-4 mt-2' style={{color:'#001b40'}}>Product supplies and management </h5>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>Go to active orders to view details of new orders and the market will be collecting from. </p>
    </div>

    <br />

    <Col xs={12} md={4} lg={4}>
  <Card className='mt-2' style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    <Card.Body>
      <FaBell size={40} className='mb-3' style={{color:'#001b40'}} />
      <Card.Title>Active orders</Card.Title>
      <Card.Text>Click below to go to active orders.</Card.Text>
      <a href='/active-purchase-orders' className='btn btn-primary'>
        Active orders
      </a>
    </Card.Body>
  </Card>
</Col>

{/* Goat supplies status */}
<Col xs={12} md={4} lg={4}>
  <Card className='mt-2' style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    <Card.Body>
      <FaBox size={40} className='mb-3' style={{color:'#001b40'}} />
      <Card.Title>Supply products</Card.Title>
      <Card.Text>Click below to supply your products.</Card.Text>
      <a href='/breeder_invoices' className='btn btn-primary'>
        Supply products
      </a>
    </Card.Body>
  </Card>
</Col>

{/* Bread supplies status */}
<Col xs={12} md={4} lg={4}>
  <Card className='mt-2' style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    <Card.Body>
      <FaMoneyBillWave size={40} className='mb-3 ' style={{color:'#001b40'}}/>
      <Card.Title>Breed Supply History</Card.Title>
      <Card.Text>Go to your supply history.</Card.Text>
      <button onClick={handleBreadSuppliesStatus} className='btn btn-primary'>
        View history
      </button>
    </Card.Body>
  </Card>
</Col>

    {/* Empty history message */}
    {emptyHistoryMessageVisible && (
      <div className="alert alert-warning mt-2" role="alert">
        Your breed supply history is empty.
      </div>
    )}

    {localSuppliesData && (
      <Col xs={12} md={4} lg={4}>
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
</Container>

  );
};

export default Supplier;
