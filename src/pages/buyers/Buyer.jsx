import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import { Row, Col, Card, Container, Form, Table, Button, ProgressBar, Navbar, Nav, NavDropdown, Pagination, Modal} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { HiBell, HiCube, HiExclamation, HiCurrencyDollar, HiChartBar } from 'react-icons/hi';
import { FaEnvelope } from 'react-icons/fa';  
import { HiEye, HiEyeOff } from 'react-icons/hi'; // Example icons, you can choose others
import { FaTruck, FaShippingFast, FaCheck, FaArchive, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PurchaseOrders from '../seller_mng/PurchaseOrdersSeller';

// convert quotation to pdf
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';


const CustomerServiceDashboard = ({packageInfo}) => {
  const navigate = useNavigate()
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const baseUrl = BASE_URL;

  const [activeSection, setActiveSection] = useState('Quotation');

  const [arrivedOrdersData, setArrivedOrdersData] = useState([]);
  const [shipmentProgressData, setShipmentProgressData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [logisticsStatuses, setLogisticsStatuses] = useState([]);
  const [orders, setOrders] = useState([]);

  const [letterOfCredits, setLetterOfCredits] = useState([]);
  const accessToken = Cookies.get('accessToken');
  const [userName, setUserName] = useState(''); // New state variable to store the user's name

  const [currentPage, setCurrentPage] = useState(1);
  const [quotationsPerPage] = useState(5); // Number of quotations per page
  // Quotation

  const [quotations, setQuotations] = useState([]);
  const [confirmedQuotation, setConfirmedQuotation] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedPackageInfo, setSelectedPackageInfo] = useState(null);
  const [buyers, setBuyers] = useState([]);

  const [sellers, setSellers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);

  // LC
  const [lcUploadMessage, setLcUploadMessage] = useState('');
  const [lcUploadSuccess, setLcUploadSuccess] = useState(false);
  const [lcDocument, setLcDocument] = useState(null);

  // Pagination
 const indexOfLastQuotation = currentPage * quotationsPerPage;
 const indexOfFirstQuotation = indexOfLastQuotation - quotationsPerPage;
 const currentQuotations = quotations.slice(indexOfFirstQuotation, indexOfLastQuotation);

 const [confirming, setConfirming] = useState(false);
 const [confirmingId, setConfirmingId] = useState(null);

 const isConfirming = (quotationId) => confirmingId === quotationId;

 const handleConfirm = (quotationId) => {
   setConfirmingId(quotationId);
   handleConfirmation(quotationId);
 };

//  lc
const handleLcUpload = async () => {
  try {
    const formData = new FormData();
    formData.append('lc_document', lcDocument);

    const response = await axios.post(`${baseUrl}/api/all-lcs/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    console.log('upload response', response);
    if (response.status === 201) {
      setLcUploadSuccess(true);
      setLcUploadMessage('Document uploaded successfully');
      // Optionally, you can perform additional actions upon successful upload
    } else {
      const data = response.data;
      setLcUploadSuccess(false);
      setLcUploadMessage(data.error || 'Error uploading document');
    }
  } catch (error) {
    console.error('Error uploading document:', error);
    setLcUploadSuccess(false);
    setLcUploadMessage('Error uploading  document');
  }
};

  // invoiceslist
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState([]);

  // paination logic

  const itemsPerPage = 7; // Number of items to display per page
 
  const handlePackageInfoClick = (packageInfo) => {
    axios.get(`${baseUrl}/api/package-info/${packageInfo}/`)
      .then(response => {
        setSelectedPackageInfo(response.data);
        // Here, you can trigger a modal or another component to show the package details
      })
      .catch(error => {
        console.error('Error fetching package info:', error);
        // Handle error
      });
  };

  const handleInvoiceDetailsClick = (invoiceNumber) => {
    axios.get(`${baseUrl}/api/invoices/${invoiceNumber}/`)
      .then(response => {
        setSelectedInvoiceDetails(response.data);
        setShowInvoiceModal(true);
      })
      .catch(error => {
        console.error('Error fetching invoice details:', error);
      });
  };

  useEffect(() => {

    axios.get(`${baseUrl}/api/package-info/`)
    .then(response => {
      setSelectedPackageInfo(response.data);
      console.log('package', response)
      // Here, you can trigger a modal or another component to show the package details
    })
    .catch(error => {
      console.error('Error fetching package info:', error);
      // Handle error
    });
  }, []);

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

  const getButtonColor = (status) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return '#001b42'; // Default color for not confirmed
    }
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
      console.log('invoices response', response.data);
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
    dueDate: invoice.due_date,
    billTo: {
      name: invoice.buyer_full_name,
      address: invoice.buyer_user_address,
      email: invoice.buyer_user_email,
      // phone: invoice.buyer.buyer_phone,
      buyerCountry: invoice.buyer_country
    },
    shipTo: 'Same as Bill To',
    items: [
      { title: invoice.breed, description: invoice.part_name, saleType: invoice.sale_type, quantity: invoice.quantity, unitPrice: invoice.unit_price  },
    ],
    taxRate: 0.08,
    attachedLc: invoice.attached_lc_document
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
  // Fetch sellers
  axios.get(`${baseUrl}/api/sellers/`, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(response => {
      setSellers(response.data);
      
    })
    .catch(error => {
      console.error('Error fetching sellers:', error);
    });

    axios.get(`${baseUrl}/api/buyers/`, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(buyerResponse => {
      setBuyers(buyerResponse.data);
      console.log('buyers object', buyerResponse)
    })
    .catch(error => {
      console.error('Error fetching sellers:', error);
    });


    axios.get(`${baseUrl}/api/package-info/`, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(response => {
      setSelectedPackageInfo(response.data);
      console.log('statuses', response.data)
    })
    .catch(error => {
      console.error('Error fetching buyers:', error);
    });

  // Fetch collateral managers
  axios.get(`${baseUrl}/api/collateral-managers/`, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(response => {
      setCollateralManagers(response.data);
    })
    .catch(error => {
      console.error('Error fetching collateral managers:', error);
    });

  // Fetch documents
  axios.get(`${baseUrl}/api/all-lcs/`)

.then(response => {
  console.log('docs', response.data); // Log the received data
  setLcDocument(response.data);
})
.catch(error => {
  console.error('Error fetching documents:', error);
});

}, [baseUrl, accessToken]);

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

    axios.get(`${baseUrl}/api/logistics-status/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    
    .then(response => {
        setLogisticsStatuses(response.data);

        console.log('logistics response', response)
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


  const handleBuyerChange = (event) => {
    setSelectedBuyer(event.target.value);
  };

  const handleSellerChange = (event) => {
    setSelectedSeller(event.target.value);
  };

  const handleViewDetails = (payment) => {
    // Toggle the detailed view
    setShowDetails(!showDetails);
    // Set the selected payment for detailed view
    setSelectedPayment(payment);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month and pad with leading zero if necessary
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if necessary
    return `${year}-${month}-${day}`;
  };

  // Status tracking

  const getStatusIndex = (status) => ['ordered', 'dispatched', 'shipped', 'arrived', 'received'].indexOf(status);
  const renderLogisticsStatus = (status) => (
    <tr key={status.id} style={{ 
      backgroundColor: 
        status.status === 'ordered' ? '#f0f8ff' : // Light Blue
        status.status === 'dispatched' ? '#f0ffff' : // Light Cyan
        status.status === 'shipped' ? '#f0f0f0' : // Light Gray
        status.status === 'received' ? 'lightgreen' : '' // Light Green
    }}>
        <td style={{ color: '#999999', fontWeight: 'bold' }}>
            <button 
              style={{ 
                border: 'none', 
                background: 'none', 
                color: '#666666', 
                textDecoration: 'underline', 
                cursor: 'pointer',
                textDecoration:'none',
                fontSize:'12px',
              }} 
              onClick={() => handleInvoiceDetailsClick(status.invoice_number)}
            >
              {status.invoice_number}
            </button>
          </td>
  

          <td style={{ color: '#999999', fontSize: '12px' }}>{status ? status.seller_full_name: ''}</td>
          <td style={{ color: '#999999', fontSize:'12px' }}>
          
            {status.logistics_company}</td>
          <td style={{ color: '#999999', fontSize:'12px' }}>
            <button 
              style={{ 
                border: 'none', 
                background: 'none', 
                color: '#007bff', 
                textDecoration: 'underline', 
                cursor: 'pointer' 
              }} 
              onClick={() => {
                handlePackageInfoClick(status.package_info);
                handleShow(); // Set show state to true
              }}
            >
              View 
            </button>
          </td>
          <td style={{ color: '#999999', fontSize:'12px' }}> 
          <button
      style={{
        fontWeight: '',
        color: '#fff',
        backgroundColor: status.status === 'ordered' ? '#001b42' : 'dispatched' ? '#001b42' : status.status === 'shipped' ? '#001b42' : status.status === 'arrived' ? '#001b42' : status.status === 'received' ? 'green' : '',
        border: 'none', 
        borderRadius: '5px', 
        fontSize: '11px', 
        cursor: 'pointer', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        borderRadius:'30px',
        textTransform:'capitalize' 
      }} 
      disabled={status.status === 'received'} // Disable the button if status is 'received'
    >
      {status.status}
      {status.status === 'ordered' && <FaShoppingCart style={{ marginLeft: '5px', fontSize: '11px', color: 'white', textTransform:'capitalize' }} />}
      {status.status === 'dispatched' && <FaTruck style={{ marginLeft: '5px', fontSize: '11px', color: 'white' , textTransform:'capitalize' }} />}
      {status.status === 'shipped' && <FaShippingFast style={{ marginLeft: '5px', fontSize: '11px', color: 'blue' , textTransform:'capitalize' }} />}
      {status.status === 'received' && <FaCheck style={{ marginLeft: '5px', fontSize: '11px', color: 'green', textTransform:'capitalize'}} />}
    </button>
          </td>

          <td style={{ color: '#999999', fontSize:'12px' }}>
            {status.shipping_mode}
            </td>
            <td style={{ color: '#999999', fontSize:'12px' }}>{status.time_of_delivery}</td>

        </tr>
      );
  

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
            className={`card ${getColor(status.status)} mr-2`}
            disabled
          >
            <Card.Body>
              {status.status}
            </Card.Body>
          </Card>
        ))}
      {/* <ProgressBar now={calculatePercentage(order.status)} label={`${order.status} - ${calculatePercentage(order.status)}%`} /> */}
    </div>
  );

  const renderBreederTradeTable = (breederTrade) => {
    return (
      <Table striped responsive bordered hover className="mt-">
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

  const QuotationPDF = ({ quotation }) => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Quotation Details</Text>
          <Text style={styles.text}>Quotation Number: {quotation.number}</Text>
          <Text style={styles.text}>Date: {quotation.date}</Text>
          <Text style={styles.text}>Buyer: {quotation.buyer}</Text>
          <Text style={styles.text}>Seller: {quotation.seller}</Text>
          <Text style={styles.text}>Product: {quotation.product}</Text>
          <Text style={styles.text}>Unit Price: {quotation.unit_price}</Text>
          <Text style={styles.text}>Quantity: {quotation.quantity}</Text>
          <Text style={styles.text}>Message: {quotation.message}</Text>
          <Text style={styles.text}>Status: {confirmedQuotation === quotation.id ? 'Confirmed' : 'Pending'}</Text>
          {/* Add more quotation details here */}
        </View>
      </Page>
    </Document>
  );

  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  const renderDocumentPreview = (documentUrl, altText) => {
    if (!documentUrl) {
      return null;
    }
  
    // Get the file extension
    const fileExtension = documentUrl.split('.').pop()?.toLowerCase(); // Added null check with '?'
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
  
  useEffect(() => {
    // Fetch quotations from the server
    const fetchQuotations = async () => {
      try {
        const accessToken = Cookies.get('accessToken');
        const response = await axios.get(`${baseUrl}/api/send-quotation/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setQuotations(response.data);
        console.log('quotation response', response.data)
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
        `${baseUrl}/api/send-quotation/${quotationId}/`, 
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
        }
      );
  
      setConfirmedQuotation(quotationId); // Update the confirmedQuotation state with the ID of the confirmed quotation
  
      // Redirect to the success page
      navigate(`/buyer-confirmation`);
    } catch (error) {
      console.error('Error confirming quotation:', error);
      // Show error message toast notification
      toast.error('Failed to confirm quotation. Please try again later.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
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
        <ul className="nav nav-tabs" id="myTab" role="tablist" style={{ fontSize: '15px', backgroundColor: '#001b40', color: '#d9d9d9' }}>
      <li className="nav-item">
        <a
          className={`nav-link ${activeSection === 'Quotation' ? 'active' : ''}`}
          onClick={() => handleButtonClick('Quotation')}
          role="tab"
          aria-controls="Quotation"
          aria-selected={activeSection === 'Quotation'}
        >
          Quotation
        </a>
      </li>
      <li className="nav-item">
        <a
          className={`nav-link ${activeSection === 'InvoiceList' ? 'active' : ''}`}
          onClick={() => handleButtonClick('InvoiceList')}
          role="tab"
          aria-controls="InvoiceList"
          aria-selected={activeSection === 'InvoiceList'}
        >
          Invoices
        </a>
      </li>
 
      <li className="nav-item">
        <a
          className={`nav-link ${activeSection === 'InvoiceTracking' ? 'active' : ''}`}
          onClick={() => handleButtonClick('InvoiceTracking')}
          role="tab"
          aria-controls="InvoiceTracking"
          aria-selected={activeSection === 'InvoiceTracking'}
        >
          Shipping Tracking
        </a>
      </li>
      <li className="nav-item">
        <a
          className={`nav-link ${activeSection === 'LC' ? 'active' : ''}`}
          onClick={() => handleButtonClick('LC')}
          role="tab"
          aria-controls="LC"
          aria-selected={activeSection === 'LC'}
        >
          LC
        </a>
      </li>
      <li className="nav-item ml-auto">
        <span className="nav-link">Hello, {userName}</span>
      </li>
    </ul>
        <hr />

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
       <Modal show={show} onHide={handleClose} animation={true}>
  <Modal.Header closeButton>
    <Modal.Title>Package Info</Modal.Title>
  </Modal.Header>
  <Modal.Body>

    {selectedPackageInfo && (
     <>
     <p style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>Package Name: {selectedPackageInfo.package_name}</p>
     <p style={{ marginBottom: '8px' }}>Package Description: {selectedPackageInfo.package_description}</p>
     <p style={{ marginBottom: '8px' }}>Package Charge: {selectedPackageInfo.package_charge}</p>
     <p style={{ marginBottom: '8px' }}>Weight: {selectedPackageInfo.weight}</p>
     <p style={{ marginBottom: '8px' }}>Height: {selectedPackageInfo.height}</p>
     <p style={{ marginBottom: '8px' }}>Length: {selectedPackageInfo.length}</p>
     <h4>Boll of lading Document</h4>

     <p style={{ marginBottom: '8px', width:'100%' }}>
            <a href={selectedPackageInfo.bill_of_lading} style={{ marginBottom: '8px', width:'100%' }} target="_blank" rel="noopener noreferrer">
              {selectedPackageInfo.bill_of_lading}
            </a>
          </p>
   </>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
  </Modal.Footer>
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
{activeSection === 'Quotation' && (
  <div className="quotation-list-container" style={{ background: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '20px', color: '#999999', fontSize: '13px' }}>
    <h1 className="quotation-list-header text-secondary" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Quotation List</h1>
   
    <table className="table responsive">
      <thead>
        <tr>
          <th className='' style={{color:'#666666'}}>Number</th>
          {/* <th className='' style={{color:'#666666'}}>Seller</th> */}

          <th className='' style={{color:'#666666'}}>Product</th>
          <th className='' style={{color:'#666666'}}>Unit Price</th>
          <th className='' style={{color:'#666666'}}>Quantity</th>
          <th className='' style={{color:'#666666'}}>Message</th>
          <th className='' style={{color:'#666666'}}>Status</th>
          <th className='' style={{color:'#666666'}}>Action</th>
          <th className='' style={{color:'#666666'}}>Download </th>
        </tr>
      </thead>
      <tbody>
        {quotations.slice().reverse().map((quotation) => (
          <tr key={quotation.id}>
            <td className='text' style={{color:'#666666'}}>#{quotation.id}</td>
            {/* <td className='text' style={{color:'#666666'}}>{quotation.seller} </td> */}

            <td className='text' style={{color:'#666666'}}>{quotation.product}</td>
            <td className='text' style={{color:'#666666'}}>{quotation.unit_price}</td>
            <td className='text' style={{color:'#666666'}}>{quotation.quantity}</td>
            <td className='text' style={{color:'#666666'}}>{quotation.message}</td>
            <td className='text' style={{color:'#666666'}}>
              {quotation.confirm ? 'Confirmed' : 'Pending'}
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
                  {isConfirming(quotation.id) ? 'Confirming...' : 'Confirm'}
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
)}



{activeSection === 'LC' && (
  <>
  <div>
  <Form>
      <div className='d-flex align-center justify-space-between'>
        <Form.Group controlId="buyer">
          <Form.Label className="text" style={{ color:'#999999' }}>Select Buyer</Form.Label>
          <Form.Control as="select" onChange={handleBuyerChange}>
            <option value="">Select Buyer</option>
            {buyers.map(buyer => (
              <option key={buyer.id} value={buyer.full_name}>{buyer.full_name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        
        <Form.Group controlId="seller">
          <Form.Label className="text" style={{ color:'#999999' }}>Select Seller</Form.Label>
          <Form.Control as="select" onChange={handleSellerChange}>
            <option value="">Select Seller</option>
            {sellers.map(seller => (
              <option key={seller.id} value={seller.id}>{seller.full_name}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>

      <div className='d-flex align-center justify-space-between'>
        <Form.Group controlId="lcDocument">
          <Form.Label className="text" style={{ color:'#999999' }}>Upload new LC</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setLcDocument(e.target.files[0])}
          />
        </Form.Group>
        <Button variant="primary btn-sm mt-5 mx-1" onClick={handleLcUpload} style={{ width: '100px', fontSize:'14px' }}>
          Upload
        </Button>
      </div>
    </Form>
        <hr />
        {lcUploadMessage && (
          <div>
            <p className={lcUploadSuccess ? "text-primary mt-3" : "text-danger mt-3"}>{lcUploadMessage}</p>
          </div>
        )}
      </div>

  <Card style={{ width: '100%', padding: '1rem', borderRadius: '10px', minHeight: '70vh', color: '#666666' }}>
  <h5 className='mt-1 mx-3 mb-3' style={{color:'#999999'}}>List of LCs</h5>

      <Table style={{ color: '#999999' }} responsive striped bordered hover>
        <thead>
          <tr>
            <th>Letter of credit</th>
            <th>LC ID</th>
            <th>Issue Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {letterOfCredits && letterOfCredits.map(letterOfCredit => (
            <tr key={letterOfCredit.id}>
             <td>{renderDocumentPreview(letterOfCredit.lc_document, `LC Document for ${letterOfCredit.buyer}`)} 
             <a href={letterOfCredit.lc_document} target="_blank" rel="noopener noreferrer" className="btn btn-sm float-right " style={{backgroundColor:'rgb(255, 255, 255)', fontSize:'12px', color:'#999999'}}>
              View
              </a>
        </td>

              <td>#{letterOfCredit.id}</td>
              <td>{new Date(letterOfCredit.issue_date).toLocaleString()}</td>
              <td style={{ textTransform: 'capitalize' }}>
                <button className='btn btn-sm text-white' style={{ backgroundColor: getButtonColor(letterOfCredit.status) }}>
                  {letterOfCredit.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        
      </Table>
      <Pagination
        itemsPerPage={quotationsPerPage}
        totalItems={quotations.length}
        paginate={paginate}
      />
    </Card>
  </>
)}

{activeSection === 'InvoiceList' && (
 <Container fluid 
 >

  <Row>
  <Col lg={8} style={styles.invoiceContainer}>
  <h5 className='mb-3'>Invoices List</h5>

  {invoiceData.length === 0 ? (
    <div className="text-center mt-5">
      <HiExclamation size={40} color='#ccc' />
      <p className="mt-3">No invoices yet !</p>
    </div>
  ) : (
    <>
      {currentInvoices.map((invoice, index) => (
        <Container fluid key={index} style={{ ...styles.invoiceItems, height: expandedInvoices ? 'auto' : '100%', marginBottom: '20px' }}>
<Button
  className='bg-white text-secondary mx-0'
  style={{ width: '100%', color: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
  variant="link"
  onClick={() => toggleInvoice(invoice.invoiceNumber)}
>
  <div className='row' style={{ width: '100%' }}>
    <div className='col-md-3'>
      <div>
        {expandedInvoices[invoice.invoiceNumber] ? (
          <HiEyeOff size={20} style={{ marginRight: '5px' }} />
        ) : (
          <HiEye size={20} style={{ marginRight: '5px' }} />
        )}
      </div>
    </div>
    <div className='col-md-6 '>
      <div>
       INV-#{invoice.invoiceNumber}
      </div>
    </div>
    <div className='col-md-3 text-secondary'>
      Date issued {invoice.date} {/* Display the date to the right */}
    </div>
  </div>
</Button>
          {expandedInvoices[invoice.invoiceNumber] && (
            <Table borderless responsive className='bg-white'>
<tbody>
            <br />
            {/* <tr>
              <td><strong>Due Date:</strong></td>
              <td>{invoice.dueDate}</td>
              <td colSpan="2"></td>
            </tr> */}
{/* <tr>
  <td colSpan="2">Attached LC</td>
  <td colSpan="2">
    {invoice && invoice.attachedLc && invoice.attachedLc.toLowerCase().endsWith('.pdf') ? (
      <embed src={invoice.attachedLc} type="application/pdf" width="200" height="200" />
    ) : (
      // Handle the case where invoice or attachedLc is undefined, or attachedLc is not a PDF
      <a href={invoice && invoice.attachedLc} target="_blank" rel="noopener noreferrer">
        View Attached LC
      </a>
    )}
  </td>
</tr> */}

            {/* Bill To */}
            <tr>
              <td colSpan="4">
                <h5>Bill To:</h5>
                <p>{invoice.billTo.name}</p>
                <p>{invoice.billTo.address}</p>
                <p>Email: {invoice.billTo.email}</p>
                {/* <p>Phone: {invoice.billTo.phone}</p> */}
                <hr />
                {/* <p>Country: {invoice.billTo.buyerCountry}</p> */}
              </td>
            </tr>
            {/* Ship To */}
            <tr>
              <td colSpan="4">
                <h5>Ship To:</h5>
                <p>{invoice.shipTo}</p>
              </td>
            </tr>
            {/* Items */}
            <tr>
              <td colSpan="4">
                <h5>Items:</h5>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      {/* <th>Sale Type</th> */}
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
                        {/* <td>{item.saleType}</td> */}
                        <td>$ {item.unitPrice}</td>
                        <td>$ {item.quantity * item.unitPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <hr />
              </td>
            </tr>
          </tbody> 
          
          
                     </Table>
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
        <h5 className="card-title" style={{color:'#666666'}}>Shipping tracking</h5>
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
        <h6 className='mt- mb-2'></h6>
          {logisticsStatuses.map((status) => (
           <div className="card mb-4" style={{ width: '100%', margin: 'auto' }}>

             <div className="table-responsive">
               <table className="table">
                 <thead>
                   <tr>
                     <th style={{color:'#666666', fontSize:'12px'}}>Order No</th>
                     <th style={{color:'#666666', fontSize:'12px'}}>Seller</th>
                     <th style={{color:'#666666', fontSize:'12px'}}>Shipping Company</th>
                     <th style={{color:'#666666', fontSize:'12px'}}>View package Info</th>

                     <th style={{color:'#666666', fontSize:'12px'}}>Current Status</th>
                     <th style={{color:'#666666', fontSize:'12px'}}>Shipping mode</th>
                     {/* <th style={{color:'#666666', fontSize:'12px'}}>Delivered by</th> */}

                   </tr>
                 </thead>
                 <tbody>
                   {logisticsStatuses.map(renderLogisticsStatus)}
                 </tbody>
               </table>
             </div>
         </div>
          ))}
      </div>
    </div>
  </>
)}
    </div>
  );
};

export default CustomerServiceDashboard;
