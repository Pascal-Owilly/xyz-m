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
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';

import logo from './logo.jpeg';

const CustomerServiceDashboard = () => {

  const baseUrl = BASE_URL;
  const [quotations, setQuotations] = useState([]);
  // Function to handle pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const [confirmingId, setConfirmingId] = useState(null);

  const isConfirming = (quotationId) => confirmingId === quotationId;

  const handleConfirm = (quotationId) => {
    setConfirmingId(quotationId);
    handleConfirmation(quotationId);
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
      const currentStatus = quotations.find(q => q.id === quotationId).status;
      const newStatus = currentStatus === "active" ? "closed" : "active";
  
      const response = await axios.put(
        `${baseUrl}/api/quotations/${quotationId}/`, 
        {
          confirm: true,
          // Include other required fields here
          buyer:  quotations.find(q => q.id === quotationId).buyer,
          seller:  quotations.find(q => q.id === quotationId).seller,
          product: quotations.find(q => q.id === quotationId).confirm,

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

  const [closingQuotationId, setClosingQuotationId] = useState(null);

const handleToggleStatus = async (quotationId) => {
    const accessToken = Cookies.get('accessToken');

    try {
        setClosingQuotationId(quotationId); // Set the ID of the quotation being closed
        const quotationToUpdate = quotations.find(q => q.id === quotationId);
        
        // Create form data with required fields
        const formData = {
            buyer: quotationToUpdate.buyer,
            message: quotationToUpdate.message,
            product: quotationToUpdate.product,
            quantity: quotationToUpdate.quantity,
            unit_price: quotationToUpdate.unit_price,
            status: 'closed', // Always set the status to 'closed'
        };

        // Ask for confirmation before proceeding
        const confirmClose = window.confirm("Are you sure you want to close this order? This action is irreversible.");

        if (confirmClose) {
            // Update the quotation status on the server
            const response = await axios.put(
                `${baseUrl}/api/quotations/${quotationId}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            // Optionally, you can update the UI to reflect the new status
        }
    } catch (error) {
        console.error('Error closing quotation:', error);
        // Optionally, you can show an error message or handle the error in other ways
    } finally {
        setClosingQuotationId(null); // Reset the closingQuotationId after the process is complete
    }
};

useEffect(() => {
  // Fetch quotations from the server whenever closingQuotationId changes
  const fetchUpdatedQuotations = async () => {
      try {
          const accessToken = Cookies.get('accessToken');
          const response = await axios.get(`${baseUrl}/api/quotations/`, {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          });
          setQuotations(response.data);
          console.log('quotations', response.data)
      } catch (error) {
          console.error('Error fetching quotations:', error);
      }
  };

  if (closingQuotationId !== null) {
      fetchUpdatedQuotations();
  }
}, [baseUrl, closingQuotationId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    return `${year}-${month}-${day}`;
  };

  const styles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor:'rgb(249, 250, 251)',
      color: '#666666',
    },
    headerTitle: {
      color:'#666666',
      fontWeight:'bold',
      marginBottom:'10px',
      marginTop:'10px',

    },
    detail:{
      fontSize:'13px',
      fontWeight:'medium',
    },
    title: {
      fontSize: 16,
      marginBottom: 10,
      textAlign: 'center',
      fontWeight:'bold',
      textDecoration: '',
      color: '#fff',
      marginBottom:'20px',
      backgroundColor:'#001b42',
      padding:'7px',
      borderRadius:'5px',
    },
    section: {
      marginBottom: 20,
    },
    table: {
      display: 'table',
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 0.5,
      borderColor: 'rgb(102, 102, 102)',
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: 'row',
    },
    tableCellLabel: {
      width: '30%',
      borderStyle: 'solid',
      borderWidth: 0.5,
      borderColor: 'rgb(102, 102, 102)',
      padding: 5,
      backgroundColor: '',
      color: 'rgb(102, 102, 102)',
      fontWeight: '500',
      fontSize: 13,
      flexDirection: 'column',

    },
    tableCellData: {
      width: '70%',
      borderStyle: 'solid',
      borderWidth: 0.5,
      borderColor: 'rgb(102, 102, 102)',
      padding: 5,
      fontSize: 13,
      color: 'rgb(102, 102, 102)',
      flexDirection: 'column',

    },
    footer: {
      textAlign: 'center',
      marginTop: 20,
    },
    logoContainer: {
      position: 'absolute',
      top: 30, // Adjust the position as needed
      left: 30, // Adjust the position as needed
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: 50, // Adjust the size of the logo as needed
      height: 50, // Adjust the size of the logo as needed
      marginRight: 10, // Adjust the spacing between the logo and buyer details as needed
    },
    buyerDetailsContainer: {
      position: '',
      top: 30, // Adjust the position as needed
      right: 30, // Adjust the position as needed
      display:'block',
    },
    hr :{
      width:'100%',
      color:'green',
      marginBottom:'20px',
      marginTop:'10px',
    },
    addressContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between' ,
      flexDirection:'row',
      border:'1px solid #ddd',
      padding:'7px',
      marginBottom:'20px',
      // fontFamily:'verdana',
      fontSize:'11px',
      color: 'rgb(102, 102, 102)',

    },
  });

  const QuotationListPDF = ({ quotation }) => (
    <Document>
      <Page style={styles.page}>
      <View style={styles.titlePage}>
        <Image src={logo} style={styles.logoContainer} />
      </View>
      <Text style={styles.title}>Quotation for Supply of {quotation.product}</Text>
        <View style={styles.hr} />
        {/* Header Section */}
      <View style={styles.header}>
        {/* Buyer Details */}
        <View style={styles.addressContainer}>
        <View>
          <Text style={styles.headerTitle}>From:</Text>
          {/* <View style={styles.hr} /> */}
          <Text style={styles.detail}>Full Name: {quotation.seller_full_name}</Text>
          <Text style={styles.detail}>Email:{quotation.seller_email}</Text>
          <Text style={styles.detail}>Address:{quotation.seller_address}</Text>
          <Text style={styles.detail}>County:{quotation.seller_county}</Text>
        </View>
          {/* Seller Details */}
        <View>
          <Text style={styles.headerTitle}>To:</Text>
          {/* <View style={styles.hr} /> */}
          <Text style={styles.detail}>Full Name: {quotation.buyer_full_name }</Text>
          <Text style={styles.detail}>Email: {quotation.buyer_email}</Text>
          <Text style={styles.detail}>Address: {quotation.buyer_address}</Text>
          <Text style={styles.detail}>Country:  {quotation.buyer_country}</Text>
        </View>
        </View>
      </View>

      {/* Content Image */}
      {/* <Image src="./logo.jpeg" style={styles.contentImage} /> */}

      {/* Title Page Logo Image */}
  
        <View style={styles.table}>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Product:</Text>
            <Text style={styles.tableCellData}>{quotation.product}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Unit Price:</Text>
            <Text style={styles.tableCellData}>{quotation.unit_price}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Created on:</Text>
            <Text style={styles.tableCellData}>{formatDate(quotation.created_at)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Delivered by:</Text>
            <Text style={styles.tableCellData}>{quotation.delivery_time}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>No:</Text>
            <Text style={styles.tableCellData}>#{quotation.id}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Message:</Text>
            <Text style={styles.tableCellData}>{quotation.message}</Text>
          </View>
  
        <View style={styles.footer}>
          <Text>Thank you</Text>
        </View>
      </Page>
    </Document>
  );
   
  return (
    <div className='main-container container-fluid' style={{ minHeight: '85vh' }}>

        {/* Navbar */}
        <Navbar bg="" expand="lg" variant="dark" style={{background:'#001b40', fontSize:'12px', borderRadius:'30px'}}>
      <Navbar.Brand  style={{fontSize:'14px'}}>
        List of all quoatations
      </Navbar.Brand>
      <Navbar.Collapse id="navbarNav">
      </Navbar.Collapse>
    </Navbar>
      <br />

  <div className="quotation-list-container" style={{ background: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '20px', color: '#999999', fontSize: '13px' }}>
    <h1 className="quotation-list-header text-secondary" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Quotation List</h1>
   
    <table className="table table-responsive">
      <thead>
        <tr>
          <th className='' style={{color:'#666666'}}> No</th>
          {/* <th className='' style={{color:'#666666'}}>Seller</th> */}

          <th className='' style={{color:'#666666'}}>Product</th>
          <th className='' style={{color:'#666666'}}>Buyer</th>
          <th className='' style={{color:'#666666'}}>Seller</th>
          <th className='' style={{color:'#666666'}}>Unit Price</th>
          <th className='' style={{color:'#666666'}}>Quantity</th>
          {/* <th className='' style={{color:'#666666'}}>Message</th> */}
          <th className='' style={{color:'#666666'}}>Status</th>
          <th className='' style={{color:'#666666'}}>Action</th>
          <th className='' style={{color:'#666666'}}>View PDF </th>
        </tr>
      </thead>
      <tbody>
        {currentQuotations.slice().map((quotation) => (
          <tr key={quotation.id}>
            <td className='text' style={{color:'#666666'}}>#{quotation.id}</td>
            {/* <td className='text' style={{color:'#666666'}}>{quotation.seller} </td> */}

            <td className='text' style={{color:'#666666'}}>{quotation.product}</td>
            <td className='text' style={{color:'#666666'}}>{quotation.buyer_full_name}</td>
            <td className='text' style={{color:'#666666'}}>{quotation.seller_full_name}</td>

            <td className='text' style={{color:'#666666'}}>{quotation.unit_price}</td>
            <td className='text' style={{color:'#666666'}}>{quotation.quantity}</td>
            {/* <td className='text' style={{color:'#666666'}}>{quotation.message}</td> */}
            <td className='text' style={{color:'#666666'}}>
              {quotation.status}
            </td>
            <td className='text' style={{color:'#666666'}}>
            <button
    onClick={() => handleToggleStatus(quotation.id)}
    style={{
        fontSize: '13px',
        padding: '5px 10px',
        borderRadius: '5px',
        background: quotation.status === 'active' ? '#008000' : '#001b42',
        color: 'white',
        border: 'none',
        cursor: quotation.status === 'active' ? 'pointer' : 'not-allowed', // Set cursor based on status
        pointerEvents: quotation.status === 'active' ? 'auto' : 'none', // Disable pointer events if status is closed
    }}
>
    {closingQuotationId === quotation.id ? 'Closing...' : (quotation.status === 'active' ? 'Open' : 'Closed')}
</button>
            </td>
            <div className='d-flex mt-3 mx-3'>
    <PDFDownloadLink document={<QuotationListPDF quotation={quotation} />} fileName={`quotation_${quotation.id}.pdf`}>
      {({ blob, url, loading, error }) => (
        <a
          href={loading ? '#' : url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '15px',
            borderRadius: '5px',
            background: loading ? '#999999' : '#fff',
            color: '#666666',
            textDecoration: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'View PDF'}
        </a>
      )}
    </PDFDownloadLink>
  </div>          </tr>
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
