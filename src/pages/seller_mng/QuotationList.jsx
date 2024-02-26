import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import { Row, Col, Card, Container, Form, Table, Button, ProgressBar, Navbar, Nav, NavDropdown, Pagination, Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { HiBell, HiCube, HiExclamation, HiCurrencyDollar, HiChartBar } from 'react-icons/hi';
import { FaEnvelope } from 'react-icons/fa';  
import { HiEye, HiEyeOff } from 'react-icons/hi'; // Example icons, you can choose others
import { FaTruck, FaShippingFast, FaCheck, FaArchive } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PurchaseOrders from '../seller_mng/PurchaseOrdersSeller';
import './styles.css'
const CustomerServiceDashboard = () => {

  const baseUrl = BASE_URL;
  const [quotations, setQuotations] = useState([]);
  // Function to handle pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
 

  // invoiceslist
  const [loading, setLoading] = useState(true);

  // paination logic
  const itemsPerPage = 10; // Number of items to display per page
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


// Pagination
const totalPages = Math.ceil(quotations.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentQuotations = quotations.slice(indexOfFirstItem, indexOfLastItem);



// State to manage expanded/minimized state of invoices
const [expandedInvoices, setExpandedInvoices] = useState({});


  // Quotation

  const [confirmedQuotation, setConfirmedQuotation] = useState(null);

  useEffect(() => {
    // Fetch quotations from the server
    const fetchQuotations = async () => {
      try {
        const accessToken = Cookies.get('accessToken');
        const response = await axios.get(`${baseUrl}/api/quotations/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setQuotations(response.data);
        
      } catch (error) {
        console.error('Error fetching quotations:', error);
      }
    };

    fetchQuotations();
  }, [baseUrl]);

  const handleConfirmation = async (quotationId) => {
    try {
      const accessToken = Cookies.get('accessToken');
      const response = await axios.put(
        `${baseUrl}/api/quotations/${quotationId}/`, 
        {
          confirm: true,
          // Include other required fields here
          buyer:  quotations.find(q => q.id === quotationId).buyer,
          seller:  quotations.find(q => q.id === quotationId).seller,
  
          product: quotations.find(q => q.id === quotationId).product,
          message:  quotations.find(q => q.id === quotationId).message,
          quantity: quotations.find(q => q.id === quotationId).quantity,
          unit_price: quotations.find(q => q.id === quotationId).unit_price,
        },
     
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setConfirmedQuotation(quotationId); // Update the confirmedQuotation state with the ID of the confirmed 
      navigate('/purchase-order');

      // Optionally, you can show a success message or perform other actions upon successful confirmation
    } catch (error) {
      console.error('Error confirming quotation:', error);
      // Optionally, you can show an error message or handle the error in other ways
    }
  };
   
  return (
    <div className='main-container container-fluid' style={{ minHeight: '85vh' }}>

        {/* Navbar */}
        <Navbar bg="" expand="lg" variant="dark" style={{background:'#001b40'}}>
      <Navbar.Brand>
        List of all quoatations
      </Navbar.Brand>
      <Navbar.Collapse id="navbarNav">
        
      </Navbar.Collapse>
    </Navbar>
        <hr />

        {/* contact form */}

        {/* Floating Message Icon */}
        <div className="floating-message-icon" onClick={handleModalShow}>
        <FaEnvelope size={30} className="" style={{color:'#001b40'}} />
      </div>

      <br />

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

      <div className="card" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '5px', backgroundColor: '#ffffff', padding: '20px', fontSize: '12px' }}>
  
  <table style={{ width: '100%' }}>
    
    <thead>
      <tr>
        <th>Quotation ID</th>
      
        <th>Buyer</th>
        <th>Product</th>
        <th>Unit Price</th>
        <th>Quantity</th>
        <th>Message</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>

    {Array.isArray(currentQuotations) && currentQuotations.reverse().map((quotation) => (
        <tr key={quotation.id}>
          <td>
            <div className="card" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '5px', padding: '10px' }}>
              {quotation.id}
            </div>
          </td>
          <td>
            <div className="card" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '5px', padding: '10px' }}>
              {quotation.buyer}
            </div>
          </td>

          <td>
            <div className="card" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '5px', padding: '10px' }}>
              {quotation.product}
            </div>
          </td>
          <td>
            <div className="card" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '5px', padding: '10px' }}>
              {quotation.unit_price}
            </div>
          </td>
          <td>
            <div className="card" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '5px', padding: '10px' }}>
              {quotation.quantity}
            </div>
          </td>
          <td>
            <div className="card" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '5px', padding: '10px' }}>
              {quotation.message}
            </div>
          </td>
          <td>
            <div className="card" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '5px', padding: '10px' }}>
              {confirmedQuotation === quotation.id ? 'Confirmed' : 'Pendi ng'}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<hr />
<Pagination>
  {Array.from({ length: Math.ceil(quotations.length / itemsPerPage) }, (_, i) => (
    <Pagination.Item style={{ backgroundColor: '#001b40 !important' }} key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
      <span>{i + 1}</span>
    </Pagination.Item>
  ))}
</Pagination>
    </div>
  );
};

export default CustomerServiceDashboard;
