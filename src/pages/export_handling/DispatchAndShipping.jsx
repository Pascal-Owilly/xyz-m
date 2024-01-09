import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaTruck } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../auth/config';

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

  const getStatusIndex = (status) => ['Order Placed', 'Processing', 'Shipped', 'Arrived', 'Received'].indexOf(status);

  useEffect(() => {
    axios.get(`${baseUrl}/api/logistics-status/`)
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
  
      axios.patch(`${baseUrl}/api/logistics-status/${statusId}/`, { status: newStatus })
        .then(response => {
          console.log('Logistics status updated:', response.data);
          setUpdateMessage(`Order No: ${response.data.invoice_number} updated successfully to ${newStatus}`);
        })
        .catch(error => {
          console.error('Error updating logistics status:', error);
          setUpdateMessage('Error updating order status. Please try again.');
        });
    }
  };
  

  const handleUpdateLogisticsStatus = (statusId, newStatus) => {
    axios.patch(`${baseUrl}/api/logistics-status/${statusId}/`, { status: newStatus })
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
    <div key={order.id}>
      <h6 className='mb-3'>Order #{order.id} - {order.status}</h6>
      <button
        className="btn btn-info btn-sm mr-2"
        onClick={() => updateOrderLocation(order.id, order.location)}
      >
        <FaTruck /> Track Location
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
    </div>
  );

  return (
    <section className="main-container container-fluid" style={{minHeight:'85vh'}}>
      <div>
      {updateMessage && <div className="alert alert-success">{updateMessage}</div>}

        {orders.map(renderOrderDetails)}
        <h6 className='mb-3 mt-3'>Logistics Statuses</h6>
        <div className="card mb-4" style={{ maxWidth: '100%', margin: 'auto' }}>
          <div className="card-body">
            <h5 className="card-title">Logistics Progress</h5>
            <div className="progress" style={{ position: 'relative', padding: '' }}>
              {shipmentProgressData.map((status, index) => (
                <div
                  key={index}
                  className={`progress-bar ${getStatusIndex(status) < getStatusIndex('Received') ? 'bg-primary' : 'bg-secondary'}`}
                  role="progressbar"
                  style={{ width: `${(100 / 5)}%` }}
                >
                  {status}
                </div>
              ))}

              <div style={{ position: 'absolute', top: 0, left: `${(getStatusIndex('Received') * (100 / 5) + (50 / 5))}%`, transform: 'translateX(-50%)' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: '#fff', borderRadius: '50%', border: '2px solid #007bff' }}></div>
              </div>
            </div>
            <h6 className='mt-3 mb-2'>Current Statuses</h6>
            <ul className="list-group">
              {logisticsStatuses.map((status) => (
                <li
                  key={status.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: 'white', opacity: 0.7 }}
                >
                  <span>{`Order No: ${status.invoice_number} - ${status.status}`}</span>
                  <button
                    className="btn btn-warning btn-sm m-2  "
                    onClick={() => handleUpdateStatus(status.id, 'dispatched')}
                  >
                    Dispatched
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleUpdateStatus(status.id, 'shipped')}
                  >
                    Shipped
                  </button>
                </li>
                
              ))}
            </ul>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExportHandling;
