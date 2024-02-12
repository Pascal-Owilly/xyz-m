// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container, Form, Button, ProgressBar, Navbar, Nav, NavDropdown } from 'react-bootstrap';
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
  const [lcUploadSuccess, setLcUploadSuccess] = useState(false);
  const [lcUploadMessage, setLcUploadMessage] = useState('');


  // Status tracking

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
            'X-User-ID': userProfile?.user?.id,
            'X-User-Email': userProfile?.user?.email,
          },
        }
      );
  
      console.log('upload response', response);
      if (response.status === 201) {
        setLcUploadSuccess(true);
        setLcUploadMessage('Letter of credit document uploaded successfully');
        // Optionally, you can perform additional actions upon successful upload
      } else {
        const data = response.data;
        setLcUploadSuccess(false);
        setLcUploadMessage(data.error || 'Error uploading letter of credit document');
      }
    } catch (error) {
      console.error('Error uploading letter of credit document:', error);
      setLcUploadSuccess(false);
      setLcUploadMessage('Error uploading letter of credit document');
    }
  };
  
  
  const handleButtonClick = (section) => {
    setActiveSection(section);
  };



  return (
   <div className='main-container ' style={{ minHeight: '85vh', backgroundColor: '#f0f8ff' }}>

 {/* Navbar */}
 <Navbar style={{background:'#001b40'}} bg="" expand="lg" variant="dark">
        <Navbar.Brand >Bank Dashboard</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            <Nav.Link  onClick={() => handleButtonClick('BreederPayments')} className={`mr-2 text-white ${activeSection === 'BreederPayments' ? 'active-buyer-button' : ''}`}>
              Supplier Payments
            </Nav.Link>
            <Nav.Link className='text-white' onClick={() => handleButtonClick('LetterOfCredit')}>
              Letter of Credit
            </Nav.Link>
           
          </Nav>
        </Navbar.Collapse>
      </Navbar>

        <Container>
        {activeSection === 'BreederPayments' && (
          <Row>
            <Col md={10}>
        <Col>
          <Card.Body>
            <h5 className=" mb-4" style={{color:'#001b40'}} >Search Payment by Code</h5>
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
                      <p style={{ boxShadow: '0 4px 1px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>Seller: {paymentData.breeder_trade.abattoir}</p>
                      <p  style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}><span style={{fontWeight:'bold'}} className="text-success" >ID Number: </span>{paymentData.breeder_trade.id_number}</p>
                      <p style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>product: {paymentData.breeder_trade.breed}</p>
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
      <Col className="bg-light p-4 rounded shadow">
      {lcUploadSuccess ? (
  <div>
    <h6 className="text-success mb-4">Document uploaded successfully</h6>
    <p className="text-success">
      We will get back to you once the review is complete.
      <br />
      Thank you for your submission.
    </p>
    <Button variant="secondary btn-sm" onClick={() => setActiveSection('BreederPayments')} className="mt-3">
      Back 
    </Button>
  </div>
) : (
  <div>
    <h4 className="text-success mb-4">Upload Letter of Credit Document</h4>
    <Form>
      <Form.Group controlId="lcDocument">
        <Form.Label className="text-primary">Choose Document</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) => setLcDocument(e.target.files[0])}
        />
      </Form.Group>
      <Button variant="primary btn-sm mt-3" onClick={handleLcUpload} style={{ width: '30%', fontSize:'15px' }}>
        Upload
      </Button>
    </Form>
    {lcUploadMessage && (
      <div>
        <p className={lcUploadSuccess ? "text-success mt-3" : "text-danger mt-3"}>{lcUploadMessage}</p>
        <Button variant="secondary" onClick={() => setActiveSection('BreederPayments')} className="mt-3">
          Back to Breeder Payments
        </Button>
      </div>
    )}
  </div>
)}

      </Col>
    </Col>
  </Row>
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
