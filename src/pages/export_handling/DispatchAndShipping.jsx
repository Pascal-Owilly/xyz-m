import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaTruck, FaShippingFast, FaCheck, FaArchive } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import { Row, Col, Card, Container, Form, Table, Button, Navbar, Nav, NavDropdown, Pagination, Modal} from 'react-bootstrap';

const ExportHandling = ({packageInfo}) => {

  // Define a functional component for the invoice modal
const InvoiceModal = ({ invoiceDetails, handleClose }) => {
  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Invoice Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Invoice Number: {invoiceDetails.invoice_number}</p>
        <p>Amount: {invoiceDetails.amount}</p>
        <p>Date: {invoiceDetails.date}</p>
        {/* Add more invoice details as needed */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

  const baseUrl = BASE_URL;
  const [map, setMap] = useState(null);
  const [logisticsStatuses, setLogisticsStatuses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shipmentProgressData, setShipmentProgressData] = useState([]);
  const [arrivedOrdersData, setArrivedOrdersData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [activeSection, setActiveSection] = useState('InformationSection');
  const [selectedPackageInfo, setSelectedPackageInfo] = useState(null);

  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const getStatusIndex = (status) => ['Order Placed', 'Processing', 'Shipped', 'Arrived', 'Received'].indexOf(status);

  // package info id

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
    axios.get(`${baseUrl}/api/invoice/${invoiceNumber}/`)
      .then(response => {
        setSelectedInvoiceDetails(response.data);
        setShowInvoiceModal(true);
      })
      .catch(error => {
        console.error('Error fetching invoice details:', error);
      });
  };

  const handleCloseInvoiceModal = () => setShowInvoiceModal(false);

  
  useEffect(() => {

  axios.get(`${baseUrl}/api/package-info/`)
  .then(response => {
    setSelectedPackageInfo(response.data);
    console.log('package', response)
    // Here, you can trigger a modal or another component to show the package details
  })
  .catch(error => {
    console.error('Error fetching package info:', error);
    // Handle error
  });
}, []);

  useEffect(() => {
    axios.get(`${baseUrl}/api/all-logistics-statuses/`)
      .then(response => {
        setLogisticsStatuses(response.data);
        console.log(response)

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

  useEffect(() => {
    if (!map) {
      setMap(
        <MapContainer center={[0, 0]} zoom={2}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      );
    }
    
  }, [map]);

  const updateOrderLocation = (order, coordinates) => {
    if (map) {
      setMap(
        <>
          {map}
          <Marker position={coordinates}>
            <Popup>{`Order No: ${order} - Current Location`}</Popup>
          </Marker>
        </>
      );
    }
  };

  const handleUpdateStatus = (statusId, newStatus) => {
    // Check if the button is already disabled
    if (!disabledButtons.includes(statusId)) {
      // Check if the status is already 'shipped'
      if (newStatus === 'shipped') {
        // Disable the button to prevent further updates
        setDisabledButtons(prevButtons => [...prevButtons, statusId]);
      }
  
      // Display a confirmation popup
      const confirmed = window.confirm(`Are you sure you want to update the status to ${newStatus}?`);
  
      if (!confirmed) {
        return; // Do nothing if not confirmed
      }
  
      axios.patch(`${baseUrl}/api/all-logistics-statuses/${statusId}/`, { status: newStatus })
        .then(response => {
          console.log('Logistics status updated:', response.data);
          setUpdateMessage(`Order No: ${response.data.invoice_number} updated successfully to ${newStatus}`);
        })
        .catch(error => {
          console.error('Error updating logistics status:', error);

        // Extract the error message from error.response.data
        const errorMessage = error.response.data.detail || 'An error occurred while updating the status.';

        // Set the error message to state if you want to display it in your component
        setUpdateMessage(errorMessage);
        });
    }
  };
  
  

  const handleUpdateLogisticsStatus = (statusId, newStatus) => {
    axios.patch(`${baseUrl}/api/all-logistics-statuses/${statusId}/`, { status: newStatus })
      .then(response => {
        console.log('Logistics status updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating logistics status:', error);
      });
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    axios.patch(`${baseUrl}/api/order/${orderId}/`, { status: newStatus })
      .then(response => {
        console.log('Order status updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating order status:', error);
      });
  };

  const handleUpdateShipmentProgress = (shipmentId, newStatus) => {
    axios.patch(`${baseUrl}/api/shipment-progress/${shipmentId}/`, { status: newStatus })
      .then(response => {
        console.log('Shipment progress updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating shipment progress:', error);
      });
  };

  const handleUpdateArrivedOrder = (arrivedOrderId) => {
    axios.patch(`${baseUrl}/api/arrived-order/${arrivedOrderId}/`, {})
      .then(response => {
        console.log('Arrived order updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating arrived order:', error);
      });
  };

  const handleOrderButtonClick = (orderId, newStatus) => {
    handleUpdateOrderStatus(orderId, newStatus);

    const updatedShipmentProgress = shipmentProgressData.map((status, index) => {
      if (index === getStatusIndex(newStatus)) {
        return newStatus;
      }
      return status;
    });

    setShipmentProgressData(updatedShipmentProgress);
  };


  const renderLogisticsStatus = (status) => (
    <tr key={status.id}>
      <td style={{ color: '#999999', fontWeight: 'bold' }}>
      <button 
          style={{ 
            border: 'none', 
            background: 'none', 
            color: '#001b40', 
            textDecoration: 'underline', 
            cursor: 'pointer' 
          }} 
          onClick={() => handleInvoiceDetailsClick(status.invoice_number)}
        >
          {status.invoice_number}
        </button>
      </td>
      <td className='d-flex'>
        <span
          style={{
            fontWeight: 'bold',
            color: '#333333',
            marginRight: '5px',
            textTransform: 'capitalize',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            padding: '5px',
            fontSize:'12px',
          }}
        >
          {status.status}
        </span>
        {status.status === 'dispatched' && (
          <div style={{ backgroundColor: '', padding: '2px', borderRadius: '50%' }}>
            <FaTruck style={{ fontSize: '22px', color: 'green' }} />
          </div>
        )}
        {status.status === 'shipped' && (
          <div style={{ backgroundColor: '', padding: '10px', borderRadius: '50%' }}>
            <FaShippingFast style={{ fontSize: '22px', color: 'blue' }} />
          </div>
        )}
        {status.status === 'arrived' && (
          <div style={{ backgroundColor: '', padding: '2px', borderRadius: '50%' }}>
            <FaArchive style={{ fontSize: '22px', color: 'green' }} />
          </div>
        )}
        {status.status === 'received' && (
          <div style={{ backgroundColor: '', padding: '10px', borderRadius: '50%' }}>
            <FaCheck style={{ fontSize: '22px', color: 'green' }} />
          </div>
        )}
      </td>
      <td style={{ color: '#999999', fontWeight: 'bold' }}>
        <div className='d-flex'>
          <select className="form-select p-1 text-dark bg-light" onChange={(e) => handleUpdateStatus(status.id, e.target.value)}>
            <option style={{fontSize:'12px'}} value="">Update</option>
            <option style={{fontSize:'12px'}} value="dispatched">Dispatched</option>
            <option style={{fontSize:'12px'}} value="shipped">Shipping</option>
            <option style={{fontSize:'12px'}} value="arrived">Arrived</option>
            <option style={{fontSize:'12px'}} value="received">Received</option>
          </select>
        </div>
      </td>
      <td style={{ color: '#999999', fontSize:'12px' }}>{status.buyer}</td>
      <td style={{ color: '#999999', fontSize:'12px' }}>{status.seller}</td>

      <td style={{ color: '#999999', fontSize:'12px' }}>{status.logistics_company}</td>
      <td style={{ color: '#999999', fontSize:'12px' }}>
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
View Package Info
</button>
      </td>
      <td style={{ color: '#999999', fontSize:'12px' }}>{status.shipping_mode}</td>
      <td style={{ color: '#999999', fontSize:'12px' }}>{status.time_of_delivery}</td>
    </tr>
  );
  

const handleButtonClick = (section) => {
  setActiveSection(section);
};

  return (

    <div className='main-container container-fluid' style={{ minHeight: '85vh' }}>
      {/* Navbar */}
      <Navbar bg="" expand="lg" variant="dark" style={{background:'#001b40'}}>
      <Navbar.Brand>
      <h6 className='text-light'>Export updates</h6>
      </Navbar.Brand>

    </Navbar>

    <section className="" >
    <p className='mt-4'>Here, you'll be responsible for updating logistics statuses." Your attention to detail and timely updates in this area are crucial for maintaining accurate records and ensuring transparency in our shipping processes. </p>

    <div>
      {updateMessage && <div className="alert alert-success">{updateMessage}</div>}

      <div className="card mb-4" style={{ width: '100%', margin: 'auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
  <div className="card-body">
    <h5 className="card-title">Logistics Progress</h5>
    {/* Your progress bar code */}
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ color: '#999999', fontSize:'12px' }}>Tracking No</th>
            <th style={{ color: '#999999', fontSize:'12px' }}>Current Status</th>
            <th style={{ color: '#999999', fontSize:'12px' }}>Actions</th>
            <th style={{ color: '#999999', fontSize:'12px' }}>Buyer</th>
            <th style={{ color: '#999999', fontSize:'12px' }}>Seller</th>
            <th style={{ color: '#999999', fontSize:'12px' }}>Logistics Company</th>
            <th style={{ color: '#999999', fontSize:'12px' }}>Package Info</th>
            <th style={{ color: '#999999', fontSize:'12px' }}>Shipping Mode</th>
            <th style={{ color: '#999999', fontSize:'12px' }}>Time of Delivery</th>
          </tr>
        </thead>
        <tbody>
          {logisticsStatuses.map(renderLogisticsStatus)}
        </tbody>
      </table>
    </div>
  </div>
</div>

    </div>
  </section> 

  <Modal show={show} onHide={handleClose} animation={true}>
  <Modal.Header closeButton>
    <Modal.Title>Package Info</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedPackageInfo && (
     <>
     <p style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>Package Name: {selectedPackageInfo.package_name}</p>
     <p style={{ marginBottom: '8px' }}>Package Description: {selectedPackageInfo.package_description}</p>
     <p style={{ marginBottom: '8px' }}>Package Charge: {selectedPackageInfo.package_charge}</p>
     <p style={{ marginBottom: '8px' }}>Weight: {selectedPackageInfo.weight}</p>
     <p style={{ marginBottom: '8px' }}>Height: {selectedPackageInfo.height}</p>
     <p style={{ marginBottom: '8px' }}>Length: {selectedPackageInfo.length}</p>
   </>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
  </Modal.Footer>
</Modal>




  </div>
   );
};

export default ExportHandling;
