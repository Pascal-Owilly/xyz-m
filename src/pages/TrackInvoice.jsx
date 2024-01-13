import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProgressBar, Card } from 'react-bootstrap';
import {
  FaShoppingCart,
  FaTruck,
  FaShippingFast,
  FaMapMarkerAlt,
  FaCheck,
} from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from './auth/config';

const TrackInvoice = () => {
  const { invoiceNumber } = useParams();
  const baseUrl = BASE_URL;

  const [trackingStatus, setTrackingStatus] = useState(null);

  useEffect(() => {
    axios.get(`${baseUrl}/api/logistics-status/${invoiceNumber}`)
      .then(response => {
        console.log('Logistics Status:', response.data);
        const current = response.data; // Assuming the response directly contains the status
        setTrackingStatus(current || null);
        console.log('Current Status:', current ? current.status : 'Not found');
      })
      .catch(error => {
        console.error('Error fetching logistics status for invoice', invoiceNumber, ':', error);
      });
  }, [baseUrl, invoiceNumber]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'ordered':
        return <FaShoppingCart />;
      case 'dispatched':
        return <FaTruck />;
      case 'shipped':
        return <FaShippingFast />;
      case 'arrival':
        return <FaMapMarkerAlt />; // Use FaMapMarkerAlt for the 'arrival' status
      case 'received':
        return <FaCheck />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ordered':
        return 'info';
      case 'dispatched':
        return 'primary';
      case 'shipped':
        return 'dark';
      case 'arrival':
        return 'warning'; // Use 'warning' for the 'arrival' status
      case 'received':
        return 'success'; // Use 'success' for the 'received' status
      default:
        return 'light';
    }
  };

  return (
    <div className='main-container' style={{ minHeight: '85vh' }}>
      <h4 className='mb-4'>Tracking Invoice #{invoiceNumber}</h4>
      <Card className='p-2'>
        <Card.Title>
          Invoice stages from order to delivery
        </Card.Title>
        <Card.Body className="d-flex justify-content-between align-items-center">
          {['ordered', 'dispatched', 'shipped', 'arrival', 'received'].map((stage, index) => (
            <div key={index} className="d-flex flex-column align-items-center">
              <div
                className={`text-success mb-1 mx-5 `}
                style={{ borderRadius: '10px', fontSize: '20px' }}
              >
                {getStatusIcon(stage)}
              </div>
              <span>{stage.charAt(0).toUpperCase() + stage.slice(1)}</span>
            </div>
          ))}
        </Card.Body>
      </Card>

      {trackingStatus && (
        <>
          <ProgressBar
            variant={getStatusColor(trackingStatus.status)}
            now={100}
            label={`${trackingStatus.status}`}
            style={{
              fontWeight: 'bold',
              padding: '0.5rem',
              backgroundColor: getStatusColor(trackingStatus.status),
              borderRadius: '10px',
            }}
          />

          <div className='d-flex justify-content-center mt-4'>
            <Card style={{ width: '18rem' }} className='text-center'>
              <Card.Body>
                <span
                  style={{
                    fontSize: '40px',
                    color: getStatusColor(trackingStatus.status),
                  }}
                >
                  {getStatusIcon(trackingStatus.status)}
                </span>
                <Card.Title className='mt-2' style={{ fontWeight: 'bold', color: getStatusColor(trackingStatus.status), textTransform: 'capitalize' }}>
                  {trackingStatus.status}
                </Card.Title>
                <Card.Text>
                  Your order is currently {trackingStatus.status.toLowerCase()}.
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default TrackInvoice;
