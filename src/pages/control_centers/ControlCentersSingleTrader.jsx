
import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Container, Form, Table, Button, ProgressBar, Navbar, Nav, NavDropdown, Pagination, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';

const ControlCenters = () => {
  const baseUrl = BASE_URL;
  const navigate = useNavigate();
  const accessToken = Cookies.get('accessToken');

  const [controlCenters, setControlCenters] = useState([]);
  const [collateralManagers, setCollateralManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [newControlCenterName, setNewControlCenterName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newCollateralManagerName, setNewCollateralManagerName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [lcUploadMessage, setLcUploadMessage] = useState('');
  const [lcUploadSuccess, setLcUploadSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [lcDocument, setLcDocument] = useState(null);

  useEffect(() => {
    // Fetch control centers and collateral managers from the backend when component mounts
    fetchControlCenters();
  }, []);

  const fetchControlCenters = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/control-centers/`);
      setControlCenters(response.data);
    } catch (error) {
      console.error('Error fetching control centers:', error);
    }
  };

 
  const handleAddControlCenter = async () => {
    try {
      await axios.post(`${baseUrl}/api/control-centers/`, {
        name: newControlCenterName,
        location: newLocation,
        address: newAddress,
        contact: newContact
        // Add other fields as needed
      });
      fetchControlCenters(); // Refresh control centers after adding a new one
      setNewControlCenterName(''); // Clear the input field after adding
      setNewLocation(''); // Clear the location field after adding
      setNewAddress(''); // Clear the address field after adding
      setNewContact(''); // Clear the contact field after adding
      setSuccessMessage('Control center added successfully.');
      setErrorMessage('');

      // Close the modal
      setShowModal(false);
      // Reset the form
      setNewControlCenterName('');
    } catch (error) {
      console.error('Error adding control center:', error);
      setSuccessMessage('');
      setErrorMessage('Failed to add control center.');
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


  const [activeTab, setActiveTab] = useState('ControlCenters');
  const [billOfLading, setBillOfLading] = useState(null);

  const handleLcUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('lc_document', lcDocument);
  
      const response = await axios.post(
        `${baseUrl}/api/letter_of_credits/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-User-ID': userProfile?.user?.id,
            'X-User-Email': userProfile?.user?.email,
          },
        }
      );
  
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

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };    

  const handleManagerClick = (manager) => {
    setSelectedManager(manager);
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
          <a className={`nav-link ${activeTab === 'ControlCenters' ? 'active' : ''}`} onClick={() => handleTabClick('ControlCenters')} role="tab" aria-controls="ControlCenters" aria-selected={activeTab === 'ControlCenters'}>Control Centers</a>
        </li>
      </ul>

  {activeTab === 'ControlCenters' && (

  <div className="table-responsive">
    <hr />
    <div className='d-flex justify-content-between align-items-center'>
  <h2 className='text-secondary' style={{ marginRight: '5px', color:'#666666' }}>Control centers</h2>
  <Button className="btn btn-info mb-5" style={{width:'250px', fontSize:'15px'}} onClick={() => setShowModal(true)}>
    <FaPlus style={{ marginRight: '5px', fontSize:'15px' }} />
    Add Control Center
  </Button>
</div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Control Center</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <Form>
    <Form.Group controlId="formControlCenterName">
      <Form.Label>Name:</Form.Label>
      <Form.Control type="text" placeholder="Enter control center name" value={newControlCenterName} onChange={(e) => setNewControlCenterName(e.target.value)} />
    </Form.Group>
    <Form.Group controlId="formControlCenterLocation">
      <Form.Label>Location:</Form.Label>
      <Form.Control type="text" placeholder="Enter location" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
    </Form.Group>
    <Form.Group controlId="formControlCenterAddress">
      <Form.Label>Address:</Form.Label>
      <Form.Control type="text" placeholder="Enter address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
    </Form.Group>
    <Form.Group controlId="formControlCenterContact">
      <Form.Label>Contact:</Form.Label>
      <Form.Control type="text" placeholder="Enter contact" value={newContact} onChange={(e) => setNewContact(e.target.value)} />
    </Form.Group>
  </Form>
</Modal.Body>
<Modal.Footer>
  <Button className='btn btn-sm' variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
  <Button className='btn' variant="primary" onClick={handleAddControlCenter}>Add</Button>
</Modal.Footer>

      </Modal>
            {successMessage && <div className='success text-success'>{successMessage}</div>}
            {errorMessage && <div className='error'>{errorMessage}</div>}
      
    <table className="table table-striped mt-5">
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Address</th>
          <th>Assigned agent</th>
          <th>Contact</th>
        </tr>
      </thead>
      <tbody>

        {/* Display existing control centers */}
        {currentControlCenters.reverse().map((controlCenter) => (
          <tr key={controlCenter.id}>
            <td>{controlCenter.name}</td>
            <td>{controlCenter.location}</td>
            <td>{controlCenter.address}</td>
            <td>{controlCenter.assiged_agent_full_name}</td>
            <td>{controlCenter.contact}</td>
            <td>
              <Button className='btn-sm' variant="" style={{background:'#001b42', color:'white'}} size="sm" onClick={() => handleShowDetails(controlCenter)}>
                Show Details
              </Button>
            </td>
          </tr>
        ))}

      </tbody>
    </table>
    <Pagination>
            {Array.from({ length: Math.ceil(controlCenters.length / itemsPerPage) }, (_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
  </div>
)}
    </div>
  );
};

export default ControlCenters;
