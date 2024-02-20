import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaWarehouse, FaBoxes, FaShippingFast, FaBarcode, FaPallet, FaClipboardList } from 'react-icons/fa';
import { Row, Col, Card, Container, Form, Table, Button, ProgressBar, Navbar, Nav, NavDropdown, Pagination, Modal } from 'react-bootstrap';
import Inventory from './Inventory'
import Cookies from 'js-cookie';

const ControlCenters = () => {
  const baseUrl = BASE_URL;
  const navigate = useNavigate();
  const [controlCenters, setControlCenters] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [newControlCenterName, setNewControlCenterName] = useState('');
  const [newCollateralManagerName, setNewCollateralManagerName] = useState('');
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPageControlCenters, setCurrentPageControlCenters] = useState(1);
  const [currentPageSellers, setCurrentPageSellers] = useState(1);
  const [currentPageBuyers, setCurrentPageBuyers] = useState(1);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5; // Number of items to display per page\
  const [activeTab, setActiveTab] = useState('ControlCenters');
  const [billOfLading, setBillOfLading] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [newManagerName, setNewManagerName] = useState('');
  const [collateralManagers, setCollateralManagers] = useState([]);
  const accessToken = Cookies.get('accessToken');
  const [selectedCollateralManagerId, setSelectedCollateralManagerId] = useState(null);
  const [selectedControlCenterId, setSelectedControlCenterId] = useState(null);
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Add state variables to hold the data for buyers and sellers
const [buyers, setBuyers] = useState([]);
const [sellers, setSellers] = useState([]);

// Use useEffect to fetch data from the backend when the component mounts
useEffect(() => {
    fetchBuyers();
    fetchSellers();
}, []);

// Fetch buyers from the backend
const fetchBuyers = async () => {
    try {
        const response = await axios.get(`${baseUrl}/api/buyers/`);
        setBuyers(response.data);
    } catch (error) {
        console.error('Error fetching buyers:', error);
    }
};

// Fetch sellers from the backend
const fetchSellers = async () => {
    try {
        const response = await axios.get(`${baseUrl}/api/sellers/`);
        setSellers(response.data);
    } catch (error) {
        console.error('Error fetching sellers:', error);
    }
};

  useEffect(()  => {
    const fetchInventory = async () => {
      try {
        setLoading(true); // Set loading to true while fetching data
        const response = await axios.get(`${baseUrl}/api/inventory/${selectedManager.id}`);
        setInventory(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching inventory:', error);
        setLoading(false); // Set loading to false if there's an error
      }
    };
  
    if (selectedManager) {
      fetchInventory();
    }
  }, [selectedManager]);

  useEffect(() => {
    // Fetch control centers and collateral managers from the backend when component mounts
    fetchControlCenters();
    fetchCollateralManagers(); // Fetch collateral managers

  }, []);

  const fetchControlCenters = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/control-centers/`);
      setControlCenters(response.data);
      console.log('control centers', response.data);
    } catch (error) {
      console.error('Error fetching control centers:', error);
    }
  };

  const fetchCollateralManagers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/collateral-managers/`);
      setCollateralManagers(response.data);
      console.log('Collateral Managers: ', response.data);
    } catch (error) {
      console.error('Error fetching collateral managers:', error);
    }
  };

   // Function to handle opening the modal
   const handleCloseManagerModal = () => {
    setShowManagerModal(false);
  };
// Function to handle change in the selected control center
const handleControlCenterChange = (event) => {
  const selectedControlCenterId = event.target.value;
  
  // Find the selected control center by ID
  const selectedControlCenter = controlCenters.find(center => center.id === selectedControlCenterId);
  
  // Check if a control center is found
  if (selectedControlCenter) {
    // Update the selected collateral manager ID based on the associated manager of the selected control center
    setSelectedCollateralManagerId(selectedControlCenter.assigned_collateral_agent);
    // Update the state with the selected control center ID
    setSelectedControlCenterId(selectedControlCenterId);
  } else {
    // Handle the case where the selected control center is not found
    console.error('Selected control center not found');
    // Reset the selected control center ID and associated manager ID
    setSelectedControlCenterId('');
    setSelectedCollateralManagerId(null);
  }
};

// Function to confirm the update of collateral manager
// Function to confirm the update of collateral manager
const handleConfirmUpdate = async () => {
  const isConfirmed = window.confirm('Are you sure you want to update the collateral manager?');
  if (isConfirmed) {
    try {
      // Attempt to update the collateral manager
      await updateCollateralManager();
      // If updateCollateralManager succeeds, set success message
      setMessage('Operation successful.');
      setIsSuccess(true);
    } catch (error) {
      // If updateCollateralManager fails, set failure message
      setMessage('Operation failed.');
      setIsSuccess(false);
    }
  } else {
    // Reset the selected collateral manager and associated control center ID if the user cancels
    setSelectedCollateralManagerId(null);
    setSelectedControlCenterId(null);
    setMessage('');
    setIsSuccess(false);
  }
};


// Function to update the collateral manager
const updateCollateralManager = async () => {
  try {
    // Make the PUT request to update the collateral manager
    const response = await axios.put(`${baseUrl}/api/control-centers/${selectedControlCenterId}/`, {
      assigned_collateral_agent: selectedCollateralManagerId,
    });
    // Handle the response accordingly
    console.log('Collateral manager updated successfully:', response.data);
    // Update the control centers state with the updated data
    const updatedControlCenters = controlCenters.map(center => {
      if (center.id === selectedControlCenterId) {
        return {
          ...center,
          assigned_collateral_agent: selectedCollateralManagerId,
        };
      }
      return center;
    });
    setControlCenters(updatedControlCenters);
  } catch (error) {
    console.error('Error updating collateral manager:', error);
  }
};
  // Function to handle input change in the modal form
  const handleManagerInputChange = (event) => {
    setNewManagerName(event.target.value);
  };

  // Function to handle submission of the modal form
const handleAddManagerSubmit = async () => {
  try {
    // Get the access token from wherever it's stored in your application
    const accessToken = Cookies.get('accessToken');

    // Set the headers with the bearer token
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Get the values of the confirm_password and last_name fields
    const confirm_password = document.getElementById('confirmPassword').value;
    const last_name = document.getElementById('lastName').value;

    // Check if confirm_password is empty, if so, display error message and return
    if (!confirm_password) {
      console.error('Confirm password is required.');
      return;
    }

    // Check if last_name is empty, if so, display error message and return
    if (!last_name) {
      console.error('Last name may not be blank.');
      return;
    }

    // Make the POST request with the headers
    const response = await axios.post(`${baseUrl}/api/register/`, {
      first_name: newManagerName,
      last_name: last_name, // Use the last_name entered in the form
      username: newManagerName, // Use the manager name as the username
      password: document.getElementById('password').value, // Get password value from input
      confirmPassword: confirm_password, // Use the confirm_password entered in the form
      role: "collateral_manager", // Assign the role 'collateral_manager'
    }, {
      headers: headers // Pass the headers to the request configuration
    });

    // Update the state with the new manager's data
    setCollateralManagers([...collateralManagers, response.data]);
    setShowManagerModal(false); // Close the modal
  } catch (error) {
    console.error('Error adding manager:', error);
  }
};

// Associate collateral manager

// Add a function to associate a collateral manager with the control center
// Add a function to associate a collateral manager with the control center
const associateCollateralManager = async () => {
  try {
    if (!selectedCollateralManagerId || !selectedControlCenterId) {
      console.error('Please select both a collateral manager and a control center.');
      return;
    }

    // Log the contents of controlCenters and selectedControlCenterId
    console.log('Control centers:', controlCenters);
    console.log('Selected control center ID:', selectedControlCenterId);

    // Get the selected control center data
    let selectedControlCenter = null;

    for (let i = 0; i < controlCenters.length; i++) {
      if (controlCenters[i].id === selectedControlCenterId) {
        selectedControlCenter = controlCenters[i];
        break; // Exit the loop once the control center is found
      }
    }
    
    console.log('Selected control center:', selectedControlCenter);
    
    // Make sure selectedControlCenter is not undefined before proceeding
    if (!selectedControlCenter) {
      console.error('Selected control center not found.');
      return;
    }

    // Call handleControlCenterChange to set selectedControlCenterId
    handleControlCenterChange(selectedControlCenterId);

    // Make an API call to associate the selected collateral manager with the control center
    const response = await axios.put(`${baseUrl}/api/control-centers/${selectedControlCenterId}/`, {
      name: selectedControlCenter.name,
      location: selectedControlCenter.location,
      assigned_collateral_agent: selectedCollateralManagerId,
    });
    
    // Update the control center data to include the associated collateral manager
    const updatedControlCenters = controlCenters.map(center => {
      if (center.id === selectedControlCenterId) {
        return {
          ...center,
          assigned_collateral_agent: selectedCollateralManagerId,
        };
      }
      return center;
    });

    // Update the state with the updated control center data
    setControlCenters(updatedControlCenters);

    // Close the modal or reset the form
    setShowManagerModal(false);
    setSelectedCollateralManagerId(null);
    setSelectedControlCenterId(null);
  } catch (error) {
    console.error('Error associating collateral manager:', error);
  }
};


// Function to handle changes in the selected collateral manager
const handleCollateralManagerChange = (controlCenterId, event) => {
  const selectedCollateralManagerId = event.target.value;
  // Set the selected collateral manager and associated control center ID
  setSelectedCollateralManagerId(selectedCollateralManagerId);
  setSelectedControlCenterId(controlCenterId);
  // Show confirmation popup
  handleConfirmUpdate();
};


const handleAssociateCollateralManager = () => {
  setShowManagerModal(true); // Show the modal for associating collateral manager
};


  
  const handleManagerClick = (center) => {
    setSelectedManager(center);
    setActiveTab('CollateralManager'); // Set active tab to 'CollateralManager'
};

  const handleTabClick = (tabName) => {
    if (tabName === 'CollateralManager') {
      setShowModal(true); // Show the modal when 'Inventory Overview' tab is clicked
    } else {
      setActiveTab(tabName);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
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
  const paginateControlCenters = (pageNumber) => {
    setCurrentPageControlCenters(pageNumber);
};

const paginateSellers = (pageNumber) => {
    setCurrentPageSellers(pageNumber);
};

const paginateBuyers = (pageNumber) => {
    setCurrentPageBuyers(pageNumber);
};
const indexOfLastItemControlCenters = currentPageControlCenters * itemsPerPage;
const indexOfFirstItemControlCenters = indexOfLastItemControlCenters - itemsPerPage;
const currentControlCenters = controlCenters.slice(indexOfFirstItemControlCenters, indexOfLastItemControlCenters)

const indexOfLastItemSellers = currentPageSellers * itemsPerPage;
const indexOfFirstItemSellers = indexOfLastItemSellers - itemsPerPage;
const currentSellers = sellers.slice(indexOfFirstItemSellers, indexOfLastItemSellers)

const indexOfLastItemBuyers = currentPageBuyers * itemsPerPage;
const indexOfFirstItemBuyers = indexOfLastItemBuyers - itemsPerPage;
const currentBuyers = buyers.slice(indexOfFirstItemBuyers, indexOfLastItemBuyers)

  return (
    <div className='main-container container-fluid' style={{minHeight:'85vh' }}>


      <ul className="nav nav-tabs" id="myTab" role="tablist" style={{fontSize:'15px', backgroundColor:'#001b40', color:'#d9d9d9'}}>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'ControlCenters' ? 'active' : ''}`} onClick={() => handleTabClick('ControlCenters')} role="tab" aria-controls="ControlCenters" aria-selected={activeTab === 'ControlCenters'}>Control Centers</a>
        </li>
        <li className="nav-item">
          <a className={`nav-link text-secondary ${activeTab === 'CollateralManager' ? 'active' : ''}`} onClick={() => handleTabClick('CollateralManager')} role="tab" aria-controls="CollateralManager" aria-selected={activeTab === 'CollateralManager'}>Inventory Overview</a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'Sellers' ? 'active' : ''}`} onClick={() => handleTabClick('Sellers')} role="tab" aria-controls="Sellers" aria-selected={activeTab === 'Sellers'}>Sellers</a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'Buyers' ? 'active' : ''}`} onClick={() => handleTabClick('Buyers')} role="tab" aria-controls="Buyers" aria-selected={activeTab === 'Buyers'}>Buyers</a>
        </li>
      </ul>

      {/* Modal for prompting the user */}
      <Modal show={showModal} onHide={handleCloseModal} className='mt-5'>
        <Modal.Header closeButton>
          <Modal.Title>Inventory Overview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please click on "View Details" to see the inventory associated with each agent.
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-sm' variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

       {/* Manager Modal */}
       <Modal show={showManagerModal} onHide={handleCloseManagerModal} className='mt-5'>
  <Modal.Header closeButton>
    <Modal.Title>Associate Collateral Manager</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="collateralManager">
        <Form.Label>Select Collateral Manager</Form.Label>
        <Form.Control as="select" value={selectedCollateralManagerId} onChange={handleCollateralManagerChange}>
          <option value="">Select collateral manager</option>
          {collateralManagers.map(manager => (
            <option key={manager.id} value={manager.id}>{manager.full_name}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="controlCenter">
  <Form.Label>Select Control Center</Form.Label>
  <Form.Control
    as="select"
    value={selectedControlCenterId}
    onChange={handleControlCenterChange}
    className="custom-select" // Add custom-select class for Bootstrap styling
    style={{ boxShadow: 'none', border: '1px solid #ced4da', borderRadius: '4px' }} // Custom inline styles for additional styling
  >
    <option value="">Select control center</option>
    {controlCenters.map(center => (
      <option key={center.id} value={center.id}>{center.name}</option>
    ))}
  </Form.Control>
</Form.Group>

    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseManagerModal}>
      Close
    </Button>
    <Button variant="primary" onClick={associateCollateralManager}>
      Associate Manager
    </Button>
  </Modal.Footer>
</Modal>

      {activeTab === 'ControlCenters' && (
        <div>
          <hr />
          <div className='d-flex justify-content-between align-items-center'>
            <h4 className='text-secondary mx-2' style={{ marginRight: '5px', color:'#666666' }}><FaClipboardList /> All Control Centers</h4>
           
                <a href='/collateral-manager-register '>

                <Button variant="" style={{fontSize:"12px", backgroundColor:'#001b42', color:'white'}} >
                Add Collateral Manager
          </Button>
          </a>

          </div>
          <hr />
          {message && (
  <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`} role="alert">
    {message}
  </div>
)}
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
      <td>{center.name}</td>
      <td>{center.location}</td>
      <td>{center.address}</td>
      <td>{center.contact}</td>
      <td>
  <select
    className="form-select" // Add form-select class for Bootstrap styling
    value={center.assigned_collateral_agent}
    onChange={(e) => handleCollateralManagerChange(center.id, e)}
    style={{ boxShadow: 'none', border: '1px solid #ced4da', borderRadius: '4px', background:'#fff', color:'#666666', padding:'5px' }} // Custom inline styles for additional styling
  >
    <option value="">Select collateral manager</option>
    {collateralManagers.reverse().map(manager => (
      <option key={manager.id} value={manager.id}>{manager.full_name}</option>
    ))}
  </select>
</td>

      <td>
        <button className="btn btn-sm text-light" style={{backgroundColor:'#001b42', fontSize:'11px'}} onClick={() => handleManagerClick(center)}>View Details</button>
      </td>
    </tr>
  ))}
</tbody>  </table>
</div>

       <Pagination>
  {Array.from({ length: Math.ceil(controlCenters.length / itemsPerPage) }, (_, i) => {
    const pageNumber = i + 1; 
    return (
      <Pagination.Item
        key={pageNumber}
        active={pageNumber === 1} // Set active for the last button
        onClick={() => paginateControlCenters(pageNumber)}
      >
        {pageNumber}
      </Pagination.Item>
    );
  })}
</Pagination>


        </div>
      )}

{activeTab === 'CollateralManager' && selectedManager && (
    <div style={{ width: '100%', height: '100%' }}>
        <h4 className="mt-3">Inventory for <span style={{color:'#666666', fontStyle:'italic'}}>{selectedManager.name} </span></h4>
        <span style={{fontSize:'12px', color:'#666666', fontWeight:'bold'}}> Managed by {selectedManager.assiged_agent_full_name} </span>

        {selectedManager.associated_seller && (
            <h6 className="mt-3">Associated seller: {selectedManager.associated_seller_full_name}</h6>
        )}
        <div style={{ }}> 
            <Inventory managerId={selectedManager.id} style={{ width: '100%', height: '100%' }} />
        </div>
    </div>
)}

{activeTab === 'Sellers' && (
    <div>
        <h4 className='mb-3 mt-4' style={{color:'#666666'}}> Sellers List</h4>
        <div className="table-responsive">
            <table style={{color:'#666666'}} className="table table-striped">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Date added</th>

                    </tr>
                </thead>
                <tbody>
                    {currentSellers.map((seller, index) => (
                        <tr key={index}>
                            <td>{seller.id}</td>
                            <td>{seller.full_name}</td>
                            <td>{seller.formatted_created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <Pagination>
    {Array.from({ length: Math.ceil(sellers.length / itemsPerPage) }, (_, i) => (
        <Pagination.Item key={i + 1} active={i + 1 === currentPageSellers} onClick={() => paginateSellers(i + 1)}>
            {i + 1}
        </Pagination.Item>
    ))}
</Pagination>
    </div>
)}

{activeTab === 'Buyers' && (
    <div style={{color:'#666666'}}>
        <h4 className='mb-3 mt-4' style={{color:'#666666'}}>Buyers List</h4>
        <div className="table-responsive">
            <table className="table table-striped" style={{color:'#666666'}}>
                <thead>
                    <tr>
                    <th>Full Name</th>

                        <th>Username</th>
                        <th>Email</th>
                        <th>Country</th>
                        <th>Address</th>

                        {/* Add more columns if needed */}
                    </tr>
                </thead>
                <tbody>
                    {currentBuyers.map((buyer, index) => (
                        <tr key={index}>
                            <td>{buyer.full_name}</td>
                            <td>{buyer.username}</td>
                            <td>{buyer.email}</td>
                            <td>{buyer.country}</td>
                            <td>{buyer.address}</td>

                            {/* Add more cells for additional buyer data */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <hr />
        <Pagination>
    {Array.from({ length: Math.ceil(buyers.length / itemsPerPage) }, (_, i) => (
        <Pagination.Item key={i + 1} active={i + 1 === currentPageBuyers} onClick={() => paginateBuyers(i + 1)}>
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
