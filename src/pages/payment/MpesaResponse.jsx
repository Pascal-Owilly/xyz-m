import React from 'react';

const PaymentResponsePage = ({ paymentResponse }) => {
  return (
    <div className='main-container' style={{height:"100vh",  background:'rgb(249, 250, 251)'}}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-1'></div>
          <div className='col-md-6' style={{marginTop:'7vh'}}>

          <div style={{ display:'flex', alignItems:'center', flexDirection:'column', height:'20vh'}}>
      {/* <h2 className='text-center' style={{color:'#999999',fontWeight:'800',margintTop:'14vh'}}>{paymentResponse.data.response.ResponseDescription}</h2> */}
      <h3>Reuest accepted for processing</h3>
      <br />
      <p>Enter pin to confirm payment upon reception of a push notification</p>
      <br />
      <h4 className='text-secondary'>Thank you!</h4>
      {/* <p>Customer Message: {paymentResponse.data.msg}</p> */}
      {/* <p>Your Id is {paymentResponse.data.response.MerchantRequestID}</p>
      <p>Merchant Request ID: {paymentResponse.data.response.MerchantRequestID}</p> */}
      <br />
      <a href='/'> Return to home page </a>
    </div>

          </div>

          <div className='col-md-3'></div>

        </div>
      </div>


    </div>
  );
};

export default PaymentResponsePage;