// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container, Form, Button, ProgressBar } from 'react-bootstrap';
import { FaTruck } from 'react-icons/fa'; // Assuming you're using react-icons for the truck icon
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BankDashboard = () => {
  const baseUrl = BASE_URL;
  const [activeSection, setActiveSection] = useState('BreederPayments');

  const [paymentCode, setPaymentCode] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const accessToken = Cookies.get('accessToken');

  // LC
  const [lcId, setLcId] = useState(null);
  const [lcDocument, setLcDocument] = useState(null);
  const [lcUploadError, setLcUploadError] = useState(null);
  const [profile, setProfile] = useState(null)
  const [userProfile, setUserProfile] = useState(null);
  const [arrivedOrdersData, setArrivedOrdersData] = useState([]);
  const [shipmentProgressData, setShipmentProgressData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [logisticsStatuses, setLogisticsStatuses] = useState([]);
  const [orders, setOrders] = useState([]);

  // Status tracking

  const getStatusIndex = (status) => ['ordered', 'dispatched', 'shipped', 'arrived', 'received'].indexOf(status);

  useEffect(() => {
    axios.get(`${baseUrl}/api/logistics-status/`)
      .then(response => {
        setLogisticsStatuses(response.data);

        console.log('response', response)
      })
      .catch(error => {
        console.error('Error fetching logistics statuses:', error);
      });

    axios.get(`${baseUrl}/api/order/`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });

    axios.get(`${baseUrl}/api/shipment-progress/`)
      .then(response => {
        setShipmentProgressData(response.data);
      })
      .catch(error => {
        console.error('Error fetching shipment progress data:', error);
      });

    axios.get(`${baseUrl}/api/arrived-order/`)
      .then(response => {
        setArrivedOrdersData(response.data);
      })
      .catch(error => {
        console.error('Error fetching arrived orders data:', error);
      });
  }, [baseUrl]);

  const renderOrderDetails = (order) => (
    <div key={order.id} className="order-details">
      <h6 className='mb-3'>Order #{order.id} - {order.status}</h6>
  
      <Card className={`card ${getStatusColor(order.status)} mr-2`} disabled>
        <Card.Body>
          <Card.Title>{order.status}</Card.Title>
          <Card.Text>
            <FaTruck /> Track Location
          </Card.Text>
        </Card.Body>
      </Card>
  
      {logisticsStatuses
        .filter((status) => status.invoice === order.id)
        .map((status) => (
          <Card
            key={status.id}
            className={`card ${getStatusColor(status.status)} mr-2`}
            disabled
          >
            <Card.Body>
              {status.status}
            </Card.Body>
          </Card>
        ))}
      <ProgressBar now={calculatePercentage(order.status)} label={`${order.status} - ${calculatePercentage(order.status)}%`} />
    </div>
  );

  const handleNavLinkClick = (section) => {
    setActiveSection(section);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/abattoir-payments-to-breeders/search-payment-by-code/search_payment_by_code/?payment_code=${paymentCode}`);
      const data = await response.json();

      if (response.ok) {
        setPaymentData(data);
        setError(null);
      } else {
        setPaymentData(null);
        setError(data.error || 'Invaid payment code');
      }
    } catch (error) {
      console.error('Error searching for payment data:', error);
      setPaymentData(null);
      setError('Error searching for payment data');
    }
  };

  const formatPaymentInitiationDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
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

  useEffect(() => {
    // Fetch user data when component mounts
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

    fetchUserData(); // Call the function to fetch user data
  }, []); // Empty dependency array to run the effect only once when the component mounts



  const handleLcUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('lc_document', lcDocument);
  
      const response = await axios.post(
        `${baseUrl}/api/letter_of_credits/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-User-ID': userProfile?.user?.id, // Assuming user ID is part of your user profile
            'X-User-Email': userProfile?.user?.email, // Assuming user email is part of your user profile
          },
        }
      );
  
      console.log('upload response', response);
      if (!response.ok) {
        const data = response.data;
        setLcUploadError(data.error || 'Error uploading letter of credit document');
      } else {
        setLcUploadError(null);
        // Optionally, you can perform additional actions upon successful upload
      }
    } catch (error) {
      console.error('Error uploading letter of credit document:', error);
      setLcUploadError('Error uploading letter of credit document');
    }
  };
  
  const handleButtonClick = (section) => {
    setActiveSection(section);
  };



  return (
   <div className='main-container ' style={{ minHeight: '85vh', backgroundColor: '#f0f8ff' }}>

  {/* Navbar */}
  <nav className="navbar navbar-expand-lg navbar-dark bg-success">
  <Link  className="navbar-brand">Bank Dashboard</Link>
  <button
    className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav ml-auto">
      <li onClick={() => handleButtonClick('BreederPayments')}
        className={`mr-2 nav-item ${activeSection === 'BreederPayments' ? 'active-buyer-button' : ''}`}
      >
        <Link className="nav-link" style={{ color: '#fff' }}>Breeder Payments</Link>
      </li>
      <li onClick={() => handleButtonClick('LetterOfCredit')} className="nav-item">
        <Link className="nav-link" style={{ color: '#fff' }}>Letter of credit</Link>
      </li>
      <li onClick={() => handleButtonClick('InvoiceTracking')} className="nav-item">
        <Link className="nav-link" style={{ color: '#fff' }}>Invoice tracking</Link>
      </li>
    </ul>
  </div>
</nav>

        <Container>
        {activeSection === 'BreederPayments' && (
          <Row>
            <Col md={10}>
        <Col>
          <Card.Body>
            <h5 className="text-success mb-4">Search Payment by Code</h5>
            <p className="text-muted">
              Welcome, dear bank teller. To access breeder details, please paste the code you received via email below. This code is essential for securely retrieving the relevant information. Once you see the details, please proceed to make payment.
            </p>
            <Form>
              <Form.Group controlId="paymentCode">
                <Form.Label className="text-primary">Payment Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter payment code"
                  value={paymentCode}
                  onChange={(e) => setPaymentCode(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" className='mt-4' onClick={handleSearch} style={{width:'200px'}}>
                Search
              </Button>
            </Form>
            {error && <p className="text-danger">{error}</p>}
            {paymentData && (
              <Col className="mt-4 shadow">
                <Card.Body>
                  <h6 className="text-primary mb-3">Payment Details</h6>
                  <Row>
                    <Col md={6}>
                      <p style={{ boxShadow: '0 4px 1px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Abattoir: {paymentData.breeder_trade.abattoir}</p>
                      <p  style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}><span style={{fontWeight:'bold'}} className="text-success" >ID Number: </span>{paymentData.breeder_trade.id_number}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Breed: {paymentData.breeder_trade.breed}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Price: Kes {paymentData.breeder_trade.price}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Reference: {paymentData.breeder_trade.reference}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Transaction Date: {paymentData.breeder_trade.transaction_date}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Vaccinated: {paymentData.breeder_trade.vaccinated ? 'Yes' : 'No'}</p>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Breeder Details</h6>

                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Market: {paymentData.breeder_trade.breeder_market}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Community: {paymentData.breeder_trade.breeder_community}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Head of Family: {paymentData.breeder_trade.breeder_head_of_family}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}> <span className="text-success"  style={{fontWeight:'bold'}}>Full Name:</span> {paymentData.breeder_trade.breeder_first_name} {paymentData.breeder_trade.breeder_last_name}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>
                        <span className="text-success" style={{ fontWeight: 'bolder' }}>Account Number:</span> {paymentData.breeder_trade.bank_account_number}
                      </p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Email:  {paymentData.breeder_trade.email}</p>
                    </Col>
                  </Row>
                  <h6 className="text-primary mb-3">Additional Payment Details</h6>
                  <Row>
                    <Col md={6}>
                      <p><span className="text-primary" style={{ fontWeight: 'light' }}>Payment Code:</span> {paymentData.payment_code}</p>
                      <p><span className="text-primary" style={{ fontWeight: 'light' }}>Initiation Date:</span> {formatPaymentInitiationDate(paymentData.payment_initiation_date)}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
            )}

          </Card.Body>
        </Col>
            </Col>
          </Row>
        )}
        {activeSection === 'LetterOfCredit' && (
          <Row>
            <Col md={10}>
              <Col>
              <h5 className="text-success mb-4">Upload Letter of Credit Document</h5>
                <Form>
                  <Form.Group controlId="userInfo">
                    <Form.Label className="text-primary"></Form.Label>
                    {/* {userProfile && userProfile.user && (
                    <Form.Control
                      type="hidden"
                      readOnly
                      value={`${userProfile.user.first_name} ${userProfile.user.last_name} `}
                    />
                  )} */}

  </Form.Group>
  <Form.Group controlId="lcDocument">
    <Form.Label className="text-primary">Letter of Credit Document</Form.Label>
    <Form.Control
      type="file"
      onChange={(e) => setLcDocument(e.target.files[0])}
    />
  </Form.Group>
  <Button variant="primary"    onClick={handleLcUpload} style={{width:'200px'}}>
    Upload 
  </Button>
</Form>

              </Col>
            </Col>
          </Row>
        )}

        {activeSection === 'InvoiceTracking' && (
  <>
    {orders.map(renderOrderDetails)}
    <h6 className='mb-3 mt-3'>Logistics Statuses</h6>
    <div className="card mb-4" style={{ maxWidth: '100%', margin: 'auto' }}>
      <div className="card-body">
        <h5 className="card-title">Logistics Progress</h5>
        <div className="progress" style={{ position: 'relative', padding: '' }}>
          {shipmentProgressData.map((status, index) => (
            <div
              key={index}
              className={`progress-bar ${getStatusIndex(status) < getStatusIndex('Received') ? 'bg-primary' : 'bg-secondary'}`}
              role="progressbar"
              style={{ width: `${(100 / 5)}%` }}
            >
              {status}
            </div>
          ))}

          <div style={{ position: 'absolute', top: 0, left: `${(getStatusIndex('Received') * (100 / 5) + (50 / 5))}%`, transform: 'translateX(-50%)' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#fff', borderRadius: '50%', border: '2px solid #007bff' }}></div>
          </div>
        </div>
        <h6 className='mt-3 mb-2'>Current Statuses</h6>
        <ul className="list-group">
          {logisticsStatuses.map((status) => (
            <li
              key={status.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: 'white',
                opacity: 0.7,
                borderBottom: '1px solid #ddd', // Add a border for separation
                padding: '10px', // Add padding for better spacing
              }}
            >
              <div>
                {/* <span style={{ fontWeight: 'bold' }}>{`Invoice #${status.invoice_number}`}</span> */}
                <br />
                Invoice No: <span style={{fontWeight:'bold'}} className='text-dark'>{` ${status.invoice_number}`}</span>
              </div>
              <div>
                <Card style={{width:'170px', height:'40px', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'blue', borderRadius:'30px', textTransform:'capitalize'}} className={'card text-light'} disabled>
                  {status.status}
                </Card>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </>
)}

        {/* Add more sections based on the activeSection state */}
      </Container>

  <Container>
    <Row>
      
    </Row>
  </Container>
</div>

  );
};

export default BankDashboard;
