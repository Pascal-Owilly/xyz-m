import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';
function QuotationForm() {
  const navigate = useNavigate();
  const baseUrl = BASE_URL;
  const accessToken = Cookies.get('accessToken');
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [profile, setProfile] = useState([]);
  const [defaultSellerId, setDefaultSellerId] = useState(null);

  const [formData, setFormData] = useState({
    seller: null, // Initialize seller as null
    buyer: null,
    product: '',
    quantity: '',
    unit_price: '',
    market:  '',
    message: '',
    delivery_time: null,
  });

  const [formDataSeller, setFormDataSeller] = useState({
    full_name: '',
    id: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = Cookies.get('accessToken');
        if(!accessToken){
          navigate('/')
        }
        if (accessToken) {
          const response = await axios.get(`${baseUrl}/auth/user/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const userProfile = response.data;
          setProfile(userProfile);
        }
      } catch (error) {
        // Check if the error indicates an expired access token
        if (error.response && error.response.status === 401) {
          // Attempt to refresh the access token
          await refreshAccessToken();
        } else {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [baseUrl, navigate]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/sellers/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('sellers', response.data)
        setSellers(response.data);
  
        // Set the default seller if profile is available
        if (profile) {
          const loggedInSeller = response.data.find(seller => seller.id === profile.id);
          if (loggedInSeller) {
            setFormData(prevFormData => ({
              ...prevFormData,
              seller: loggedInSeller.id, // Set the ID of the logged-in seller
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching sellers:', error);
      }
    };
  
    fetchSellers();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, accessToken, profile]);
  
  

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/buyers/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBuyers(response.data);
      } catch (error) {
        console.error('Error fetching buyers:', error);
      }
    };

    fetchBuyers();
  }, [baseUrl, accessToken]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    handleSellerChange();
  }, [sellers]);
  

  const handleSellerChange = () => {
    // Check if there are sellers available
    if (sellers.length > 0) {
      // Set the seller ID to the ID of the first seller
      setFormData(prevFormData => ({
        ...prevFormData,
        seller: sellers[0].id,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postData();
      toast.success(<div>Quotation submitted successfully!<br /> <br />Redirecting ...</div>, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      // Redirect to the quotations list after 3 seconds
      setTimeout(() => {
        navigate('/quotation-submission-success');
      }, 3000);
    } catch (error) {
      toast.error('Failed to submit quotation. Please try again later.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  
  const postData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      await axios.post(`${baseUrl}/api/send-quotation/`, formData, config);
    } catch (error) {
      console.error('Error creating quotation:', error);
      throw error;
    }
  };

  const handleIconClick = () => {
    const input = document.getElementById('delivery_time');
    if (input) {
      input.focus();
    }
  };

  return (
    <div className=" main-container text-secondary">
      <div className='col-md-8 p-5' style={{background:'#001b42',color:'white'}}>
        <h5 className=' text-center p-3' style={{color:'#fff'}}>Product Quotation Form</h5>
        <hr />
        <form onSubmit={handleSubmit} className=''>
          <div className="row">
            <div className="col-md-6 mb-3" style={{background:'transparent'}}>
              <label htmlFor="buyer" className="form-label">
                Select buyer
              </label>
              <div>
                <select
                  className="form-select text-dark p-2 bg-light "
                  style={{ borderRadius: '', width: '100%', border: '1px solid #999999', opacity: 0.5 }}
                  id="buyer"
                  name="buyer"
                  value={formData.buyer}
                  onChange={handleChange}
                  required
                >
                  <option className='bg-light p-3 text-dark' value="">Select Buyer</option>
                  {buyers.map((buyer) => (
                    <option className='bg-light p-2' key={buyer.id} value={buyer.id}>
                      {buyer.full_name}
                    </option>
                  ))}
                </select>
                <small className="text-primary">
                  <a href="/register-buyer" className="text" style={{color:'#001b42', fontWeight:'500', textDecoration:'underline'}}>Register new buyer</a>
                </small>
              </div>
              
            </div>
            <div className="col-md-6 mb-3" style={{display:'none'}}>
                <label htmlFor="seller" className="form-label">
                  To Seller
                </label>
                <div>
                {formData.seller ? (
                    <p>{formData.seller.full_name}</p>
                  ) : (
                    <select
                    style={{ border: 'none', backgroundColor: 'rgb(238, 240, 251)', color: '#666666' }}
                    className="form-control"
                    id="seller"
                    name="seller"
                    required
                    value={formData.seller ? formData.seller.id : sellers.length > 0 ? sellers[0].id : ''}
                    onChange={handleSellerChange}
                    disabled={!!formData.seller}
                  >
                    {sellers.map((seller) => (
                      <option key={seller.id} value={seller.id}>{seller.full_name}</option>
                    ))}
                  </select>
                  
                  )}

                </div>
              </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="product" className="form-label">Product Name</label>
              <input type="text" className="form-control" id="product" name="product" value={formData.product} onChange={handleChange} placeholder='Eg Goat, sheep etc' required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="unit_price" className="form-label">Price/Kg</label>
              <input type="number" className="form-control" id="unit_price" name="unit_price" value={formData.unit_price} onChange={handleChange} min="0" step="0.01" placeholder='Enter price per kg' required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="quantity" className="form-label">Quantity</label>
              <input type="number" className="form-control" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} min="1" placeholder='Eg 500, 30, etc' required />
            </div>
          </div>
          <div className="row">

          <div className="col-md-6 mb-3" style={{ position: 'relative' }}>
            <label htmlFor="delivery_time" className="form-label">Delivery Date</label>
            <input 
              type="date" 
              className="form-control " 
              id="delivery_time" 
              name="delivery_time" 
              value={formData.delivery_time} 
              onChange={handleChange} 
              min="1" 
              required 
              style={{ paddingRight: '10px', fontSize:'', color:'#666666' }} // Add some padding to make room for the icon
            />
            {/* <span className="custom-calendar-icon" style={{ color: 'green', position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}>📅</span> */}
          </div>


          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label"> Message</label>
            <textarea className="form-control" id="message" placeholder='Eg Supply of goats, etc' name="message" value={formData.message} onChange={handleChange} rows="4"></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="market" className="form-label">Market to collect from (Not vissible to buyer)</label>
            <input className="form-control" placeholder='Enter market to inform your suppliers where you will be collecting from' id="market" name="market" value={formData.market} onChange={handleChange} ></input>
          </div>
          <button type="button" className="btn btn-primary mb-2" style={{fontSize:'15px'}} onClick={handleSubmit}>Send Quotation as PDF</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default QuotationForm;
