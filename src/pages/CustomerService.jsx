import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import { Card, Button, Table } from 'react-bootstrap';

const CustomerServiceDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const baseUrl = BASE_URL;

  useEffect(() => {
    // Fetch payments from the new endpoint
    axios.get(`${baseUrl}/api/payments-list/`)
      .then(response => {
        console.log('Fetched payments:', response.data);
        setPayments(response.data);
      })
      .catch(error => console.error('Error fetching payments:', error));
  }, []);

  const handleUpdateStatus = (paymentId, newStatus) => {
    // Ensure paymentId is valid
    if (!paymentId) {
      console.error('Invalid paymentId:', paymentId);
      return;
    }

    // Update the payment status
    axios.put(`${baseUrl}/api/payments-list/${paymentId}/`, { status: newStatus })
      .then(response => {
        // Update the local state with the updated payment
        setPayments(payments.map(payment => (payment.payments_id === paymentId ? response.data : payment)));
      })
      .catch(error => console.error('Error updating payment status:', error));
  };

  const handleViewDetails = (payment) => {
    // Toggle the detailed view
    setShowDetails(!showDetails);
    // Set the selected payment for detailed view
    setSelectedPayment(payment);
  };

  const renderBreederTradeTable = (breederTrade) => {
    return (
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(breederTrade).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div className='main-container container' style={{ minHeight: '85vh' }}>
      <h4 className='mb-4'>Customer Service Dashboard</h4>
      <Card>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Payment Code</th>
                <th>Status</th>
                <th>Action</th>
                {/* Add more columns as needed */}
              </tr>
            </thead>
            <tbody>
              {payments && payments.map(payment => (
                <tr key={payment.payments_id}>
                  <td>{payment.payment_code}</td>
                  <td>{payment.status}</td>
                  <td>
                    <div className='d-flex align-items-center'>
                      <select className='form-select me-3 p-1' style={{borderRadius:'30px', background:'rgb(247, 248, 251)', color:'black', border:'none'}} onChange={(e) => handleUpdateStatus(payment.payments_id, e.target.value)}>
                        <option value="payment_initiated" selected={payment.status === 'payment_initiated'}>Sent to Bank</option>
                        <option value="disbursed" selected={payment.status === 'disbursed'}>Disbursed</option>
                        <option value="paid" selected={payment.status === 'paid'}>Paid</option>
                      </select>
                      <Button variant='success text-light' className='btn-sm m-auto' style={{width:'30%', color:'rgb(0, 27, 49)', fontSize:'14px'}} onClick={() => handleUpdateStatus(payment.payments_id, payment.status)}>
                        Update Status
                      </Button>
                      <Button variant='info' className='btn-sm m-auto ms-2' style={{width:'30%', fontSize:'14px'}} onClick={() => handleViewDetails(payment)}>
                        {showDetails ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>
                  </td>
                  {/* Add more columns as needed */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Detailed View */}
      {selectedPayment && showDetails && (
        <Card className='mt-3'>
          <Card.Body>
            <h5>Details for Payment Code: {selectedPayment.payment_code}</h5>
            {renderBreederTradeTable(selectedPayment.breeder_trade)}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CustomerServiceDashboard;
