import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import Cookies
import { BASE_URL } from './auth/config';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Container, Form, Table, Button, ProgressBar, Navbar, Nav, NavDropdown, Pagination, Modal } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { FaUser, FaUserShield, FaShoppingBag, FaBoxes , FaUpload} from 'react-icons/fa'; // Importing Font Awesome icons

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

   // State for pagination
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 6;
 
   // Pagination calculations
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentControlCenters = controlCenters.slice(indexOfFirstItem, indexOfLastItem);
   const currentDocuments = documents.slice(indexOfFirstItem, indexOfLastItem);

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
    <div className='main-container' style={{minHeight:'85vh'}}>
      <ul className="nav nav-tabs" id="myTab" role="tablist" style={{fontSize:'15px', backgroundColor:'#001b40', color:'#d9d9d9'}}>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => handleTabClick('Dashboard')} role="tab" aria-controls="Dashboard" aria-selected={activeTab === 'Dashboard'}>Overview</a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'CollateralManager' ? 'active' : ''}`} onClick={() => handleTabClick('CollateralManager')} role="tab" aria-controls="CollateralManager" aria-selected={activeTab === 'CollateralManager'}>Documents</a>
        </li>
       
      </ul>


      {activeTab === 'Dashboard' && (
      <Container>
       <Row>
  <Col md={3}>
    <div className="shadow p-3 mb-5 bg-body rounded">
      <Card.Body>
        
        <p style={{ color:'#666666' }}><FaUser size={30} color="#666666" /> Sellers</p>
        <p style={{ color:'#666666', fontSize: '20px', fontWeight: 'bold' }}>{sellers.length}</p> {/* Dummy number */}
      </Card.Body>
    </div>
  </Col>
  <Col md={3}>
    <div className="shadow p-3 mb-5 bg-body rounded">
      <Card.Body>
        
        <p style={{ color:'#666666' }}><FaUserShield size={30} color="#666666" />&nbsp; Agents</p>
        <p style={{ color:'#666666', fontSize: '20px', fontWeight: 'bold' }}>{collateralManagers.length}</p> {/* Dummy number */}
      </Card.Body>
    </div>
  </Col>
  <Col md={3}>
    <div className="shadow p-3 mb-5 bg-body rounded">
      <Card.Body>
        
        <p style={{ color:'' }}><FaShoppingBag size={30} color="#666666" /> Buyers</p>
        <p style={{ color:'', fontSize: '20px', fontWeight: 'bold' }}>{buyers.length}</p> {/* Dummy number */}
      </Card.Body>
    </div>
  </Col>
  <Col md={3}>
    <div className="shadow p-3 mb-5 bg-body rounded">
      <Card.Body>
        
        <p style={{ color:'#' }}><FaBoxes size={30} color="" /> Inventory </p>
        <p style={{ color:'#', fontSize: '20px', fontWeight: 'bold' }}>3456</p> {/* Dummy number */}
      </Card.Body>
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
          
{/* <Button
        variant="primary"
        className="btn btn-sm float-right mt-2 mb-2"
        style={{ background: '#fff', color: '#666666', width: '200px' }}
        onClick={handleOpenModal}
      >
        <FaUpload /> &nbsp; Send LC to Seller
      </Button> */}
          <h4 className='mt-3 mb-3'>Documents</h4>

        
<Modal show={showUpload} onHide={handleCloseModal}>
  <Modal.Header closeButton>
    <Modal.Title>Send LC information</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
    <Form.Group controlId="formSeller">
  <Form.Label>Select Seller</Form.Label>
  <Form.Control as="select" onChange={handleSellerChange} value={selectedSeller}>
    <option value="">Select Seller</option>
    {sellers && sellers.map((seller, index) => (
      <option key={index} value={seller.id}>{seller.full_name}</option>
    ))}
  </Form.Control>
</Form.Group>

      <Form.Group controlId="message">
        <Form.Label>Message</Form.Label>
        <Form.Control type="text" onChange={handleSellerChange} />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
    <Button variant="primary" onClick={handleSubmit}>Upload</Button>
  </Modal.Footer>
</Modal>

          <hr />
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {currentDocuments.map((document, index) => (
             <div key={index} className="col">
             <Card className="h-100" style={{ backgroundColor: '#fff', color: 'white' }}>
               <Card.Body>
                 <Card.Title>ID: {document.id}</Card.Title>
                 <Card.Text>
                   Status: {document.status}<br />
                   Issue Date: {new Date(document.issue_date).toLocaleDateString()}<br />
                 </Card.Text>
                 <a href={document.lc_document} target="_blank" rel="noopener noreferrer" className="btn btn-sm float-right " style={{backgroundColor:'rgb(0, 27, 64)', fontSize:'12px', color:'white'}}>View Document</a>
               </Card.Body>
             </Card>
           </div>
            ))}
          </div>
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


      
    </div>
  
  )}

export default ControlCenters;
