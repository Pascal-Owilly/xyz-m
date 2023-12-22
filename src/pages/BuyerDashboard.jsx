import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Pagination } from 'react-bootstrap';
import { HiBell, HiCube, HiExclamation, HiCurrencyDollar, HiChartBar } from 'react-icons/hi';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { checkUserRole } from './auth/CheckUserRoleUtils';

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

const BuyerInvoice = () => {

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

  // Sample invoice data
const baseUrl = BASE_URL;

  const role = checkUserRole()
  const [profile, setProfile] = useState([]);
      const accessToken = Cookies.get('accessToken');
      const [user, setUser] = useState({});
      const [loading, setLoading] = useState(true);

  const navigate = useNavigate()
  const [invoiceData, setInvoiceData] = useState([]);

  // paination logic
  const itemsPerPage = 4; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);


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

  return (

    <Container fluid className='main-container' style={{ height: 'auto', backgroundColor: '#ddd' }}>
      <Row>
    <Col lg={{ span: 3, offset: 9 }} className='text-right'>
      <div style={{ marginBottom: '25px', padding: '5px', backgroundColor: '#e0e0e0', borderRadius: '30px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width:'auto' }}>
        <p className='text-center mt-1'>{`${Greetings()} `} </p>
        <span style={{ textTransform: 'capitalize' }}></span>

      </div>
    </Col>
  </Row>

  <Row>
    
<Col lg={8} style={styles.invoiceContainer}>
  <h3 className='mb-3'>Manage Your Invoices and Transactions</h3>
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
            {expandedInvoices[invoice.invoiceNumber] ? 'Hide Invoice' : 'Show Invoice'} - {invoice.invoiceNumber}
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


                {/* Column 4 (Placeholder) */}
                <Col lg={4}>
          <div style={{  padding: '' }}>
<div>
                    {/* Flash message */}
            

                    {/* Notifications */}
                    <div style={{ borderRadius: '50%', position: 'relative', float: 'right', top: 0, backgroundColor: 'lightblue', padding: '10px', width: '40px', height: '40px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <HiBell size={20} color='white' />
                    </div>

                    {/* Purchase Issuance */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCube className='mr-2' /> Purchase Issuance
                    </button>

                    {/* Banking Transactions */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCurrencyDollar className='mr-2' /> Banking Transactions
                    </button>

                    {/* Cataloging live deals */}
                    <button style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiExclamation className='mr-2' /> Cataloging live deals
                    </button>

                    {/* Management of deals at different stages */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCube className='mr-2' /> Management of deals at different stages
                    </button>

                    {/* Tracking financed and paid-off deals */}
                    <button style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', marginBottom: '10px', padding: '15px', width: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiChartBar className='mr-2' /> Tracking financed and paid-off deals
                    </button> 
                    </div>
                    </div>
        </Col>
      </Row>
    </Container>
    
  );
};

export default BuyerInvoice;
