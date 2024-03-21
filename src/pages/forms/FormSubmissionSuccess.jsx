import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '85vh' }}>
      <FaCheckCircle style={{ fontSize: '64px', color: '#28a745' }} />
      <h3 className='mt-3'>Form submitted successfully!</h3>
      <p>Click
        
      <a href='/breeder_invoices' style={{color:'#001b42', fontWeight:'bold'}} >
         <span > here </span>
      </a> 
      
        to submit another
      </p>
      <p>Thank you!</p>
      <Link to="/supplier_dashboard" >
        Return to Your Dashboard
      </Link> 
         </div>
  );
}

export default SuccessPage;
