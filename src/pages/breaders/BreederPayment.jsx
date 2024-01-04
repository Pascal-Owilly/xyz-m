import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMobile, FaMoneyBill, FaHandHoldingUsd, FaPiggyBank, FaUniversity } from 'react-icons/fa';
import './BreederPayment.css';
import { FaCcPaypal, FaCcAmex, FaCcMastercard, FaCcDiscover } from 'react-icons/fa';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { breaderData } = location.state || {};

  const handlePayment = (bank) => {
    // Placeholder logic for handling payments for different banks
    switch (bank) {
      case 'mpesa':
        // Implement M-pesa payment logic
        console.log('Processing M-pesa payment...');
        break;
      case 'equity':
        // Implement Equity Bank payment logic
        console.log('Processing Equity Bank payment...');
        break;
      case 'cooperative':
        // Implement Cooperative Bank payment logic
        console.log('Processing Cooperative Bank payment...');
        break;
      case 'kcb':
        // Implement KCB Bank payment logic
        console.log('Processing KCB Bank payment...');
        break;
      case 'im':
        // Implement I & M Bank payment logic
        console.log('Processing I & M Bank payment...');
        break;
      default:
        console.error('Unknown bank:', bank);
    }
  };


  return (

    <div className='payment-page-container main-container' style={{backgroundImage: 'linear-gradient(#FFF0A8, #F9B421)', borderRadius:'10px', minHeight:'100vh'}}>



      <div className='p-5' style={{backgroundImage: 'linear-gradient(#FFF0A8, #F9B421)', borderRadius:'10px'}}>

      <h3 className='mb-2' style={{ color: '#111' }}>Total amount: <span style={{ color: 'green' }}> Ksh {breaderData.price}</span></h3>
        <hr />
      {/* <p>Payment to {{breederData.}}</p> */}
        {/* Payment methods */}
        <div className="container">
      <div className="row">
        <div className="col-lg-4 mb-lg-0 mb-3">
          <div className="card p-3">
            <div className="img-box">
              <img
                src="https://www.freepnglogos.com/uploads/visa-logo-download-png-21.png"
                alt=""
              />
            </div>
            <div className="number">
              <label className="fw-bold" htmlFor="">
                **** **** **** 1060
              </label>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <small>
                <span className="fw-bold">Expiry date:</span>
                <span>10/16</span>
              </small>
              <small>
                <span className="fw-bold">Name:</span>
                <span>Kumar</span>
              </small>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-lg-0 mb-3">
          <div className="card p-3">
            <div className="img-box">
              <img
                src="https://www.freepnglogos.com/uploads/mastercard-png/file-mastercard-logo-svg-wikimedia-commons-4.png"
                alt=""
              />
            </div>
            <div className="number">
              <label className="fw-bold">**** **** **** 1060</label>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <small>
                <span className="fw-bold">Expiry date:</span>
                <span>10/16</span>
              </small>
              <small>
                <span className="fw-bold">Name:</span>
                <span>Kumar</span>
              </small>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-lg-0 mb-3">
          <div className="card p-3">
            <div className="img-box">
              <img
                src="https://www.freepnglogos.com/uploads/discover-png-logo/credit-cards-discover-png-logo-4.png"
                alt=""
              />
            </div>
            <div className="number">
              <label className="fw-bold">**** **** **** 1060</label>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <small>
                <span className="fw-bold">Expiry date:</span>
                <span>10/16</span>
              </small>
              <small>
                <span className="fw-bold">Name:</span>
                <span>Kumar</span>
              </small>
            </div>
          </div>

          
        </div>

        
        
        
        
      </div>
    </div>
       
      </div>
    </div>
  );
};

export default PaymentPage;
