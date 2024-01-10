import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaTruck } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import { Button } from 'react-bootstrap';
import { Card } from 'react-bootstrap';

const ExportHandling = () => {
  const baseUrl = BASE_URL;
  const [map, setMap] = useState(null);
  const [logisticsStatuses, setLogisticsStatuses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shipmentProgressData, setShipmentProgressData] = useState([]);
  const [arrivedOrdersData, setArrivedOrdersData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ordered':
        return 'btn-primary';
      case 'Dispatched':
        return 'btn-secondary';
      case 'Shipped':
        return 'btn-info';
      case 'Arrival':
        return 'btn-warning';
      case 'Received':
        return 'btn-success';
      default:
        return 'btn-light';
    }
  };

  const cardStyle = {
    fontSize: '14px',
    textTransform: 'capitalize',
    letterSpacing: '2px',
    color: 'white',
    backgroundColor: 'green',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add box shadow
    border: '1px solid',
    borderImage: 'green', // Add gradient border
    borderRadius: '', // Adjust border radius as needed
    padding:'0.6rem'
  };
  

  const getStatusIndex = (status) => ['ordered', 'dispatched', 'shipped', 'arrived', 'received'].indexOf(status);

  useEffect(() => {
    axios.get(`${baseUrl}/api/logistics-status/`)
      .then(response => {
        setLogisticsStatuses(response.data);

        console.log('response', response)
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
            <Popup>{`Order #${order} - Current Location`}</Popup>
          </Marker>
        </>
      );
    }
  };

  const calculatePercentage = (status) => {
    const index = getStatusIndex(status);
    return (index + 1) * (100 / 5);
  };

  const renderOrderDetails = (order) => (
    <div key={order.id} className="order-details">
      <h6 className='mb-3'>Order #{order.id} - {order.status}</h6>
  
      <Card className={`card ${getStatusColor(order.status)} mr-2`} disabled>
        <Card.Body>
          <Card.Title>{order.status}</Card.Title>
          <Card.Text>
            <FaTruck /> Track Location
          </Card.Text>
        </Card.Body>
      </Card>
  
      {logisticsStatuses
        .filter((status) => status.invoice === order.id)
        .map((status) => (
          <Card
            key={status.id}
            className={`card ${getStatusColor(status.status)} mr-2`}
            disabled
          >
            <Card.Body>
              {status.status}
            </Card.Body>
          </Card>
        ))}
      <ProgressBar now={calculatePercentage(order.status)} label={`${order.status} - ${calculatePercentage(order.status)}%`} />
    </div>
  );
  
  return (
    <section className="main-container container-fluid" style={{minHeight:'85vh'}}>
      <div>
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
                  style={{
                    backgroundColor: 'white',
                    opacity: 0.7,
                    borderBottom: '1px solid #ddd', // Add a border for separation
                    padding: '10px', // Add padding for better spacing
                  }}
                >
                  <div>
                    {/* <span style={{ fontWeight: 'bold' }}>{`Invoice #${status.invoice_number}`}</span> */}
                    <br />
                    Invoice No: <span style={{fontWeight:'bold'}} className='text-dark'>{` ${status.invoice_number}`}</span>
                  </div>
                  <div>
                   <Card style={cardStyle} className={'card'} disabled>
                   {status.status}
    </Card>
                  </div>
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
