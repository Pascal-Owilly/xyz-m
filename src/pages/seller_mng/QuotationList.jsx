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
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';



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
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      fontWeight: 'bold',
      textDecoration: 'underline',
      color: '#999999',
    },
    section: {
      marginBottom: 20,
    },
    table: {
      display: 'table',
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: 'row',
    },
    tableCellLabel: {
      width: '30%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
      padding: 5,
      backgroundColor: '#008000',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 13,
    },
    tableCellData: {
      width: '70%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
      padding: 5,
      fontSize: 18,
      color: '#666666',
    },
    footer: {
      textAlign: 'center',
      marginTop: 20,
    },
  });

  const QuotationListPDF = ({ quotation }) => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Quotation Details</Text>
        <View style={styles.hr} />
  
        <View style={styles.table}>
          {/* <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Quotation Number:</Text>
            <Text style={styles.tableCellData}>{quotation.number}</Text>
          </View> */}
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Delivery by:</Text>
            <Text style={styles.tableCellData}>{formatDate(quotation.created_at)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Product:</Text>
            <Text style={styles.tableCellData}>{quotation.product}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Unit Price:</Text>
            <Text style={styles.tableCellData}>{quotation.unit_price}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Message:</Text>
            <Text style={styles.tableCellData}>{quotation.message}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Date created:</Text>
            <Text style={styles.tableCellData}>{quotation.delivery_time}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Status:</Text>
            <Text style={styles.tableCellData}>{confirmedQuotation === quotation.id ? 'Confirmed' : 'Pending'}</Text>
          </View>
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
   
    <table className="table responsive">
      <thead>
        <tr>
          <th className='' style={{color:'#666666'}}> No</th>
          {/* <th className='' style={{color:'#666666'}}>Seller</th> */}

          <th className='' style={{color:'#666666'}}>Product</th>
          <th className='' style={{color:'#666666'}}>Buyer</th>
          <th className='' style={{color:'#666666'}}>Seller</th>
          <th className='' style={{color:'#666666'}}>Unit Price</th>
          <th className='' style={{color:'#666666'}}>Quantity</th>
          <th className='' style={{color:'#666666'}}>Message</th>
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
            <td className='text' style={{color:'#666666'}}>{quotation.message}</td>
            <td className='text' style={{color:'#666666'}}>
              {quotation.status ? 'Confirmed' : 'Pending'}
            </td>
            <td className='text' style={{color:'#666666'}}>
              {quotation.confirm ? (
                <button
                  disabled
                  style={{
                    fontSize: '13px',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: 'green',
                    color: 'white',
                    border: 'none',
                    cursor: 'not-allowed'
                  }}
                >
                  Confirmed
                </button>
              ) : (
                <button
                  onClick={() => handleConfirm(quotation.id)}
                  disabled={isConfirming(quotation.id) || confirmedQuotation === quotation.id}
                  style={{
                    fontSize: '13px',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    background: isConfirming(quotation.id) ? '#999999' : '#001b40',
                    color: 'white',
                    border: 'none',
                    cursor: isConfirming(quotation.id) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isConfirming(quotation.status) ? 'Opening...' : 'Close'}
                </button>
              )}
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
