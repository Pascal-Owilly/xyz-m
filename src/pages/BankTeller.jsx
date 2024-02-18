
import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Container, Form, Table, Button, ProgressBar, Navbar, Nav, NavDropdown, Pagination, Modal } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { FaUser, FaUserShield, FaShoppingBag, FaBoxes } from 'react-icons/fa'; // Importing Font Awesome icons

const ControlCenters = () => {
  const baseUrl = BASE_URL;
  const navigate = useNavigate();
  const [controlCenters, setControlCenters] = useState([]);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [billOfLading, setBillOfLading] = useState(null);

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
const sections = [
  {
    title: 'Section 1',
    documents: [
      { type: 'Bill of Lading', file: 'bol1.pdf' },
      { type: 'Letter of Credit (LC)', file: 'lc1.pdf' },
      // Add more documents as needed
    ]
  },
  {
    title: 'Section 2',
    documents: [
      { type: 'Bill of Lading', file: 'bol2.pdf' },
      { type: 'Letter of Credit (LC)', file: 'lc2.pdf' },
      // Add more documents as needed
    ]
  },
  // Add more sections as needed
];



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
 
   // Change page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <p style={{ color:'#666666', fontSize: '20px', fontWeight: 'bold' }}>1234</p> {/* Dummy number */}
      </Card.Body>
    </div>
  </Col>
  <Col md={3}>
    <div className="shadow p-3 mb-5 bg-body rounded">
      <Card.Body>
        
        <p style={{ color:'#666666' }}><FaUserShield size={30} color="#666666" /> Agents</p>
        <p style={{ color:'#666666', fontSize: '20px', fontWeight: 'bold' }}>5678</p> {/* Dummy number */}
      </Card.Body>
    </div>
  </Col>
  <Col md={3}>
    <div className="shadow p-3 mb-5 bg-body rounded">
      <Card.Body>
        
        <p style={{ color:'' }}><FaShoppingBag size={30} color="#666666" /> Buyers</p>
        <p style={{ color:'', fontSize: '20px', fontWeight: 'bold' }}>9012</p> {/* Dummy number */}
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


{activeTab === 'CollateralManager' && (
  <div>
    <h4 className='mt-3 mb-3' style={{ color:'#999999' }}>Documents</h4>
    <hr />
    {/* Iterate over document sections */}
    {sections.map((section, index) => (
      <div key={index}>
        <h5>{section.title}</h5>
        <table className="table">
          <thead>
            <tr>
              <th>Document Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Paginate documents for the current section */}
            {section.documents.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            ).map((document, docIndex) => (
              <tr key={docIndex}>
                <td>{document.type}</td>
                <td>
                  {/* View and download options */}
                  <button className='btn btn-sm bg-light mx-2' onClick={() => handleViewDocument(document)}>View Document</button>
                  <button className='btn btn-sm bg-light mx-2' onClick={() => handleDownloadDocument(document)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination controls */}
        
      </div>
    ))}
    {/* Upload form for LC */}
    {showUpload && (
      <div>
        <input type="file" onChange={handleUploadLC} />
        {lcFile && (
          <p>File uploaded: {lcFile.name}</p>
        )}
      </div>
    )}
  </div>
)}

      
    </div>
  
  )}

export default ControlCenters;
