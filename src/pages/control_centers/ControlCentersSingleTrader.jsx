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
  const [sellers, setSellers] = useState([]);
  const [profile, setProfile] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null); // State to track selected seller
  const [formData, setFormData] = useState({
    seller: null, 

  });

  const handleAddControlCenter = async () => {
    try {
      // Create a new FormData object
      const formData = new FormData();
  
      // Extract the seller ID from the selected seller object
      const sellerId = selectedSeller ? selectedSeller.id : null;
      // Convert sellerId to an integer if it's a string
      const sellerIdInt = parseInt(sellerId);

      // Append control center data to FormData
      formData.append('name', newControlCenterName);
      formData.append('location', newLocation);
      formData.append('address', newAddress);
      formData.append('contact', newContact);
      formData.append('seller', sellers[0].id); // Append the selected seller's ID
  
      // Make the POST request with the FormData object
      await axios.post(`${baseUrl}/api/control-centers/`, formData);
  
      // Refresh control centers after adding a new one
      fetchControlCenters();
  
      // Clear the input fields after adding
      setNewControlCenterName('');
      setNewLocation('');
      setNewAddress('');
      setNewContact('');
  
      // Show success message
      setSuccessMessage('Control center added successfully.');
      setErrorMessage('');
  
      // Close the modal
      setShowModal(false);
    } catch (error) {
      console.error('Error adding control center:', error);
      // Show error message
      setSuccessMessage('');
      setErrorMessage('Failed to add control center.');
    }
  };
  
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      if(!accessToken){
        navigate('/')
      }
      if (accessToken) {
        const response = await axios.get(`${baseUrl}/auth/user/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userProfile = response.data;
        setProfile(userProfile);
      }
    } catch (error) {
      // Check if the error indicates an expired access token
      if (error.response && error.response.status === 401) {
        // Attempt to refresh the access token
        await refreshAccessToken();
      } else {
        console.error('Error fetching user data:', error);
      }
    }
  };

  fetchUserData();
}, [baseUrl, navigate]);

useEffect(() => {
  const fetchSellers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/sellers/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('sellers', response.data)
      setSellers(response.data);

      // Set the default seller if profile is available
      if (profile) {
        const loggedInSeller = response.data.find(seller => seller.id === profile.id);
        if (loggedInSeller) {
          setFormData(prevFormData => ({
            ...prevFormData,
            seller: loggedInSeller, // Set the entire seller object
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };
  fetchSellers();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [baseUrl, accessToken, profile]);



useEffect(() => {
  handleSellerChange();
}, [sellers]);

// Function to handle changes in the selected seller
const handleSellerChange = (event) => {
  if (event && event.target) {
    const selectedSellerId = parseInt(event.target.value);
    // Find the selected seller by ID
    const seller = sellers.find((seller) => seller.id === selectedSellerId);
    // Set the selected seller
    setSelectedSeller(seller);
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
          <a className={`nav-link text-secondary ${activeTab === 'InventoryOverview' ? 'active' : ''}`} onClick={() => handleTabClick('CollateralManager')} role="tab" aria-controls="InventoryOverview" aria-selected={activeTab === 'InventoryOverview'}>Inventory Overview</a>
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
    <div className="col-md-6 mb- d-none">
  <label htmlFor="seller" className="form-label">
  </label>
  <div>
    {formData.seller ? (
      <p>{formData.seller.full_name}</p>
    ) : (
      <select
      className="form-control"
      id="seller"
      name="seller"
      required
      value={selectedSeller ? selectedSeller.id : ''}
      onChange={handleSellerChange}
    >
      {sellers.map((seller) => (
        <option key={seller.id} value={seller.id}>
          {seller.full_name}
        </option>
      ))}
    </select>
    )}
  </div>
</div>

  </Form>
</Modal.Body>
<Modal.Footer>
  <Button className='btn btn-sm' variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
  <Button className='btn' variant="primary" onClick={handleAddControlCenter}>Add</Button>
</Modal.Footer>

      </Modal>
              
      {activeTab === 'ControlCenters' && (
        <div>
          <hr />
          <div className='d-flex justify-content-between align-items-center'>
            <h4 className='text-secondary mx-2' style={{ marginRight: '5px', color:'#666666' }}><FaClipboardList /> Control Centers</h4>
           
                <a href='/collateral-manager-register '>
          </a>

          <Button className="btn btn-info mb-5" style={{width:'250px', fontSize:'15px'}} onClick={() => setShowModal(true)}>
    <FaPlus style={{ marginRight: '5px', fontSize:'15px' }} />
    Add Control Center
  </Button>

          </div>
          <hr />
          {successMessage && <div className='success text-success'>{successMessage}</div>}
            {errorMessage && <div className='error'>{errorMessage}</div>}   
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
        <th>Seller</th>
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
      <td>{center.seller_full_name} {center.username}</td>

      <td style={{fontFamily:'verdana', fontWeight:'bold',fontSize:'15px'}}>{center.assigned_agent_full_name}</td>

      <td>
        <button className="btn btn-sm text-light" style={{backgroundColor:'#001b42', fontSize:'11px', fontWeight:'bold'}} onClick={() => handleManagerClick(center)}>View Details</button>
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
 <div style={{ backgroundColor: '#f9f9f9', borderRadius: '5px', padding: '10px', marginBottom: '20px', position: 'relative' }}>
    <h5 style={{ display: 'inline-block' }}>Inventory Information</h5>
    <a href='/inventory-record-forms'>
    <button className='btn-sm' style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor:'#001b42' }}>Remove Item</button> {/* Adjust top and right values as needed */}
    </a>
    <hr />
    <span style={{ fontSize: '12px', color: '#666666', fontWeight: 'bold' }}>Managed by {selectedManager.assigned_agent_full_name}</span>

    {inventory && (
      <div>
        <p><strong>Control center:</strong> {inventory.name}</p>
        {/* <p><strong>Seller:</strong> {inventory.breadertrades.seller}</p> */}
      </div>
    )}
  </div>
    {/* Display total weight at the top */}
      {/* Calculate total breeds supplied */}
      <div className='d-flex'>
               
      {inventory.breadertrades && inventory.breadertrades.length > 0 && (
  <p><strong>Total Weight:</strong> {Object.values(inventory.breadertrades.reduce((acc, trade) => {
    if (!acc[trade.breed]) {
      acc[trade.breed] = 0;
    }
    acc[trade.breed] += trade.goat_weight;
    return acc;
  }, {})).reduce((total, weight) => total + weight, 0)} Kgs</p>
)}

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

  </div>
)}


    </div>
  </div>
)}
    </div>
  );
};

export default ControlCenters;
