import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';
import { Form, Button, Pagination, Modal } from 'react-bootstrap';

const ControlCenters = () => {
  const baseUrl = BASE_URL;
  const [controlCenters, setControlCenters] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPageControlCenters, setCurrentPageControlCenters] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page\
  const [activeTab, setActiveTab] = useState('ControlCenters');
  const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
  const [showAlertModal, setShowAlertModal] = useState(false); // State for showing/hiding the modal
  const [collateralManagers, setCollateralManagers] = useState([]);
  const [selectedCollateralManagerId, setSelectedCollateralManagerId] = useState(null);
  const [selectedControlCenterId, setSelectedControlCenterId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);

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

// Function to confirm the update of collateral manager
const handleConfirmUpdate = async () => {
  const isConfirmed = window.confirm('Are you sure you want to update the collateral manager?');
  if (isConfirmed) {
    try {
      // Attempt to update the collateral manager
      await updateCollateralManager();
      // If updateCollateralManager succeeds, set success message
      // setMessage('Operation successful.');
      setIsSuccess(true);
    } catch (error) {
      // If updateCollateralManager fails, set failure message
      // setMessage('Operation failed.');
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
    console.log('Updated control center', updatedControlCenters)
    // Check if the assigned collateral manager ID matches the selected one
    if (response.data.assigned_collateral_agent === selectedCollateralManagerId) {
      setMessage('Collateral manager successfully assigned to control center.');
    }
     else {
      setMessage('Collateral manager successfully assigned to control center');
    }
  } catch (error) {
    setMessage('Error updating collateral manager:', error);
  }
};

// Function to handle changes in the selected collateral manager
const handleCollateralManagerChange = async (controlCenterId, event) => {
  const selectedCollateralManagerId = event.target.value;
  
  // Show a confirmation alert to confirm the update
  const isConfirmed = window.confirm('Are you sure you want to update the collateral manager?');
  
  // Proceed with the update only if the user confirms
  if (isConfirmed) {
    try {
      // Make an API request to update the control center with the selected collateral manager's ID
      const response = await axios.put(`${baseUrl}/api/control-centers/${controlCenterId}/`, {
        assigned_collateral_agent: selectedCollateralManagerId,
      });

      // Update the state or UI to reflect the changes
      if (response.status === 200) {
        // Update the control centers state with the updated data
        const updatedControlCenters = controlCenters.map(center => {
          if (center.id === controlCenterId) {
            return {
              ...center,
              assigned_collateral_agent: selectedCollateralManagerId,
            };
          }
          return center;
        });
        setControlCenters(updatedControlCenters);
        // Optionally, show a success message to the user
        setSuccessMessage('Collateral manager successfully assigned to control center.');
      } else {
        // Handle the error scenario, show an error message or take appropriate action
        setErrorMessage('Failed to assign collateral manager to control center.');
      }
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error('Error assigning collateral manager:', error);
      setErrorMessage('Error assigning collateral manager. Please try again.');
    }
  } else {
    // If the user cancels the update, do nothing
    console.log('Update cancelled by user');
  }
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
          <a className={`nav-link text-secondary ${activeTab === 'InventoryOverview' ? 'active' : ''}`} onClick={() => handleTabClick('CollateralManager')} role="tab" aria-controls="CollateralManager" aria-selected={activeTab === 'InventoryOverview'}>Inventory Overview</a>
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

              
      {activeTab === 'ControlCenters' && (
        <div>
          <hr />
          <div className='d-flex justify-content-between align-items-center'>
            <h4 className='text-secondary mx-2' style={{ marginRight: '5px', color:'#666666' }}><FaClipboardList />  Control Centers</h4>
            
          <a href='/collateral-manager-register'>
          <Button variant="" style={{fontSize:"12px", backgroundColor:'#001b42', color:'white'}} >
          <FaPlus style={{ marginRight: '5px', fontSize:'15px' }} />
                Add Collateral Manager
          </Button>
          </a>
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
        <td>Update</td>
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
      <td>{center.seller_full_name}</td>
      <td style={{fontFamily:'verdana', fontWeight:'bold',fontSize:'15px'}}>{center.assigned_agent_full_name}</td>
      <td>
   
<select 
  className="form-select" 
  value={center.assigned_collateral_agent ? center.assigned_collateral_agent.id : ""} // Use ID for value
  onChange={(e) => handleCollateralManagerChange(center.id, e)}
  style={{ boxShadow: 'none', border: '1px solid #ced4da', borderRadius: '4px', background:'#fff', color:'#666666', padding:'5px' }} // Custom inline styles for additional styling
>
  <option value="">Select collateral manager</option>
  {collateralManagers.map(manager => (
    <option key={manager.id} value={manager.id}>{manager.full_name}</option> // Display manager's name
  ))}
</select>

</td>
      <td>
        <button className="btn btn-sm text-light" style={{backgroundColor:'#001b42', fontSize:'10px', width:'90px', fontWeight:'bold'}} onClick={() => handleManagerClick(center)}>View Details</button>
      </td>
    </tr>
  ))}
</tbody>
</table></div>

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
    {inventory && (
<>
      <h5 style={{ color: '#999999'}}>{inventory.name} inventory information</h5><hr />
      </>
      )}
     
      {inventory && (
        <div style={{color:'#999999'}} className='d-flex align-items-center justify-content-flex-start'>
          <p style={{color:'#999999'}} className='mx-2'><strong>Seller:</strong> {inventory.seller_full_name}</p>
           <span style={{fontSize:'50px',marginTop:'-2.7rem'}}>.</span> 
 <p className='mx-2' style={{fontSize:'', color:'#999999', fontWeight:''}}><strong> Collateral manager: </strong>  {selectedManager.assigned_agent_full_name} </p>
        </div>
      )}
    </div>
    {/* Display total weight at the top */}
      {/* Calculate total breeds supplied */}
      <div className='d-flex'>
      {inventory.breadertrades && inventory.breadertrades.length > 0 && (

      <p className='mx-4'><strong>Total available:</strong><span className='mx-2' style={{fontWeight:'700', fontSize:'25px', color:'#001b42'}}>{Object.values(inventory.breadertrades.reduce((acc, trade) => {
            if (!acc[trade.breed]) {
              acc[trade.breed] = 0;
            }
            acc[trade.breed] += trade.breeds_supplied;
            return acc;
          }, {})).reduce((total, count) => total + count, 0)}</span> </p>
      )}
    {inventory.breadertrades && inventory.breadertrades.length > 0 && (
  <p><strong>Total weight:</strong> {Object.values(inventory.breadertrades.reduce((acc, trade) => {
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
      <div className='' >
        
      <div key={index} style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px', padding: '10px', display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
        <h5 style={{ fontSize: '14px', fontWeight: '500', color: '#666666', gridColumn: '1 / span 2' }}>Raw material: <span style={{ fontSize: '16px', fontWeight: '700', color: '#666666' }}>{trade.breed}</span> </h5>
        <hr style={{ gridColumn: '1 / span 2' }} />
        <div>
          <p><strong>Inventory level:</strong> {trade.totalBreedsSupplied}</p>
        </div> &nbsp;
        <div>
          <p><strong>Weight:</strong> {trade.totalWeight} Kgs</p>
        </div>
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
