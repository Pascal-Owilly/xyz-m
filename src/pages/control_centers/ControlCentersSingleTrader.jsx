
import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import { useNavigate } from 'react-router-dom';

const ControlCenters = () => {
  const baseUrl = BASE_URL;
  const navigate = useNavigate();
  const [controlCenters, setControlCenters] = useState([]);
  const [collateralManagers, setCollateralManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [newControlCenterName, setNewControlCenterName] = useState('');
  const [newCollateralManagerName, setNewCollateralManagerName] = useState('');

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


  const [activeTab, setActiveTab] = useState('ControlCenters');
  const [billOfLading, setBillOfLading] = useState(null);

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
    <h2>Control Centers</h2>
    <div>
      <h3>Inventory</h3>
      {/* Display inventory items */}
    </div>
    <div>
      <div>
        <h4>Managed by collateral manager - appointed by bank</h4>
        <ul>
          {collateralManagers.map((manager, index) => (
            <li key={index} onClick={() => handleManagerClick(manager)}>
              {manager.name}
            </li>
          ))}
        </ul>
        {selectedManager && (
          <div>
            <h5>{`Controlled by ${selectedManager.name}`}</h5>
            <h3>collateral manager 1</h3>
          </div>
        )}
      </div>
    </div>
    <div style={{ textAlign: 'right', marginRight: '20px', marginTop: '20px' }}>
      <button
        onClick={handleAddManager}
        style={{
          borderRadius: '30px',
          backgroundColor: 'white',
          color: 'gray',
          padding: '10px 20px',
          border: '2px solid gray',
          cursor: 'pointer',
        }}
      >
        <FaPlus style={{ marginRight: '5px' }} />
        Add Collateral Manager
      </button>
    </div>
  </div>
)}

      {activeTab === 'CollateralManager' && (
        <div>
          <h2>Collateral Manager</h2>
                      <hr />

          <div>
            <h4>Upload Bill of Lading</h4>
            <input type="file" onChange={handleUploadBillOfLading} />
            {billOfLading && (
              <p>File uploaded: {billOfLading.name}</p>
            )}
          </div>        </div>
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

     
    </div>
  );
};

export default ControlCenters;
