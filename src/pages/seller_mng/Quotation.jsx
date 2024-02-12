import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../auth/config';
import jsPDF from 'jspdf';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function QuotationForm() {

    const navigate =useNavigate()

  const baseUrl = BASE_URL;
  const [profile, setProfile] = useState([]);
  // const [user, setUser] = useState(null);

  const accessToken = Cookies.get('accessToken');
  const [user, setUser] = useState(null); // Initialize with null or an empty object
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] = useState(false);
  const [isSettingsDropdownVisible, setIsSettingsDropdownVisible] = useState(false);
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isDashboardsVisible, setIsDashboardsVisible] = useState(true);
  const [isNotificationPanelVisible, setIsNotificationPanelVisible] = useState(false);

  const [defaultBackgroundColor, setDefaultBackgroundColor] = useState('#ffffff');
  const [defaultTextColor, setDefaultTextColor] = useState('#000000');
  const [userRole, setUserRole] = useState('loading'); // Initialize with 'loading'
  const [buyers, setBuyers] = useState([]);

  const refreshAccessToken = async () => {
    try {
      console.log('fetching token refresh ... ')

      const refreshToken = Cookies.get('refreshToken'); // Replace with your actual cookie name
  
      const response = await axios.post(`${baseUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      });
  
      const newAccessToken = response.data.access;
      // Update the stored access token
      Cookies.set('accessToken', newAccessToken);
      // Optional: You can also update the user data using the new access token
      await fetchUserData();
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // Handle the error, e.g., redirect to login page
    }
  };
  

  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
     
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


  const [formData, setFormData] = useState({
    buyer: null,
    product: '',
    quantity: '',
    unit_price: '',
    message: '',
    confirm: '',
    delivery_time: null,

    

});

useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch the access token from wherever it is stored (e.g., localStorage)
      const accessToken = Cookies.get('accessToken');

      // Include the access token in the request headers
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Make the GET request with the access token included in the headers
      const getResponse = await axios.get(`${baseUrl}/api/send-quotation/`, config);
      console.error('Quotation fetched successfully', getResponse);
    } catch (error) {
      console.error('Error fetching quotation:', error);
    }
  };

  const postData = async () => {
    try {
      // Fetch the access token from wherever it is stored (e.g., localStorage)
      const accessToken = Cookies.get('accessToken');

      // Include the access token in the request headers
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Data to be sent in the POST request
      const postData = {
        buyer: formData.buyer,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        delivery_time: null,
        product: formData.product,
        quantity: formData.quantity,
        unit_price: formData.unit_price,
        message: formData.message,
        seller_address: formData.seller_address,
        seller_country: formData.seller_country,
        seller_company: formData.seller_company,
      };

      // Make the POST request with the access token included in the headers
      const postResponse = await axios.post(`${baseUrl}/api/send-quotation/`, postData, config);
      console.log('success', postResponse);
// Navigate back to the desired page

} catch (error) {
      console.error('Error creating quotation:', error);
    }
  };

  fetchData(); // Call the function to fetch data
  postData(); // Call the function to send data
}, [baseUrl, formData]); // Include baseUrl and formData as dependencies to trigger the effect when they change


const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
};

useEffect(() => {
  const fetchBuyers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/buyers/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setBuyers(response.data);
      console.log('Buyers:', response);

    } catch (error) {
      console.error('Error fetching buyers:', error);
    }
  };

  fetchBuyers();
}, [baseUrl, accessToken]);
  
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
      // Submit the form data
      await postData();
      // Show success message
      toast.success('Quotation submitted successfully!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });
  } catch (error) {
      // Show error message
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
      // Include the access token in the request headers
      const config = {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      };

      // Data to be sent in the POST request
      const postData = {
          buyer: formData.buyer,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          delivery_time: null,
          product: formData.product,
          quantity: formData.quantity,
          unit_price: formData.unit_price,
          message: formData.message,
          seller_address: formData.seller_address,
          seller_country: formData.seller_country,
          seller_company: formData.seller_company,
      };

      // Make the POST request with the access token included in the headers
      const postResponse = await axios.post(`${baseUrl}/api/send-quotation/`, postData, config);
      console.error('Quotation created successfully', postResponse);
  } catch (error) {
      console.error('Error creating quotation:', error);
      throw error; // Re-throw the error to be caught by the caller (handleSubmit)
  }
};

    const generatePDF = () => {
      const doc = new jsPDF();
      const { buyer, product, unitPrice, quantity, confirm } = formData;
      const content = `
        Buyer: ${buyer}
        Product Name: ${product}
        Unit Price: ${unitPrice}
        Quantity: ${quantity}
        Confirm: [ ] Yes, I confirm this quotation
      `;
      doc.text(content, 10, 10);
    
      // Add checkbox for confirmation
      doc.setDrawColor(0); // Black color
      doc.rect(22, 55, 5, 5); // Draw the checkbox
      doc.setFontSize(12);
      doc.text("Yes, I confirm this quotation", 30, 60); // Add label next to the checkbox
    
      // Check if PDF was generated successfully
      if (doc) {
        return doc;
      } else {
        console.error('Error generating PDF');
        return null;
      }
    };
    
    const handleDownload = () => {
      const pdf = generatePDF();
      pdf.save('quotation.pdf');
    };
  
    const handleSend = () => {
      const pdf = generatePDF();
      const pdfDataUri = pdf.output('datauristring');
      // Send the PDF to the buyer via email or any other method
      console.log('Sending PDF:', pdfDataUri);
    };

    const handleConfirmationByBuyer = async () => {
      try {
        const response = await axios.put(`${baseUrl}/api/send-quotation/${quotation.id}/`, {
          confirm: '',
        });
        // Handle successful confirmation (e.g., display a success message)
      } catch (error) {
        console.error('Error confirming quotation:', error);
        // Handle error (e.g., display an error message)
      }
    };

    return (
        <div className=" main-container text-secondary">

            <div className='col-md-8 p-5' style={{background:'rgb(249, 250, 251)'}}>
            <h5 className=' text-center p-3' style={{color:'#666666'}}>Product Quotation Form</h5>
<hr />
            <form onSubmit={handleSubmit}>
                <div className="row">
                <div className="col-md-6 mb-3">
  <label htmlFor="buyer" className="form-label">
    Buyer
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
    {/* Conditionally render the link to register a new buyer */}
      <small className="text-primary">
        <a href="/register-buyer" className="text-primary">Register new buyer</a>
      </small>
  </div>
</div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="product" className="form-label">Product Name</label>
                        <input type="text" className="form-control" id="product" name="product" value={formData.product} onChange={handleChange} required />
                    </div>
                </div>
                <div className="row">
                    
                    
                    <div className="col-md-6 mb-3">
                        <label htmlFor="unit_price" className="form-label">Unit Price</label>
                        <input type="number" className="form-control" id="unit_price" name="unit_price" value={formData.unit_price} onChange={handleChange} min="0" step="0.01" required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="quantity" className="form-label">Quantity</label>
                        <input type="number" className="form-control" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="delivery_time" className="form-label">Delivery Date</label>
                        <input type="date" className="form-control" id="delivery_time" name="delivery_time" value={formData.delivery_time} onChange={handleChange} min="1" required />
                    </div>
                </div>
                {/* <div className="mb-3 form-check">
                <select className="form-select" id="confirm" name="confirm" value={formData.confirm} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="accept">Accept</option>
                      <option value="reject">Reject</option>
                      <option value="review">Review</option>
                  </select>
                    <label className="form-check-label" htmlFor="confirm">Confirm</label>
                </div> */}
               
                <div className="mb-3">
                    <label htmlFor="message" className="form-label">Additional Message</label>
                    <textarea className="form-control" id="message" name="message" value={formData.message} onChange={handleChange} rows="4"></textarea>
                </div>
                <button type="submit" onClick={handleSubmit} className="btn btn-primary mb-2" style={{fontSize:'15px'}}>Request Quotation</button>
            </form>
        </div>
        <ToastContainer />

        </div>
    );
}

export default QuotationForm;
