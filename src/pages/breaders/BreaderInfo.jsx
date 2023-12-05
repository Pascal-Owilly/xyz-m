// BreaderInfo.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../auth/config';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Breader.css';
import { Modal } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BreaderInfo = () => {
  const navigate = useNavigate()
  const baseUrl = BASE_URL;
  const { breaderId } = useParams();
  const [breaderData, setBreaderData] = useState({});
  const [loading, setLoading] = useState(true);
  const authToken = Cookies.get('authToken');
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const renderPaymentModal = () => (
    <>
    <div className='p-5' style={{backgroundImage: 'linear-gradient(#FFF0A8, #F9B421)', borderRadius:'10px'}}>
    <button className='btn btn-sm btn-outline-danger mb-2' onClick={closeModal} style={{float:'right'}}><FaTimes /></button>

    <h5 className='mb-2' style={{color:'#999999'}}>Total amount: Ksh {breaderData.price}</h5>
    <hr />
    <button
      className='mt-3 text-center mx-3'
      style={{ backgroundColor: 'transparent', color: '#121661', padding: '5px',  borderRadius: '0' }}
      // onClick={handlePaymentPaypal}
    >
    </button>

    <button
  className='mb-3 mx-3'
  style={{
    // Add your M-pesa button styles here
    // For example:
    backgroundColor: '#0070BA',
    color: '#FFFFFF',
    padding: '10px 20px',
    borderRadius: '5px',
    // Add more styles as needed
  }}
  onClick={(e) => handlePaymentMpesa(e)} // Pass the event object explicitly
  >
  Pay with M-pesa
</button>

<button style={{ 
    // Add your PayPal button styles here
    // For example:
    backgroundColor: '#003087',
    color: '#FFFFFF',
    padding: '10px 30px',
    borderRadius: '5px',
    // Add more styles as needed
  }} className="paypal-button mx-2">
  <span style={{ 
      // paypalButtonTitleStyle
    }} className="paypal-button-title">
  </span>
  <span style={{ 
      // Add your PayPal logo styles here
      // For example:
      fontSize: '18px',
      // Add more styles as needed
    }} className="paypal-logo mx-1">
    <i style={{}}>Pay</i>
    <i style={{}}>Pal</i>
  </span>
</button>

        
              {/* KCB Bank Button */}
     {/* KCB Bank Button */}
<button className='mt-3' onClick={handleKCBPayment} style={{ 
    // Add your KCB Bank button styles here
    // For example:
    backgroundColor: '#1C2340',
    color: '#FFFFFF',
    padding: '15px 10px',
    borderRadius: '8px',
    // Add more styles as needed
  }}>
  <span style={{ 
      // Add your KCB Bank button title styles here
      // For example:
      fontSize: '18px',
      fontWeight: 'bold',
      // Add more styles as needed
    }}>Pay with KCB Bank</span>

</button>

{/* I & M Bank Button */}
<button className='mt-2 mx-4' onClick={handleIMPayment} style={{ 
    // Add your I & M Bank button styles here
    // For example:
    backgroundColor: '#0091EA',
    color: '#FFFFFF',
    padding: '15px 10px',
    borderRadius: '8px',
    // Add more styles as needed
  }}>
  <span style={{ 
      // Add your I & M Bank button title styles here
      // For example:
      fontSize: '18px',
      fontWeight: 'bold',
      // Add more styles as needed
    }}> I & M Bank</span>

</button>

{/* Cooperative Bank Button */}
<button className='mt-3' onClick={handleCooperativePayment} style={{ 
    // Add your Cooperative Bank button styles here
    // For example:
    backgroundColor: '#008D4C',
    color: '#FFFFFF',
    padding: '15px 30px',
    borderRadius: '8px',
    // Add more styles as needed
  }}>
  <span style={{ 
      // Add your Cooperative Bank button title styles here
      // For example:
      fontSize: '18px',
      fontWeight: 'bold',
      // Add more styles as needed
    }}>Cooperative Bank</span>
  
</button>

    </div>
  </>
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/auth/user/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        const userData = response.data;
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [authToken]);

  const handlePaymentMpesa = async (e) => {
    try {
        e.preventDefault();

        const user_id = user ? user.pk : null;
        const mpesaEndpoint = `${baseUrl}/mpesa-payment/`;

        const mpesaData = {
            breader_trade_id: breaderId,
            user_id: user_id,
        };

        console.log('Mpesa Data:', mpesaData);
        console.log('Breader Data:', breaderData);

        const response = await axios.post(mpesaEndpoint, mpesaData, {
            headers: {
                Authorization: `Token ${authToken}`,
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });

        console.log('M-Pesa API Response:', response);

        const paymentUrl = response.data.payment_url;
        console.log('Payment response:', response);

        if (!paymentUrl) {
            console.error('Payment URL not found in response:', response);
        } else {
            const callbackUrl = response.data.response.CheckoutRequestID;
            console.log('Callback URL:', callbackUrl);

            // Introduce a 3-second delay using setTimeout
            setTimeout(() => {
                // Redirect the user to the M-Pesa payment page after the delay
                navigate('/mpesa-payment-response');
            }, 3000);
        }
    } catch (error) {
        console.error('Oops! M-Pesa payment did not work:', error);
        setTimeout(() => {
          // Redirect the user to the M-Pesa payment page after the delay
          navigate('/mpesa-payment-response');
      }, 3000);
        // Handle any errors that may occur during the M-Pesa payment process
    }
};

  
  
  const handlePaypalPayment = () => {
    // Implement PayPal payment logic
  };

  const handleEquityPayment = () => {
    // Implement Equity Bank payment logic
  };

  const handleCooperativePayment = () => {
    // Implement Cooperative Bank payment logic
  };

  const handleKCBPayment = () => {
    // Implement KCB Bank payment logic
  };

  const handleIMPayment = () => {
    // Implement I & M Bank payment logic
  };

  useEffect(() => {
    const fetchData = async () => {
       try {
          const response = await axios.get(`${baseUrl}/api/breader-trade/${breaderId}/`, {
             headers: {
                Authorization: `Token ${authToken}`,
             },
          });

          setBreaderData(response.data);
       } catch (error) {
          console.error('Error fetching data:', error);
       } finally {
          setLoading(false);
       }
    };

    if (breaderId) {
       fetchData();
    }
 }, [authToken, breaderId]);


  // Format the transaction date
  const formattedTransactionDate = new Date(breaderData.transaction_date).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const boxStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  };

  const paypalLogoStyle = {
    fontFamily: 'Verdana, Tahoma',
    fontWeight: 'bold',
    fontSize: '26px',
  };

  const firstChildStyle = {
    color: '#253b80',
  };

  const lastChildStyle = {
    color: '#179bd7',
  };

  const paypalButtonStyle = {
    padding: '10px 10px',
    border: '1px solid #FF9933',
    borderRadius: '5px',
    backgroundImage: 'linear-gradient(#FFF0A8, #F9B421)',
    margin: '0 auto',
    display: 'inline',
    width: '100%',
    position: 'relative',
    alignItems:'center',
    marginLeft:'1rem',
  };

  const mpesaButtonStyle = {

    fontSize: '16px',
    color: '#505050',
    verticalAlign: 'baseline',
    textShadow: '0px 1px 0px rgba(255, 255, 255, 0.6)',

    // padding: '10px 10px',
    border: 'none',
    borderRadius: '5px',
    backgroundImage: 'linear-gradient(#FFF0A8, #F9B421)',
    margin: '0 auto',
    display: 'inline',
    // width: '100%',
    position: 'relative',
    alignItems:'center',
    
  };

  const paypalButtonTitleStyle = {
    fontSize: '14px',
    color: '#505050',
    verticalAlign: 'baseline',
    textShadow: '0px 1px 0px rgba(255, 255, 255, 0.6)',
  };

  const paypalLogoInlineStyle = {
    display: 'inline-block',
    textShadow: '0px 1px 0px rgba(255, 255, 255, 0.6)',
    fontSize: '20px',
  };

  return (
    <div className='main-container'>
      <div className='container-fluid' style={{minHeight:'72vh'}}>
    <div className='row mt-2'>
      {/* <div className='col-md-1'></div> */}
      <div className="col-md-12">
      <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2>Payment status &nbsp;
                  <span className='' style={{float: 'right', backgroundColor: breaderData.isPaid ? 'green' : 'blue', color:'white', padding:'5px', borderRadius:'30px', fontSize:'11px', fontWeight:'800', width:'auto' }}>
                   <span className='mx-2'>
                   {breaderData.is_paid ? 'Paid': 'Pending'}
                   </span>
                   </span>
                   </h2>
                   
                <button
                  className='mb-2'
                  style={{ backgroundColor: 'goldenrod', borderRadius: '30px', fontSize:'14px' }}
                  onClick={openModal}
                >
                  Make Payment to {breaderData.head_of_family}'s family
                </button>
              </div>
          <div>


        {/* Add the modal component */}
        <Modal style={{marginTop:'10vh', backgroundColor:''}} show={isModalOpen} onHide={closeModal}>
                    {renderPaymentModal()}
                  </Modal>
     
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Bread Name</th>
                  <th>Breads Supplied</th>
                  <th>Bread Weight</th>
                  <th>Date Supplied</th>
                  <th>Price</th>
                  <th>Phone Number</th>
                  <th>Market</th>
                  <th>Community</th>
                  <th>Vaccinated</th>
                  <th>Head of Family</th>
                </tr>
              </thead>
              <tbody style={{ background: 'white' }}>
                <tr>
                  <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.animal_name}</td>
                  <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.breads_supplied}</td>
                  <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.goat_weight} Kg</td>
                  <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{formattedTransactionDate}</td>
                  <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.price}</td>
                  <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.phone_number}</td>
                  <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.community}</td>
                  <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.market}</td>
                  <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.vaccinated ? 'Yes' : 'No'}</td>
                  <td style={{ border: '1px dotted black', padding: '15px', textTransform:'capitalize'}}>{breaderData.head_of_family}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <div className='col-md-1'></div> */}
    </div>
    </div>
  </div>
  
  );
};

export default BreaderInfo;
