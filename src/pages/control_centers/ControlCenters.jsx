import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';
import { Form, Button, Pagination, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';

const ControlCenters = () => {
  const baseUrl = BASE_URL;
  const navigate = useNavigate();
  const [controlCenters, setControlCenters] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [newControlCenterName, setNewControlCenterName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newContact, setNewContact] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
  const [showAlertModal, setShowAlertModal] = useState(false); // State for showing/hiding the modal
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [newManagerName, setNewManagerName] = useState('');
  const [collateralManagers, setCollateralManagers] = useState([]);
  const accessToken = Cookies.get('accessToken');
  const [selectedCollateralManagerId, setSelectedCollateralManagerId] = useState(null);
  const [selectedControlCenterId, setSelectedControlCenterId] = useState(null);
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);

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

  useEffect(()  => {
    const fetchInventory = async () => {
      try {
        setLoading(true); // Set loading to true while fetching data
        const response = await axios.get(`${baseUrl}/api/control-centers/${selectedManager.id}`);
        setInventory(response.data);
        setLoading(false); 
        console.log('inventory response', response.data)
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
    const response = await axios.put(`${baseUrl}/api/control-centers/${selectedControlCenterId}/`, {
      assigned_collateral_agent: selectedCollateralManagerId,
    });

    // Log the response data to double-check the updated control center information
    console.log('Update Collateral Manager Response:', response.data);

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

    // Check if the assigned collateral manager ID matches the selected one
    if (response.data.assigned_collateral_agent === selectedCollateralManagerId) {
      console.log('Collateral manager successfully assigned to control center.');
    } else {
      console.error('Error: Collateral manager not assigned to control center.');
    }
  } catch (error) {
    console.error('Error updating collateral manager:', error);
  }
};

// Associate collateral manager

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

const handleManagerClick = async (center) => {
  setSelectedManager(center);
  setShowInventoryModal(true);
  setActiveTab('InventoryOverview');
  try {
    const response = await axios.get(`${baseUrl}/api/control-centers/${center.id}/`);
    setInventory(response.data);
  } catch (error) {
    console.error('Error fetching inventory:', error);
  }
};
 
  const handleTabClick = (tabName) => {
    if (tabName === 'CollateralManager') {
      setShowAlertModal(true); // Show the modal when 'Inventory Overview' tab is clicked
    } else {
      setActiveTab(tabName);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setShowAlertModal(false); // Hide the modal
  };

  // pagination
  const paginateControlCenters = (pageNumber) => {
    setCurrentPageControlCenters(pageNumber);
};

  const indexOfLastItemControlCenters = currentPageControlCenters * itemsPerPage;
  const indexOfFirstItemControlCenters = indexOfLastItemControlCenters - itemsPerPage;
  const currentControlCenters = controlCenters.slice(indexOfFirstItemControlCenters, indexOfLastItemControlCenters)

  return (
    <div className='main-container container-fluid' style={{minHeight:'85vh' }}>
      <ul className="nav nav-tabs" id="myTab" role="tablist" style={{fontSize:'15px', backgroundColor:'#001b40', color:'#d9d9d9'}}>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'ControlCenters' ? 'active' : ''}`} onClick={() => handleTabClick('ControlCenters')} role="tab" aria-controls="ControlCenters" aria-selected={activeTab === 'ControlCenters'}>Control Centers</a>
        </li>
        <li className="nav-item">
          <a className={`nav-link text-secondary ${activeTab === 'CollateralManager' ? 'active' : ''}`} onClick={() => handleTabClick('CollateralManager')} role="tab" aria-controls="CollateralManager" aria-selected={activeTab === 'CollateralManager'}>Inventory Overview</a>
        </li>
      </ul>

      {/* Modal for prompting the user */}
      <Modal show={showAlertModal} onHide={handleCloseModal} className='mt-5'>
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
      {activeTab === 'ControlCenters' && (
        <div>
          <hr />
          <div className='d-flex justify-content-between align-items-center'>
            <h4 className='text-secondary mx-2' style={{ marginRight: '5px', color:'#666666' }}><FaClipboardList /> All Control Centers</h4>
           
                <a href='/collateral-manager-register '>
          </a>

          <Button className="btn btn-info mb-5" style={{width:'250px', fontSize:'15px'}} onClick={() => setShowModal(true)}>
    <FaPlus style={{ marginRight: '5px', fontSize:'15px' }} />
    Add Control Center
  </Button>

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
</tbody>
</table>
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
{activeTab === 'InventoryOverview' && selectedManager && inventory && (
  <div style={{ padding: '20px' }}>
    <div style={{ backgroundColor: '#f9f9f9', borderRadius: '5px', padding: '10px', marginBottom: '20px' }}>
      <h5>Inventory Information</h5><hr />
      <span style={{fontSize:'12px', color:'#666666', fontWeight:'bold'}}> Managed by {selectedManager.assigned_agent_full_name} </span>

      {inventory && (
        <div>
          <p><strong>Control center:</strong> {inventory.name}</p>
          <p><strong>Seller:</strong> {inventory.breadertrades.seller}</p>
          {/* Render other inventory details as needed */}
        </div>
      )}
    </div>
    {/* Display total weight at the top */}
      {/* Calculate total breeds supplied */}
      <div className='d-flex'>
      <p className='mx-4'><strong>Total available:</strong><span className='mx-2' style={{fontWeight:'700', fontSize:'20px', color:'#001b42'}}>{Object.values(inventory.breadertrades.reduce((acc, trade) => {
            if (!acc[trade.breed]) {
              acc[trade.breed] = 0;
            }
            acc[trade.breed] += trade.breeds_supplied;
            return acc;
          }, {})).reduce((total, count) => total + count, 0)}</span> </p>
          
    <p><strong>Total Weight:</strong> {Object.values(inventory.breadertrades.reduce((acc, trade) => {
      if (!acc[trade.breed]) {
        acc[trade.breed] = 0;
      }
      acc[trade.breed] += trade.goat_weight;
      return acc;
    }, {})).reduce((total, weight) => total + weight, 0)} Kgs</p>
    </div>
    {/* Display each trade item */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    {inventory.breadertrades && inventory.breadertrades.length > 0 && (
  <div>
    {/* Group trades by breed */}
    {Object.values(inventory.breadertrades.reduce((acc, trade) => {
      if (!acc[trade.breed]) {
        acc[trade.breed] = {...trade, totalBreedsSupplied: 0, totalWeight: 0};
      }
      acc[trade.breed].totalBreedsSupplied += trade.breeds_supplied;
      acc[trade.breed].totalWeight += trade.goat_weight;
      return acc;
    }, {})).map((trade, index) => (
      <div key={index} style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px', padding: '10px', display: 'grid', gridTemplateColumns: '1fr 3fr' }}>
        <h5 style={{ fontSize: '14px', fontWeight: '500', color: '#666666', gridColumn: '1 / span 2' }}>Raw material: <span style={{ fontSize: '16px', fontWeight: '700', color: '#666666' }}>{trade.breed}</span> </h5>
        <hr style={{ gridColumn: '1 / span 2' }} />
        <div>
          <p><strong>Level:</strong> {trade.totalBreedsSupplied}</p>
        </div> &nbsp;
        <div>
          <p><strong>Weight:</strong> {trade.totalWeight} Kgs</p>
        </div>
      </div>
    ))}
    {/* Calculate total breeds supplied */}
  
  </div>
)}

    </div>
  </div>
)}




    </div>
  );
};

export default ControlCenters;
