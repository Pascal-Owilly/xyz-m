import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import { FaShoppingCart, FaTruck, FaShippingFast, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from './auth/config';

const TrackInvoice = () => {
  const { invoiceNumber } = useParams();
  const baseUrl = BASE_URL;

  const [trackingStatuses, setTrackingStatuses] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('');
  
  useEffect(() => {
    axios.get(`${baseUrl}/api/logistics-status/`)
      .then(response => {
        console.log('Logistics Statuses:', response.data);
        setTrackingStatuses(response.data);
        // Find and set the current status
        const current = response.data.find(status => status.status.toLowerCase() === 'received');
        setCurrentStatus(current ? current.status : '');
        console.log('Current Status:', current ? current.status : 'Not found');
      })
      .catch(error => {
        console.error('Error fetching logistics statuses:', error);
      });
  }, [baseUrl]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'ordered':
        return <FaShoppingCart />;
      case 'dispatched':
        return <FaTruck />;
      case 'shipped':
        return <FaShippingFast />;
      case 'arrival':
        return <FaMapMarkerAlt />;
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
        return 'success';
      case 'received':
        return 'info';
      default:
        return 'light';
    }
  };

  return (
    <div className='main-container' style={{ minHeight: '85vh' }}>
      <h4 className='mb-4'>Tracking Invoice #{invoiceNumber}</h4>
      <ProgressBar className='mb-4'>
        {trackingStatuses.map((status, index) => (
          <ProgressBar
            key={index}
            variant={status.status.toLowerCase() === currentStatus.toLowerCase() ? 'info' : 'light'}
            now={index * (100 / (trackingStatuses.length - 1))}
            label={`${status.status}`}
            style={{
              fontWeight: 'bold',
              padding: '0.5rem',
              backgroundColor: getStatusColor(status.status),
            }}
          />
        ))}
      </ProgressBar>
      <div className='d-flex justify-content-between'>
        {trackingStatuses.map((status, index) => (
          <div key={index} className='text-center'>
            <span style={{ fontSize: '30px', color: 'green' }}>{getStatusIcon(status.status)}</span>
            <p className='mt-2' style={{ fontWeight: 'bold', padding: '0.5rem' }}>{status.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackInvoice;
