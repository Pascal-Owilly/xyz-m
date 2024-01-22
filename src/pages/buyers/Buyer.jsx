import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import { Row, Col, Card, Container, Form, Table, Button, ProgressBar, Navbar, Nav, NavDropdown, Pagination, Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { HiBell, HiCube, HiExclamation, HiCurrencyDollar, HiChartBar } from 'react-icons/hi';
import { FaEnvelope } from 'react-icons/fa';  

const styles = {
  invoiceContainer: {
    // backgroundColor: '#f5f5f5',
    padding: '20px',
    minHeight: '80vh',
  },
  invoiceItems: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    height: '100%',
    overflow: 'hidden', // Hide content overflow during transition
    transition: 'height 0.3s ease-in-out', // Transition height property
  },
  tableCell: {
    border: 'none',
  },
  invoiceList: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '10px',
  },
};


const CustomerServiceDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const baseUrl = BASE_URL;

  const [activeSection, setActiveSection] = useState('InformationSection');

  const [arrivedOrdersData, setArrivedOrdersData] = useState([]);
  const [shipmentProgressData, setShipmentProgressData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [logisticsStatuses, setLogisticsStatuses] = useState([]);
  const [orders, setOrders] = useState([]);

  const [letterOfCredits, setLetterOfCredits] = useState([]);
  const accessToken = Cookies.get('accessToken');
  const [userName, setUserName] = useState(''); // New state variable to store the user's name


  // invoiceslist
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState([]);

  // paination logic
  const itemsPerPage = 4; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);

  // contact form
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalShow = () => {
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic for handling form submission here
    // You may want to send the data to your backend or perform any other actions
    handleModalClose();  // Close the modal after submission
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

  const fetchInvoiceData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');

      // Fetch user data to get the user's ID
      const userResponse = await axios.get(`${baseUrl}/auth/user/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userId = userResponse.data.id;

      // Fetch invoices related to the logged-in user
      const response = await axios.get(`${baseUrl}/api/generate-invoice/?buyer=${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setInvoiceData(response.data);
      console.log('buyer response', response.data);
    } catch (error) {
      // Handle errors
      console.error('Error fetching invoice data:', error);
    }
  };

  // Fetch invoice data when the component mounts
  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const invoices = invoiceData.map((invoice) => ({
    invoiceNumber: invoice.invoice_number,
    date: invoice.invoice_date,
    dueDate: invoice.invoice_date,
    billTo: {
      name: invoice.buyer ? invoice.buyer.first_name : '', // Check if buyer is not null or undefined
      address: '123 Main Street, City, State, ZIP',
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
    },
    shipTo: 'Same as Bill To',
    items: [
      { title: invoice.breed, description: 'Goat meat from Africa', saleType: invoice.sale_type, quantity: invoice.quantity, unitPrice: invoice.unit_price  },
    ],
    taxRate: 0.08,
}));

// Pagination
const totalPages = Math.ceil(invoices.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentInvoices = invoices.slice(indexOfFirstItem, indexOfLastItem);

const paginate = (pageNumber) => setCurrentPage(pageNumber);


// State to manage expanded/minimized state of invoices
const [expandedInvoices, setExpandedInvoices] = useState({});

const toggleInvoice = (invoiceNumber) => {
  setExpandedInvoices((prevExpanded) => ({
    ...prevExpanded,
    [invoiceNumber]: !prevExpanded[invoiceNumber],
  }));
};


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
    // Fetch user data to get the name
    axios.get(`${baseUrl}/auth/user/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        const user = response.data;
        // Assuming user's first name and last name are available in the response
        setUserName(`${user.user.first_name} ${user.user.last_name}`);
      })
      .catch(error => console.error('Error fetching user data:', error));
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
      Welcome,  {userName && <span style={{ fontWeight: '' }}>{userName}</span>}

      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">
        <Nav className="ml-auto">
          <Nav.Link
            onClick={() => handleButtonClick('InformationSection')}
            className={`mr-2 text-white ${activeSection === 'InformationSection' ? 'active-buyer-button' : ''}`}
          >
            Info
          </Nav.Link>
          <Nav.Link
            className={`text-white ${activeSection === 'LetterOfCredit' ? 'active-buyer-button' : ''}`}
            onClick={() => handleButtonClick('LetterOfCredit')}
          >
            LCs List
          </Nav.Link>
          <Nav.Link
            className={`text-white ${activeSection === 'InvoiceList' ? 'active-buyer-button' : ''}`}
            onClick={() => handleButtonClick('InvoiceList')}
          >
            Received Invoices
          </Nav.Link>
          <Nav.Link
            className={`text-white ${activeSection === 'InvoiceTracking' ? 'active-buyer-button' : ''}`}
            onClick={() => handleButtonClick('InvoiceTracking')}
          >
            Invoice Tracking
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
        <hr />

        {/* contact form */}

        {/* Floating Message Icon */}
        <div className="floating-message-icon" onClick={handleModalShow}>
        <FaEnvelope size={30} className="text-success" />
      </div>

      {/* Contact Form */}
        <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="userField">
              <Form.Label>Your Name:</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" required />
            </Form.Group>

            <Form.Group controlId="messageField">
              <Form.Label>Your Message:</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Enter your message" required />
            </Form.Group>

            <Button variant="primary" type="submit">
              Send Message
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* enc contact */}
     
      {/* Detailed View */}
      {selectedPayment && showDetails && (
        
        <Card className='mt-3'>
          <Card.Body>
            <h5>Details for Payment Code: {selectedPayment.payment_code}</h5>
            {renderBreederTradeTable(selectedPayment.breeder_trade)}
          </Card.Body>
        </Card>
      )}

{activeSection === 'InformationSection' && (
  <div>
  <h5 className='mb-4 text-success mt-2'>Information section</h5>
<p>Here, you can seamlessly access and track all logistics details and updates. Explore the associated invoice list for your received LCs, effortlessly track invoices based on their ID, and feel free to send any inquiries our way using the message icon. Your convenience is our priority</p>
  </div>
)}

{activeSection === 'LetterOfCredit' && (
  <Card>
    <h5 className='mb-4 mx-3 mt-2'>Letter of Credits</h5>
    <Card.Body>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>LC Document</th>
            <th>LC ID</th>
            <th>Issue Date</th>
            <th>Status</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {letterOfCredits && letterOfCredits.map(letterOfCredit => (
            <tr key={letterOfCredit.id}>
              <td>{renderDocumentPreview(letterOfCredit.lc_document, `LC Document for ${letterOfCredit.buyer.username}`)}</td>
              <td>#{letterOfCredit.id}</td>
              <td>{new Date(letterOfCredit.issue_date).toLocaleString()}</td>
              <td style={{textTransform:'capitalize'}}>{letterOfCredit.status}</td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
)}

{activeSection === 'InvoiceList' && (
 <Container>

  <Row>
  <Col lg={8} style={styles.invoiceContainer}>
  <h5 className='mb-3'>Invoices List</h5>
  {/* {loading ? (
            <div className="text-center mt-5">
              Loading invoices...
            </div>
          ) : (
            <> */}
  {invoiceData.length === 0 ? (
    <div className="text-center mt-5">
      <HiExclamation size={40} color='#ccc' />
      <p className="mt-3">No invoices yet !</p>
    </div>
  ) : (
    <>
      {currentInvoices.map((invoice, index) => (
        <Container key={index} style={{ ...styles.invoiceItems, height: expandedInvoices ? 'auto' : '100%', marginBottom: '20px' }}>
          <Button variant="link" onClick={() => toggleInvoice(invoice.invoiceNumber)}>
            {expandedInvoices[invoice.invoiceNumber] ? 'Hide Details' : 'Show Details'} - #{invoice.invoiceNumber}
          </Button>
          {expandedInvoices[invoice.invoiceNumber] && (
            <Table borderless>
<tbody>
            <tr>
              <td><strong>Invoice Number:</strong></td>
              <td style={{ textTransform: 'uppercase' }}>{invoice.invoiceNumber}</td>
              <td><strong>Date:</strong></td>
              <td>{invoice.date}</td>
            </tr>
            <tr>
              <td><strong>Due Date:</strong></td>
              <td>{invoice.dueDate}</td>
              <td colSpan="2"></td>
            </tr>
            <tr>
              <td colSpan="2"></td>
              <td colSpan="2"></td>
            </tr>
            {/* Bill To */}
            <tr>
              <td colSpan="4">
                <h5>Bill To:</h5>
                <p>{invoice.billTo.name}</p>
                <p>{invoice.billTo.address}</p>
                <p>Email: {invoice.billTo.email}</p>
                <p>Phone: {invoice.billTo.phone}</p>
                <hr />
              </td>
            </tr>
            {/* Ship To */}
            <tr>
              <td colSpan="4">
                <h5>Ship To:</h5>
                <p>{invoice.shipTo}</p>
                <hr />
              </td>
            </tr>
            {/* Items */}
            <tr>
              <td colSpan="4">
                <h5>Items:</h5>
                <Table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Sale Type</th>
                      <th>Unit Price</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, itemIndex) => (
                      <tr key={itemIndex}>
                        <td>{item.title}</td>
                        <td>{item.description}</td>
                        <td>{item.quantity} pc</td>
                        <td>{item.saleType}</td>
                        <td>$ {item.unitPrice}</td>
                        <td>$ {item.quantity * item.unitPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <hr />
              </td>
            </tr>
          </tbody>            </Table>
          )}
        </Container>
      ))}
      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Pagination.Item key={page} active={page === currentPage} onClick={() => paginate(page)}>
              {page}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </>
  )}
  {/* </>
  )} */}

</Col>
  </Row>

  </Container>
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
                <p  style={{ margin: '10px 0', fontSize: '18px', color:'black' }}>
                  Invoice No: <span className='' style={{ fontWeight: 'normal', color: '#000', fontWeight:'500' }}>{` #${status.invoice_number}`}</span>
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
