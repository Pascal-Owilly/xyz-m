import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '85vh' }}>
      <FaCheckCircle style={{ fontSize: '64px', color: '#28a745' }} />
      <h3 className='mt-3'>Quotation Confirmed Successfully!</h3>
      <p>It's time to send the Letter of Credit (LC) to the bank.</p>
      <p>The supply process will begin once the bank and the seller confirms the information </p>
      <p>Thank you!</p>
      <Link to="/buyer_dashboard" style={{ marginTop: '20px', color: '#007bff', textDecoration: 'none' }}>Back to Home</Link>
    </div>
  );
}

export default SuccessPage;
