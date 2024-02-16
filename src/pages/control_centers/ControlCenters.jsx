
import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaWarehouse, FaBoxes, FaShippingFast, FaBarcode, FaPallet, FaClipboardList } from 'react-icons/fa';
import { Row, Col, Card, Container, Form, Table, Button, ProgressBar, Navbar, Nav, NavDropdown, Pagination, Modal} from 'react-bootstrap';

const ControlCenters = () => {
  const baseUrl = BASE_URL;
  const navigate = useNavigate();
  const [controlCenters, setControlCenters] = useState([]);
  const [collateralManagers, setCollateralManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [newControlCenterName, setNewControlCenterName] = useState('');
  const [newCollateralManagerName, setNewCollateralManagerName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5; // Number of items to display per page

  useEffect(() => {
    // Fetch control centers and collateral managers from the backend when component mounts
    fetchControlCenters();
    fetchCollateralManagers(); // Fetch collateral managers

  }, []);

  const fetchControlCenters = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/control-centers/`);
      setControlCenters(response.data);
    } catch (error) {
      console.error('Error fetching control centers:', error);
    }
  };

  const fetchCollateralManagers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/collateral-managers/`);
      setCollateralManagers(response.data);
    } catch (error) {
      console.error('Error fetching collateral managers:', error);
    }
  };
  

 
  const handleAddControlCenter = async () => {
    try {
      await axios.post(`${baseUrl}/api/control-centers/`, { name: newControlCenterName });
      fetchControlCenters();
      setNewControlCenterName('');
    } catch (error) {
      console.error('Error adding control center:', error);
    }
  };

  const handleAddCollateralManager = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/collateral-managers/`, { name: newCollateralManagerName });
      setCollateralManagers([...collateralManagers, response.data]);
      setNewCollateralManagerName('');
    } catch (error) {
      console.error('Error adding collateral manager:', error);
    }
  };

  const handleManagerClick = (center) => {
    setSelectedManager(center.collateralAgent);
    setActiveTab('CollateralManager'); // Set active tab to 'CollateralManager'
  };
  


  const [activeTab, setActiveTab] = useState('ControlCenters');
  const [billOfLading, setBillOfLading] = useState(null);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };



  const handleAddManager = () => {
    // For demonstration purposes, let's generate a random name for the new manager
    const newManagerName = `Collateral Manager ${collateralManagers.length + 1}`;
    const newManager = { id: Date.now(), name: newManagerName };
    setCollateralManagers([...collateralManagers, newManager]);
  };

  const handleUploadBillOfLading = (event) => {
    const file = event.target.files[0];
    setBillOfLading(file);
  };

  // pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentControlCenters = controlCenters.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <div className='main-container' style={{minHeight:'85vh'}}>
      <ul className="nav nav-tabs" id="myTab" role="tablist" style={{fontSize:'15px', backgroundColor:'#001b40', color:'#d9d9d9'}}>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'ControlCenters' ? 'active' : ''}`} onClick={() => handleTabClick('ControlCenters')} role="tab" aria-controls="ControlCenters" aria-selected={activeTab === 'ControlCenters'}>Control Centers</a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'CollateralManager' ? 'active' : ''}`} onClick={() => handleTabClick('CollateralManager')} role="tab" aria-controls="CollateralManager" aria-selected={activeTab === 'CollateralManager'}>Collateral manager</a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'Sellers' ? 'active' : ''}`} onClick={() => handleTabClick('Sellers')} role="tab" aria-controls="Sellers" aria-selected={activeTab === 'Sellers'}>Sellers</a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'Buyers' ? 'active' : ''}`} onClick={() => handleTabClick('Buyers')} role="tab" aria-controls="Buyers" aria-selected={activeTab === 'Buyers'}>Buyers</a>
        </li>
      </ul>
      
      {activeTab === 'ControlCenters' && (
        <div>
          <hr />
          <h4 className='' style={{ color: '#999999' }}><FaClipboardList /> All Control Centers</h4>
          <hr />
          <div className='table-responsive'>
  <table className='table table-striped' style={{ color: '#666666' }}>
    <thead>
      <tr>
        <th>Name</th>
        <th>Location</th>
        <th>Address</th>
        <th>Contact</th>
        <th>Collateral Agent</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
    {currentControlCenters.map((center, index) => (
              <tr key={index}>
                <td>{center.id}</td>
                <td>{center.location}</td>
                <td>{center.address}</td>
                <td>{center.contact}</td>
                <td>{center.assigned_collateral_agent}</td>
                <td>
                  <button className="btn btn-sm" onClick={() => handleManagerClick(center)}>View Details</button>
                </td>
              </tr>
            ))}
    </tbody>
  </table>
</div>

          {selectedManager && (
            <div className="selected-manager-details">
              <h5>{`Collateral Agent: ${selectedManager.id}`}</h5>
              <h5>{selectedManager.id}</h5>
                <p>{selectedManager.location}</p>
                <p>{selectedManager.address}</p>
                <p>{selectedManager.contact}</p>
              </div>
          )}
        </div>
      )}


{activeTab === 'CollateralManager' && selectedManager && (
  <div>
    <h2>Inventory Information for {selectedManager.id}</h2>
    {/* Display inventory information for the selected collateral agent */}
  </div>
)}


      {activeTab === 'Sellers' && (
        <div>
          <h2>Sellers</h2>
          {/* Display sellers section */}
        </div>
      )}

      {activeTab === 'Buyers' && (
        <div>
          <h2>Buyers</h2>
          {/* Display buyers section */}
        </div>
      )}


<hr />
<Pagination>
  {Array.from({ length: Math.ceil(controlCenters.length / itemsPerPage) }, (_, i) => (
    <Pagination.Item style={{ backgroundColor: '#001b40 !important' }} key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
      <span>{i + 1}</span>
    </Pagination.Item>
  ))}
</Pagination>

     
    </div>
  );
};

export default ControlCenters;
