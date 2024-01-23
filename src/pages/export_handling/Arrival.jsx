import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaTruck, FaShippingFast, FaCheck, FaArchive} from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import { Row, Col, Card, Container, Form, Table, Button, Navbar, Nav, NavDropdown, Pagination, Modal} from 'react-bootstrap';

const ExportHandling = () => {
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

  const getStatusIndex = (status) => ['Order Placed', 'Processing', 'Shipped', 'Arrived', 'Received'].indexOf(status);

  useEffect(() => {
    axios.get(`${baseUrl}/api/all-logistics-statuses/`)
      .then(response => {
        setLogisticsStatuses(response.data);
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
      // Display a confirmation popup
      const confirmed = window.confirm(`Are you sure you want to update the status to ${newStatus}?`);
      
      if (!confirmed) {
        return; // Do nothing if not confirmed
      }
  
      // Disable the button to prevent multiple clicks
      setDisabledButtons(prevButtons => [...prevButtons, statusId]);
  
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

  const renderOrderDetails = (order) => (
    <tr key={order.id}>
      <td>{order.id}</td>
      <td>{order.status}</td>
      {/* Add more columns as needed */}
      <td>
        <button className="btn btn-info btn-sm mr-2" onClick={() => updateOrderLocation(order.id, order.location)}>
           Track Location
        </button>
        {['Processing', 'Shipped', 'Arrived', 'Received'].map((status) => (
          <button
            key={status}
            className={`btn btn-success btn-sm mr-2`}
            onClick={() => handleOrderButtonClick(order.id, status)}
            disabled={order.status === status}
          >
            {status}
          </button>
        ))}
      </td>
    </tr>
  );

  const renderLogisticsStatus = (status) => (
  <tr key={status.id}>
    <td>
      <span style={{ textTransform: 'capitalize', color: '#333', fontSize: '14px', display: 'flex', alignItems: 'center', fontWeight:'bold' }}>
         #{status.invoice_number} 
       
      </span>
    </td>
    <td className='d-flex'>
<span
  style={{
    fontWeight: '',
    marginLeft: '5px',
    color: 'black',
    marginRight: '5px',
    textTransform: 'capitalize',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Added box shadow
    padding: '5px', // Adjust padding as needed
  }}
>
  {status.status}
</span>

{status.status === 'dispatched' && (
          <div style={{ backgroundColor: '', padding: '2px', borderRadius: '50%' }}>
            <FaTruck  style={{ fontSize: '22px', color: 'green' }} />
          </div>
        )}
        {status.status === 'shipped' && (
          <div style={{ backgroundColor: '', padding: '10px', borderRadius: '50%' }}>
            <FaShippingFast  style={{ fontSize: '22px', color: 'blue' }} />
          </div>
        )}
        {status.status === 'arrived' && (
          <div style={{ backgroundColor: '', padding: '2px', borderRadius: '50%' }}>
            <FaArchive  style={{ fontSize: '22px', color: 'green' }} />
          </div>
        )}
        {status.status === 'received' && (
          <div style={{ backgroundColor: '', padding: '10px', borderRadius: '50%' }}>
            <FaCheck  style={{ fontSize: '22px', color: 'green' }} />
          </div>
        )}
    </td>
    <td >
      <div className='d-flex'>
      <button className="btn btn-warning btn-sm" onClick={() => handleUpdateStatus(status.id, 'arrived')}>
        Arrived
      </button> &nbsp;&nbsp;
      <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(status.id, 'received')}>
        Received
      </button>
      </div>
    </td>
  </tr>
);

const handleButtonClick = (section) => {
  setActiveSection(section);
};

  return (

    <div className='main-container container-fluid' style={{ minHeight: '85vh' }}>
      {/* Navbar */}
      <Navbar  bg="warning" expand="lg" variant="dark">
      <Navbar.Brand>
      <h6 className='text-dark'>Arrival & Reception Dashboard</h6>
      </Navbar.Brand>

    </Navbar>

    <section className="" >
    <p className='mt-4'>
    In this dashboard, you will be responsible for updating logistics statuses, specifically from "Arrived" to "Received." It's essential to exercise caution, particularly when triggering the "Received" status, as this action prompts notification to the bank for payment release. Ensure accuracy and careful consideration during this process.       </p>

    <div>
      {updateMessage && <div className="alert alert-success">{updateMessage}</div>}

      <div className="card mb-4" style={{ width: '100%', margin: 'auto' }}>
        <div className="card-body">
          <h5 className="card-title">Logistics Progress</h5>
          {/* Your progress bar code */}
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Current Status</th>
                  <th>Actions</th>
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
  </div>
   );
};

export default ExportHandling;
