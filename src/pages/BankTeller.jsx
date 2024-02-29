import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import Cookies
import { BASE_URL } from './auth/config';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Container, Form, Table, Button, ProgressBar, Navbar, Nav, NavDropdown, Pagination, Modal } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { FaUser, FaUserShield, FaShoppingBag, FaBoxes , FaUpload, FaTruck, FaShippingFast, FaCheck, FaShoppingCart} from 'react-icons/fa'; // Importing Font Awesome icons

const ControlCenters = () => {
  const baseUrl = BASE_URL;
  const navigate = useNavigate();
  const [controlCenters, setControlCenters] = useState([]);
  const [documents, setDocuments] = useState([]); // State to hold fetched documents

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [billOfLading, setBillOfLading] = useState(null);

  // Add accessToken to request headers
  const accessToken = Cookies.get('accessToken');
  const [showModal, setShowModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedSellerOutsideModal, setSelectedSellerOutsideModal] = useState(null);
  const [selectedSellerInsideModal, setSelectedSellerInsideModal] = useState(null);
  const [letterOfCredits, setLetterOfCredits] = useState([]);
  const [quotationsPerPage] = useState(5); // Number of quotations per page
  const [quotations, setQuotations] = useState([]);

  const [orders, setOrders] = useState([]);
  const [shipmentProgressData, setShipmentProgressData] = useState([]);
  const [arrivedOrdersData, setArrivedOrdersData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [activeSection, setActiveSection] = useState('InformationSection');
  const [selectedPackageInfo, setSelectedPackageInfo] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [logisticsStatuses, setLogisticsStatuses] = useState([]);


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(logisticsStatuses.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;

    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = logisticsStatuses.slice(indexOfFirstItem, indexOfLastItem);
 
    // Pagination calculations
    const currentControlCenters = controlCenters.slice(indexOfFirstItem, indexOfLastItem);
    const currentDocuments = documents.slice(indexOfFirstItem, indexOfLastItem);


    const currentBOLDocuments = documents.slice(indexOfFirstItem, indexOfLastItem);
 

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
    axios.get(`${baseUrl}/api/all-logistics-statuses/`)
      .then(response => {
        setLogisticsStatuses(response.data);
        console.log('all logistics', response.data)

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


  const renderLogisticsStatus = (status) => (
    <tr key={status.id} style={{ 
      backgroundColor: 
        status.status === 'ordered' ? '#f0f8ff' : // Light Blue
        status.status === 'dispatched' ? '#f0ffff' : // Light Cyan
        status.status === 'shipped' ? '#f0f0f0' : // Light Gray
        status.status === 'received' ? 'lightgreen' : '' // Light Green
    }}>
        <td style={{ color: '#999999', fontWeight: 'bold' }}>
        <td style={{ color: '#999999', fontSize:'16px' }}>
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
              See details
            </button>
          </td>
          </td>
          <td className='d-flex align-items-center'>
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
          
          <td style={{ color: '#999999', fontSize: '12px' }}>{status ? status.buyer_full_name: ''}</td>
          {/* <td>
 
            </td> */}
          <td style={{ color: '#999999', fontSize: '12px' }}>{status ? status.seller_full_name: ''}</td>
          <td style={{ color: '#999999', fontSize:'12px' }}>{status.logistics_company}</td>
          
          <td style={{ color: '#999999', fontSize:'12px' }}>{status.shipping_mode}</td>
          <td style={{ color: '#999999', fontSize:'12px' }}>{status.time_of_delivery}</td>
        </tr>
      );

      const handleModalToggle = () => {
        setShowForm(!showForm);
      };
      
      const handleBuyerSellerChange = (e) => {
        const { name, value } = e.target;
        if (name === 'buyer') {
          // Set the buyer's ID directly
          setFormData({ ...formData, buyer: parseInt(value) });
        } else if (name === 'seller') {
          // Set the seller's ID directly
          setFormData({ ...formData, seller: parseInt(value) });
        } else {
          setFormData({ ...formData, [name]: value });
        }
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

  const handleSellerSelectionInsideModal = (seller) => {
    setSelectedSellerInsideModal(seller);
  };

  const handleSellerSelection = (seller) => {
    setSelectedSeller(seller);
    setShowModal(true);
  };


  // dummy starts
  const transactionOverviewData = {
    options: {
      chart: {
        type: 'line',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
    },
    series: [
      {
        name: 'Transactions',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 130, 95, 120],
      },
    ],
  };

  // Dummy data for transactions today
  const todayTransactionsData = {
    options: {
      chart: {
        type: 'line',
      },
    },
    series: [35, 65],
    labels: ['Successful', 'Failed'],
  };

  // Dummy data for transactions last month
  const lastMonthTransactionsData = {
    options: {
      chart: {
        type: 'bar',
      },
      xaxis: {
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      },
    },
    series: [
      {
        name: 'Transactions',
        data: [100, 120, 110, 130],
      },
    ],
  };

  // Dummy data for transactions last year
  const lastYearTransactionsData = {
    options: {
      chart: {
        type: 'line',
      },
      xaxis: {
        categories: ['2019', '2020', '2021'],
      },
    },
    series: [
      {
        name: 'Transactions',
        data: [500, 600, 700],
      },
    ],
  };
  // dummy ends

  // dummy docs

    const [lcFile, setLCFile] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
  // Placeholder for handling the download of BOL document
const handleDownloadBOL = () => {
  // Implement download functionality for BOL document
};

// Placeholder for handling the download of LC document
const handleDownloadLC = () => {
  // Implement download functionality for LC document
};

    const handleUploadLC = (event) => {
      const file = event.target.files[0];
      setLCFile(file);
    };

    // Define sample document sections
        // end dummy

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };    

  const handleUploadBillOfLading = (event) => {
    const file = event.target.files[0];
    setBillOfLading(file);
  };

 
   // Change page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);

  const [collateralManagers, setCollateralManagers] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
 // State variable to hold the selected document

 // Function to handle document selection
 const handleDocumentSelection = (event) => {
   const file = event.target.files[0];
   setSelectedDocument(file);
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

    // Fetch buyers
    axios.get(`${baseUrl}/api/buyers/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(response => {
        setBuyers(response.data);
        console.log('buyers', buyers)
      })
      .catch(error => {
        console.error('Error fetching buyers:', error);
      });
      axios.get(`${baseUrl}/api/package-info/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(response => {
        setBuyers(response.data);
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
    setDocuments(response.data);
  })
  .catch(error => {
    console.error('Error fetching documents:', error);
  });

  }, [baseUrl, accessToken]);

  const handleOpenModal = () => {
    setShowUpload(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setShowUpload(false);
  };
    // Function to handle selecting a seller
    const handleSellerSelect = (seller) => {
      setSelectedSeller(seller);
    };

    const handleSubmit = () => {
      if (selectedSeller && selectedDocument) {
        const formData = new FormData();
        formData.append('message', selectedDocument); // Change 'file' to 'message'
        formData.append('seller', selectedSeller); // Keep 'seller' as is
    
        axios.post(`${baseUrl}/api/documents-to-seller/`, formData)
          .then(response => {
            console.log('Document uploaded successfully:', response.data);
            setShowUpload(false);
          })
          .catch(error => console.error('Error uploading document:', error));
      } else {
        console.error('Seller or document not selected');
      }
    };
        
  const handleSellerChange = (e) => setSelectedSeller(e.target.value);
  const handleDocumentChange = (e) => setSelectedDocument(e.target.files[0]);

  return (  
    <div className='main-container' style={{minHeight:'90vh'}}>
      <ul className="nav nav-tabs" id="myTab" role="tablist" style={{fontSize:'15px', backgroundColor:'#001b40', color:'#d9d9d9'}}>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => handleTabClick('Dashboard')} role="tab" aria-controls="Dashboard" aria-selected={activeTab === 'Dashboard'}>Overview</a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'CollateralManager' ? 'active' : ''}`} onClick={() => handleTabClick('CollateralManager')} role="tab" aria-controls="CollateralManager" aria-selected={activeTab === 'CollateralManager'}>LCs</a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'BOL' ? 'active' : ''}`} onClick={() => handleTabClick('BOL')} role="tab" aria-controls="BOL" aria-selected={activeTab === 'BOL'}>Bill of Lading</a>
        </li>
       
      </ul>

       <Modal show={show} onHide={handleClose} animation={true}>
  <Modal.Header closeButton>
    <Modal.Title>Bill  of Lading Document</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedPackageInfo && (
     <>
     <p style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}></p>

    {/* Make Bill of Lading clickable */}
    <p style={{ marginBottom: '8px', width:'100%' }}>
            <a href={selectedPackageInfo.bill_of_lading} style={{ marginBottom: '8px', width:'100%' }} target="_blank" rel="noopener noreferrer">
              {selectedPackageInfo.bill_of_lading}
            </a>
          </p>
   </>
    )}
  </Modal.Body>
  <Modal.Footer>

  </Modal.Footer>
</Modal>


      {activeTab === 'Dashboard' && (
      <Container>
       <Row>
  <Col md={4}>
    <div className="shadow p-1 mb-5 bg-body rounded">
    <a href='/sellers-list'>

      <Card.Body>
        
        <p style={{ color:'#666666' }}><FaUser size={30} color="#666666" /> Sellers</p>
        <p style={{ color:'#666666', fontSize: '20px', fontWeight: 'bold' }}>{sellers.length}</p> {/* Dummy number */}
      </Card.Body>
      </a>
    </div>
  </Col>
  <Col md={4}>
    <div className="shadow shadow-white p-1 mb-5 bg-body rounded">
      <a href='/collateral-managers-list'>
      <Card.Body>
        
        <p style={{ color:'#666666' }}><FaUserShield size={30} color="#666666" />&nbsp; Collateral Managers</p>
        <p style={{ color:'#666666', fontSize: '20px', fontWeight: 'bold' }}>{collateralManagers.length}</p> {/* Dummy number */}
      </Card.Body>
      </a>
    </div>
  </Col>
  <Col md={4}>
    <div className="shadow p-1 mb-5 bg-body rounded">
    <a href='/buyers-list'>

      <Card.Body>
        
        <p style={{ color:'' }}><FaShoppingBag size={30} color="#666666" /> Buyers</p>
        <p style={{ color:'', fontSize: '20px', fontWeight: 'bold' }}>{buyers.length}</p> {/* Dummy number */}
      </Card.Body>
      </a>
    </div>
  </Col>
  
</Row>

      <Row>

        <Col md={5}>
            <Card.Body>
              <h5 style={{ color:'#999999' }}>Transaction Overview</h5>
              <ReactApexChart options={transactionOverviewData.options} series={transactionOverviewData.series} type="line" height={350} />
            </Card.Body>
                    </Col>

        <Col>
        <span style={{backgroundColor:''}}>
            <Card.Body>
            <h5 style={{ color:'#999999' }}>Today</h5>
              <ReactApexChart options={todayTransactionsData.options} series={todayTransactionsData.series} type="pie" height={350} />
            </Card.Body>
          </span>
        </Col>  
      </Row>
      <Row>

        
      </Row>
      <Row>
        <Col>
          <span style={{backgroundColor:'transparent'}}>
            <Card.Body>
            <h5 style={{ color:'#999999' }}>Last month</h5>
              <ReactApexChart options={lastMonthTransactionsData.options} series={lastMonthTransactionsData.series} type="bar" height={350} />
            </Card.Body>
          </span>
        </Col>
      </Row>
    </Container>
    
        
      )}

<div>
      {activeTab === 'CollateralManager' && (
        <div>

          <hr />
          <Card style={{ width: '100%', padding: '1rem', borderRadius: '10px', minHeight: '70vh', color: '#666666' }}>
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
        {currentDocuments.map(letterOfCredit => (
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
          <hr />
          <nav aria-label="Page navigation" className='mt-3'>
            <ul className="pagination justify-content-center">
              {Array.from({ length: Math.ceil(documents.length / itemsPerPage) }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
      {/* Render modal component */}
    </div>

    <div>
    {activeTab === 'BOL' && (
  <div className="card mb-4 mt-3" style={{ width: '100%', margin: 'auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
  <div className="card-body">
  <div className="d-flex justify-content-between align-items-center">
      <h5 className="card-title" style={{ color: '#999999'}}>List of shipments & related bill of lading documents</h5>

    </div>
    {/* Your progress bar code */}
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', color:'#666666' }}>
          <th style={{ color: '#666666', fontSize:'16px' }}>Bill of Lading</th>

            <th style={{ color: '#666666', fontSize:'12px' }}>Current Status</th>
             <th style={{ color: '#666666', fontSize:'12px' }}>Buyer</th>
            <th style={{ color: '#666666', fontSize:'12px' }}>Seller</th> 
            <th style={{ color: '#666666', fontSize:'12px' }}>Logistics Company</th>

            <th style={{ color: '#666666', fontSize:'12px' }}>Shipping Mode</th>
            <th style={{ color: '#666666', fontSize:'12px' }}>Time of Delivery</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(renderLogisticsStatus)}
        </tbody>
      </table>

    </div>
    <Pagination >
                {Array.from({ length: totalPages }, (_, index) => (
                  <Pagination.Item key={index + 1} onClick={() => paginate(index + 1)} active={index + 1 === currentPage}>
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
  </div>
</div>

)}

      {/* Render modal component */}
    </div>




      
    </div>
  
  )}

export default ControlCenters;
