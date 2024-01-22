import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import { Row, Col, Card, Container, Form, Table, Button, ProgressBar, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';


const CustomerServiceDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const baseUrl = BASE_URL;

  const [activeSection, setActiveSection] = useState('BreederPayments');

  const [arrivedOrdersData, setArrivedOrdersData] = useState([]);
  const [shipmentProgressData, setShipmentProgressData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [logisticsStatuses, setLogisticsStatuses] = useState([]);
  const [orders, setOrders] = useState([]);

  const [letterOfCredits, setLetterOfCredits] = useState([]);
  const accessToken = Cookies.get('accessToken');

useEffect(() => {
    // Fetch letter of credits from the new endpoint with headers
    axios.get(`${baseUrl}/api/letter_of_credits/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        console.log('Fetched letter of credits:', response.data);
        setLetterOfCredits(response.data);

        console.log('LC list', response)
      })
      .catch(error => console.error('Error fetching letter of credits:', error));
  }, [baseUrl, accessToken]);


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

  useEffect(() => {
    // Fetch payments from the new endpoint
    axios.get(`${baseUrl}/api/abattoir-payments/`)
      .then(response => {
        console.log('Fetched payments:', response.data);
        setPayments(response.data);
      })
      .catch(error => console.error('Error fetching payments:', error));
  }, []);

  const handleUpdateStatus = (paymentId, newStatus) => {
    // Ensure paymentId is valid
    if (!paymentId) {
      console.error('Invalid paymentId:', paymentId);
      return;
    }

    // Update the payment status
    axios.put(`${baseUrl}/api/abattoir-payments/${paymentId}/`, { status: newStatus })
      .then(response => {
        // Update the local state with the updated payment
        setPayments(payments.map(payment => (payment.payments_id === paymentId ? response.data : payment)));
      })
      .catch(error => console.error('Error updating payment status:', error));
  };

  const handleViewDetails = (payment) => {
    // Toggle the detailed view
    setShowDetails(!showDetails);
    // Set the selected payment for detailed view
    setSelectedPayment(payment);
  };

  // Status tracking

  const getStatusIndex = (status) => ['ordered', 'dispatched', 'shipped', 'arrived', 'received'].indexOf(status);


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

  const renderBreederTradeTable = (breederTrade) => {
    return (
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(breederTrade).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  const renderDocumentPreview = (documentUrl, altText) => {
    if (!documentUrl) {
      return null;
    }
  
    // Get the file extension
    const fileExtension = documentUrl.split('.').pop().toLowerCase();
    console.log('File Extension:', fileExtension);
  
    // Check the file type and render accordingly
    if (fileExtension === 'pdf') {
      return <embed src={documentUrl} type="application/pdf" width="50" height="50" />;
    } else if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
      return <img src={documentUrl} alt={altText} width="50" height="50" />;
    } else {
      // For other file types, provide a generic link
      return <a href={documentUrl} target="_blank" rel="noopener noreferrer">View Document</a>;
    }
  };
  
  

  return (
    <div className='main-container container-fluid' style={{ minHeight: '85vh' }}>


        {/* Navbar */}
        <Navbar bg="primary" expand="lg" variant="dark">
      <Navbar.Brand>
        <span style={{ fontWeight: 'bold' }}>Customer Service</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">
        <Nav className="ml-auto">
          <Nav.Link
            onClick={() => handleButtonClick('BreederPayments')}
            className={`mr-2 text-white ${activeSection === 'BreederPayments' ? 'active-buyer-button' : ''}`}
          >
            Breeder Payments
          </Nav.Link>
          <Nav.Link
            className={`text-white ${activeSection === 'LetterOfCredit' ? 'active-buyer-button' : ''}`}
            onClick={() => handleButtonClick('LetterOfCredit')}
          >
            LCs List
          </Nav.Link>
          <Nav.Link
            className={`text-white ${activeSection === 'InvoiceTracking' ? 'active-buyer-button' : ''}`}
            onClick={() => handleButtonClick('InvoiceTracking')}
          >
            <well>
            Invoice Tracking
            </well>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
        <hr />
     
      {/* Detailed View */}
      {selectedPayment && showDetails && (
        
        
        <Card className='mt-3'>

          <Card.Body>
            <h5>Details for Payment Code: {selectedPayment.payment_code}</h5>
            {renderBreederTradeTable(selectedPayment.breeder_trade)}
          </Card.Body>
        </Card>
      )}

{activeSection === 'BreederPayments' && (
  
 <Card>
                  <h5 className='mb-4 mx-3 mt-2'>Payment Information & Updates</h5>

 <Card.Body>
   <Table striped bordered hover>
     <thead>
       <tr>
         <th>Payment Code</th>
         <th>Status</th>
         <th>Action</th>
         {/* Add more columns as needed */}
       </tr>
     </thead>
     <tbody>
       {payments && payments.map(payment => (
         <tr key={payment.payments_id}>
           <td>{payment.payment_code}</td>
           <td>{payment.status}</td>
           <td>
             <div className='d-flex align-items-center'>
               <select className='form-select me-3 p-1' style={{borderRadius:'30px', background:'rgb(247, 248, 251)', color:'black', border:'none'}} onChange={(e) => handleUpdateStatus(payment.payments_id, e.target.value)}>
                 <option value="payment_initiated" selected={payment.status === 'payment_initiated'}>Sent to Bank</option>
                 <option value="disbursed" selected={payment.status === 'disbursed'}>Disbursed</option>
                 <option value="paid" selected={payment.status === 'paid'}>Paid</option>
               </select>
               <Button variant='success text-light' className='btn-sm m-auto' style={{width:'30%', color:'rgb(0, 27, 49)', fontSize:'12px'}} onClick={() => handleUpdateStatus(payment.payments_id, payment.status)}>
                 Update Status
               </Button>
               <Button variant='info' className='btn-sm m-auto ms-2' style={{width:'30%', fontSize:'14px'}} onClick={() => handleViewDetails(payment)}>
                 {showDetails ? 'Hide Details' : 'View Details'}
               </Button>
             </div>
           </td>
           {/* Add more columns as needed */}
         </tr>
       ))}
     </tbody>
   </Table>
 </Card.Body>
</Card>

)}

{activeSection === 'LetterOfCredit' && (
  <Card>
    <h5 className='mb-4 mx-3 mt-2'>Letter of Credits</h5>
    <Card.Body>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Letter of Credit Document</th>
            <th>Buyer</th>
            <th>Issue Date</th>
            <th>Status</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {letterOfCredits && letterOfCredits.map(letterOfCredit => (
            <tr key={letterOfCredit.id}>
              <td>{renderDocumentPreview(letterOfCredit.lc_document, `LC Document for ${letterOfCredit.buyer.username}`)}</td>
              <td>{letterOfCredit.buyer.username}</td>
              <td>{new Date(letterOfCredit.issue_date).toLocaleString()}</td>
              <td>{letterOfCredit.status}</td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
)}

{activeSection === 'InvoiceTracking' && (
  <>
    {orders.map(renderOrderDetails)}
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
                <p  style={{ margin: '10px 0', fontSize: '18px' }}>
                  Invoice No: <span className='text-dark' style={{ fontWeight: 'normal', color: '#007bff', fontWeight:'bold' }}>{` #${status.invoice_number}`}</span>
                </p> 
              </div>
              <div>
              <Card style={{
  width: '100px',
  height: '40px',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(to right, #4e73df, #224abe)', // Adjust gradient colors
  borderRadius: '0', // Removed border radius
  textTransform: 'capitalize',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Added box shadow for a floating effect
  color: '#fff', // Adjusted text color
}} className={'card text-light'} disabled>
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
    </div>
  );
};

export default CustomerServiceDashboard;
