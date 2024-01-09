import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMobile, FaMoneyBill, FaHandHoldingUsd, FaPiggyBank, FaUniversity } from 'react-icons/fa';
import './BreederPayment.css';
import { FaCcPaypal, FaCcAmex, FaCcMastercard, FaCcDiscover } from 'react-icons/fa';
import { BASE_URL } from '../auth/config';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { breaderData } = location.state || {};
  const baseUrl = BASE_URL;

  const [paymentStatus, setPaymentStatus] = useState(null);

  

  return (
    <div className='main-container' style={{minHeight:'85vh' }}>

 
    <div className=' d-flex justify-content-center align-items-center' style={{minHeight:'5vh' }}>
    <div className='main-content' style={{ fontFamily: 'Arial, sans-serif', background: 'linear-gradient(#FFF, #f8f8f8)', borderRadius: '10px', padding: '20px', maxWidth: '500px'}}>
        <h4 className='text-primary mt-1 mb-3 text-center'>Payment initiated successfully</h4>
        <hr />
        <div className='payment-details-card' style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
            {/* Add your payment details here */}
        </div>
        <div className='text mx-3 text-center'>
            <p className='text-success'>Your payment has been successfully initiated. You will receive a confirmation once the processing is complete.</p>
        </div>

    </div> 
</div>

</div>
  );
};

export default PaymentPage;
