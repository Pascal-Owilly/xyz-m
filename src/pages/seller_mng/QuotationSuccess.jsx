import React from 'react';
import { FaEnvelope, FaHeart } from 'react-icons/fa';

const SuccessMessage = () => {
  return (
    <div className='main-container' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backgroundColor: '#F0F5FF', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', minHeight:'80vh' }}>
      <div style={{ fontSize: '30px', color: '#5C6AC4' }}><FaEnvelope /></div>
      <div style={{ marginLeft: '20px' }}>
        <h2 style={{color:'#666666'}}>Quotation Submitted Successfully!</h2>
        <p style={{ fontSize: '18px', color: '#333' }}>Keep an eye on your email, you'll be notified when the buyer confirms it.</p>
        <p style={{ fontSize: '24px', color: '#FF006E', marginTop: '10px' }}><FaHeart /></p>
      </div>
    </div>
  );
};

export default SuccessMessage;
