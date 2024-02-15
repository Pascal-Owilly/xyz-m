// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container, Form, Button, ProgressBar, Navbar, Nav, NavDropdown, NavLink, FormGroup, FormLabel, InputGroup } from 'react-bootstrap';
import { FaTruck } from 'react-icons/fa'; // Assuming you're using react-icons for the truck icon
import { BASE_URL } from '../auth/config';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Seller.css';

import { FaFileInvoice, FaList, FaMoneyBillAlt, FaWarehouse, FaArchive } from 'react-icons/fa'; // Import the desired icons
import { checkUserRole } from '../auth/CheckUserRoleUtils'; 
import ReactApexChart from 'react-apexcharts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PurchaseOrderSeller from './PurchaseOrdersSeller';
import Quotation from './Quotation';

const BankDashboard = ({ orderId }) => {


  // ADMIN DASHBOARD
  const baseUrl = BASE_URL;

  const [userRole, setUserRole] = useState('');
  const [breadersCount, setBreadersCount] = useState(0);
  const [supplyVsDemandData, setSupplyVsDemandData] = useState([]);
  const [totalBuyers, setTotalBuyers] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [user, setUser] = useState(null);
  const [remainingBreeds, setRemainingBreeds] = useState([]);
  const [buyers, setBuyers] = useState([]);

    // admin vars
    const [activeSection, setActiveSection] = useState('Negotiations');

    const [paymentCode, setPaymentCode] = useState('');
    const [paymentData, setPaymentData] = useState(null);
    const [error, setError] = useState(null);
    const accessToken = Cookies.get('accessToken');
  
    const [selectedBreeder, setSelectedBreeder] = useState('');
    const [showForm, setShowForm] = useState(false);
  
    // LC
    const [lcId, setLcId] = useState(null);
    const [lcDocument, setLcDocument] = useState(null);
    const [lcUploadError, setLcUploadError] = useState(null);
    const [profile, setProfile] = useState(null)
    const [userProfile, setUserProfile] = useState(null);
    const [arrivedOrdersData, setArrivedOrdersData] = useState([]);
    const [shipmentProgressData, setShipmentProgressData] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [logisticsStatuses, setLogisticsStatuses] = useState([]);
    const [orders, setOrders] = useState([]);
  
    const [lcUploadSuccess, setLcUploadSuccess] = useState(false);
    const [lcUploadMessage, setLcUploadMessage] = useState('');
    // end admin vrs

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/supply-vs-demand/`);
        setSupplyVsDemandData(response.data.supply_vs_demand_data);
      } catch (error) {
        console.error('Error fetching supply vs demand data:', error);
      }
    };

    fetchData();
  }, [baseUrl]);  

  

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
        const response = await axios.get(`${baseUrl}/api/send-quotation/`, config);
        console.error('Quotation created successfully');
      } catch (error) {
        console.error('Error fetching creating quotation:', error);
      }
    };
  
    fetchData();
  }, [baseUrl]);
  

  const chartData = {
    options: {
      chart: {
        type: 'bar',
      },
      xaxis: {
        categories: supplyVsDemandData.map(item => item.breed),
      },
    },
    series: [
      {
        name: 'Total Bred',
        data: supplyVsDemandData.map(item => item.total_bred),
      },
      {
        name: 'Total Slaughtered',
        data: supplyVsDemandData.map(item => item.total_slaughtered),
      },
    ],
  };

  useEffect(() => {
    const calculateRemainingBreeds = () => {
      // Assuming supplyVsDemandData is an array of objects with breed, total_bred, and total_slaughtered properties
      const remainingBreedsData = supplyVsDemandData.map((item) => {
        const remainingCount = Math.max(0, item.total_bred - item.total_slaughtered);
        return {
          breed: item.breed,
          remainingCount,
        };
      });

      setRemainingBreeds(remainingBreedsData);
    };

    calculateRemainingBreeds();
  }, [supplyVsDemandData]);

  const remainingBreedsChartData = {
    options: {
      chart: {
        type: 'radialBar',
        background: '', // Set background to transparent
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
          },
          dataLabels: {
            name: {
              fontSize: '16px',

            },
            value: {
              fontSize: '30px',
            },
          },
        },
      },
      labels: remainingBreeds.map((item) => item.breed),
    },
    series: remainingBreeds.map((item) => item.remainingCount),
  };

   // New state for breed supply status
   const [breedSupplyStatus, setBreedSupplyStatus] = useState('');
   
   useEffect(() => {
    const calculateBreedSupplyStatus = () => {
      const totalRemaining = remainingBreeds.reduce((acc, item) => acc + item.remainingCount, 0);

      if (totalRemaining > 0) {
        setBreedSupplyStatus(`You have a total of ${totalRemaining} raw materials in the store.`);
      } else if (totalRemaining < 0) {
        setBreedSupplyStatus(`Heads up, you are completely out of breeds.`);
      } else {
        setBreedSupplyStatus(`The inventory level seems empty.`);
      }
    };

    calculateBreedSupplyStatus();
  }, [remainingBreeds]);

  const circularBarChartData = {
    options: {
      chart: {
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 80,
          hollow: {
            margin: 0,
            size: '30%',
            background: '#20283e',
          },
          track: {
            background: '#d32d41',
            strokeWidth: '20%',
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: false,
              top: 2,
              left: 0,
              color: '#999',
              opacity: 1,
              blur: 2,
            },
          },
          dataLabels: {
            name: {
              offsetY: -10,
              show: true,
              color: '#888',
              fontSize: '17px',
            },
            value: {
              color: '#111',
              fontSize: '36px',
              show: true,
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#4cb5f5'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        dashArray: 1,
      },
    },
   
  };
  

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const role = await checkUserRole();
  //     setUserRole(role);
  
  //     if (role !== 'superuser' && role !== 'admin') {
  //       navigate('/unauthorized');
  //     }
  //   };
  
  //   checkUser();
  // }, [navigate]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/breader-count/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setBreadersCount(data.breader_count);
        console.log('breeder count', data)
      } catch (error) {
        console.error('Error fetching breaders count:', error);
      }
    };

    fetchData();
  }, [baseUrl, accessToken]);

  
  useEffect(() => {
    // Fetch data from Django API endpoint
    fetch(`${baseUrl}/api/breader-count/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setBreadersCount(data.breader_count);

      })
      .catch(error => console.error('Error fetching breaders count:', error));
  }, []);


  // END ADMIN


  // START PO
  const [formData, setFormData] = useState({
    seller: '',
    po_number: '',
    date: '',
    trader_name: '',
    buyer_address: '',
    buyer_contact: '',
    seller_address: '',
    seller_contact: '',
    shipping_address: '',
    confirmed: false,
    product_description: '',
    quantity: '',
    unit_price: '',
    tax: '',
    total_amount: '',
    payment_terms: '',
    delivery_terms: '',
    reference_numbers: '',
    special_instructions: '',
    attachments: null,
    authorized_signature: '',
    signature_date: ''
});

useEffect(() => {
  // Fetch data if editing existing purchase order
  const fetchData = async () => {
      try {
          const response = await axios.get(`${baseUrl}/api/purchase-orders/${orderId}/`);
          setFormData(response.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  // Fetch data only if orderId is provided
  if (orderId) {
      fetchData();
  }
}, [orderId]);

const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;
  const val = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
  setFormData(prevState => ({
      ...prevState,
      [name]: val
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (orderId) {
      await axios.put(`${baseUrl}/api/purchase-orders/${orderId}/`, formData);
    } else {
      await axios.post(`${baseUrl}/api/purchase-orders/`, formData);
    }
    // Display success message
    toast.success('Form submitted successfully!', {
      position: 'top-center',
      autoClose: 5000, // Close the toast after 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } catch (error) {
    // Display error message
    toast.error('Error submitting form. Please try again later.', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    console.error('Error submitting form:', error);
  }
};
  // END PO


  // Status tracking

  const getStatusIndex = (status) => ['ordered', 'dispatched', 'shipped', 'arrived', 'received'].indexOf(status);

  useEffect(() => {
    axios.get(`${baseUrl}/api/all-logistics-statuses/`)
      .then(response => {
        setLogisticsStatuses(response.data);

        console.log('response', response)
      })
      .catch(error => {
        console.error('Error fetching logistics statuses:', error);
      });

    axios.get(`${baseUrl}/api/order/`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });

    axios.get(`${baseUrl}/api/shipment-progress/`)
      .then(response => {
        setShipmentProgressData(response.data);
      })
      .catch(error => {
        console.error('Error fetching shipment progress data:', error);
      });

    axios.get(`${baseUrl}/api/arrived-order/`)
      .then(response => {
        setArrivedOrdersData(response.data);
      })
      .catch(error => {
        console.error('Error fetching arrived orders data:', error);
      });
  }, [baseUrl]);

  const renderOrderDetails = (order) => (
    <div key={order.id} className="order-details">
      <h6 className='mb-3'>Order #{order.id} - {order.status}</h6>
  
      <Card className={`card ${getStatusColor(order.status)} mr-2`} disabled>
        <Card.Body>
          <Card.Title>{order.status}</Card.Title>
          <Card.Text>
            <FaTruck /> Track Location
          </Card.Text>
        </Card.Body>
      </Card>
  
      {logisticsStatuses
        .filter((status) => status.invoice === order.id)
        .map((status) => (
          <Card
            key={status.id}
            className={`card ${getStatusColor(status.status)} mr-2`}
            disabled
          >
            <Card.Body>
              {status.status}
            </Card.Body>
          </Card>
        ))}
      <ProgressBar now={calculatePercentage(order.status)} label={`${order.status} - ${calculatePercentage(order.status)}%`} />
    </div>
  );

  const handleNavLinkClick = (section) => {
    setActiveSection(section);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/abattoir-payments-to-breeders/search-payment-by-code/search_payment_by_code/?payment_code=${paymentCode}`);
      const data = await response.json();

      if (response.ok) {
        setPaymentData(data);
        setError(null);
      } else {
        setPaymentData(null);
        setError(data.error || 'Invaid payment code');
      }
    } catch (error) {
      console.error('Error searching for payment data:', error);
      setPaymentData(null);
      setError('Error searching for payment data');
    }
  };

  const formatPaymentInitiationDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };


  useEffect(() => {
    // Fetch user data when component mounts
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

    fetchUserData(); // Call the function to fetch user data
  }, []); // Empty dependency array to run the effect only once when the component mounts



  const handleLcUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('lc_document', lcDocument);
  
      const response = await axios.post(
        `${baseUrl}/api/letter_of_credits/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-User-ID': userProfile?.user?.id,
            'X-User-Email': userProfile?.user?.email,
          },
        }
      );
  
      console.log('upload response', response);
      if (response.status === 201) {
        setLcUploadSuccess(true);
        setLcUploadMessage('Letter of credit document uploaded successfully');
        // Optionally, you can perform additional actions upon successful upload
      } else {
        const data = response.data;
        setLcUploadSuccess(false);
        setLcUploadMessage(data.error || 'Error uploading letter of credit document');
      }
    } catch (error) {
      console.error('Error uploading letter of credit document:', error);
      setLcUploadSuccess(false);
      setLcUploadMessage('Error uploading letter of credit document');
    }
  };
  
  
  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  const breeders = ['Breeder1', 'Breeder2', 'Breeder3']; // Add your list of breeders here
  const handleBreederClick = () => {
    setShowForm(true);
  };

  const handleBreederSelect = (breeder) => {
    setSelectedBreeder(breeder);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Your form submission logic here

    // Reset form state
    setShowForm(false);
    setSelectedBreeder('');
  };

  const [isClicked, setIsClicked] = useState(false);

  const navBackground = {
    backgroundColor: isClicked ? 'white' : 'transparent',
    color: isClicked ? 'black' : 'white',
  };

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  // CSS
  const formContainer = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};


const [activeTab, setActiveTab] = useState('Home');
const handleTabClick = (tabId) => {
  setActiveTab(tabId);
};

// LC
const [lcFormData, setLcFormData] = useState({
  paymentType: 'at_sight',
  shipmentPeriod: 'immediate',
  documentsRequired: 'bill_of_lading',
  referenceType: 'order_number',
  approvalStatus: 'pending',
  trackingStatus: 'in_transit',
  seller: '',
  breeder: '',
  bank: '',
  lcNumber: '',
  date: '',
  beneficiaryName: '',
  beneficiaryAddress: '',
  issuingBankName: '',
  issuingBankAddress: '',
  advisingBankName: '',
  advisingBankAddress: '',
  amount: '',
  expiryDate: '',
  specialConditions: '',
  paymentAtSight: false,
  deferredPayment: false,
  paymentTerms: '',
  referenceNumbers: '',
  authorizedSignatureIssuingBank: '',
  authorizedSignatureAdvisingBank: '',
  signatureDate: '',
});

const handleLcChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

const handleLcSubmit = (e) => {
  e.preventDefault();
  // Handle form submission here, you can send formData to your backend
  console.log(formData);
};

// END LC

const formStyles = {
  backgroundColor: 'rgb(249, 250, 251)',
  color: '#666666',
  fontSize: '15px',
  width: '95.33% ', // Make the form occupy one-third of the container width
  margin: '0 auto', // Center the form horizontally
  padding: '20px', // Add padding to the form
};

  return (
   <div className='main-container ' style={{ minHeight: '85vh', backgroundColor: '' }}>

<div >
<ul className="nav nav-tabs" id="myTab" role="tablist" style={{fontSize:'15px', backgroundColor:'#001b40', color:'#d9d9d9'}}>
<li className="nav-item">
          <a className={`nav-link ${activeTab === 'Home' ? 'active' : ''}`} id="home-tab" onClick={() => handleTabClick('Home')} role="tab" aria-controls="Home" aria-selected={activeTab === 'Home'}>Dashboard</a>
        </li>
        
        <li className="nav-item">
        </li>
        <li className="nav-item">
          <a href='/quotation' className={`nav-link`} style={{color:'#d9d9d9'}} id="home-tab">Quotation form</a>
        </li>
       
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'Send LPO' ? 'active' : ''}`} id="profile-tab" onClick={() => handleTabClick('Send LPO')} role="tab" aria-controls="Send LPO" aria-selected={activeTab === 'Send LPO'}>Purchase order form</a>
        </li>
        
        <li className="nav-item">
          <a className={`nav-link ${activeTab === 'Open LC' ? 'active' : ''}`} id="contact-tab" onClick={() => handleTabClick('Open LC')} role="tab" aria-controls="Open LC" aria-selected={activeTab === 'Open LC'}>Letter of credit attachment</a>
        </li>
        
      </ul>

      <div className="tab-content mt-3 mb-3" id="myTabContent">
      <div className={`tab-pane fade ${activeTab === 'Home' ? 'show active' : ''}`} id="Home" role="tabpanel" aria-labelledby="profile-tab">
        <h5 style={{color:'#999999'}}> <i className='dw dw-settings text-primary' style={{fontSize:'20px'}}></i> Manage Supplies</h5>
      <hr />

      {/* DASHBOARD */}
      <div className="">
      <div className="container-fluid" style={{ minHeight: '' }}>
         
  <div className="row">
  <div className="col-lg-3 col-md-12 ">
  <a href='/inventory-dashboard'>
    <div className="card-box height-100-p widget-style3">
      <div className="d-flex flex-wrap">
        <div className="widget-data">
          <div className="weight-600 font-18 text-dark">Inventory</div>
          <div className="font-14 text-secondary weight-500">Information</div>
        </div>
        <div className="widget-icon" style={{background:'#001b40'}}>
          <div className="icon" data-color="">
            <FaArchive /> {/* Use the FaArchive icon */}
          </div>
        </div>
      </div>
    </div>
  </a>
</div>

<div className="col-lg-3 col-md-6 ">
  <a href='/breaders'>
    <div className="card-box height-100-p widget-style3 custom-card">
      <div className="d-flex flex-wrap">
        <div className="widget-data">
          <div className="weight-600 font-18 text-dark">Suppliers</div>
          <div className="font-14 text-secondary weight-500">List</div>
        </div>
        <div className="widget-icon" style={{background:'#001b40'}}>
          <div className="icon" data-color="#001b40">
            <FaList /> {/* Use the FaList icon */}
          </div>
        </div>
      </div>
    </div>
  </a>
</div>

<div className="col-lg-3 col-md-6 ">
<a href='/quotation-list'>

  <div className="card-box height-100-p widget-style3">
    <div className="d-flex flex-wrap">
      <div className="widget-data">
        <div className="weight-600 font-18 text-dark">Quotations </div>
        <div className="font-14 text-secondary weight-500">List</div>
      </div>
      <div className="widget-icon" style={{background:'#001b40'}}>
        <div className="icon" data-color="#001b40">
          <FaMoneyBillAlt /> {/* Use the FaMoneyBillAlt icon */}
        </div>
      </div>
    </div>
  </div>
  </a>
</div>

<div className="col-lg-3 col-md-6 ">
  <a href='/purchase-order-seller'>
    <div className="card-box height-100-p widget-style3 custom-card">
      <div className="d-flex flex-wrap">
        <div className="widget-data"><div className="weight-600 font-18 text-dark">P.O </div>
          <div className="font-14 text-secondary weight-500">Details</div>
        </div>
        <div className="widget-icon " style={{background:'#001b40'}}>
          <div className="icon" data-color="#001b40">
            <FaFileInvoice /> {/* Use the FaFileInvoice icon */}
          </div>
        </div>
      </div>
    </div>
  </a>
</div>

           </div>
          </div>
          <div className='container-fluid mt-3'>
            <div className='row'>
              <div className='col-md-8'>
              <div className="chart-container">
                <div className='card p-2'
                style={{background:'#fff', borderRadius:'10px', boxShadow:'0 0 28px rgba(0,0,0,.08)'}}
                >
                  <h4 className='mt-3' style={{ color: '#001f33', opacity: 0.5 }}>Product Supply vs Demand</h4>
                  <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
                </div>
                  
                </div>
              </div>
              <div className='col-md-4'>

              <div className='card p-2 mt-1'
                style={{background:'rgb()', borderRadius:'10px', boxShadow:'0 0 28px rgba(0,0,0,.08)'}}
                >
                  <h6 className='mx-2 p-2 ' style={{ color: '#001b40' }}>Total number of finished products by category </h6>
                  <hr />
                  <ReactApexChart options={remainingBreedsChartData.options} series={remainingBreedsChartData.series} type="donut" height={350} />
                </div>
                <div className="card p-3 mt-3 mx-2"
                  style={{
                    background: '#fff',
                    borderRadius: '5px', // Adjust the border radius as needed
                    boxShadow: '0px 4px 10px rgba(255, 255, 255, .9)', // Adjust the shadow as needed
                    color: '#ffffff',
                    border:'none',
                    height:'130px'
                    // Set text color to white
                  }}
                          >
          <h6 className='mx-2'>{breedSupplyStatus}</h6>
        </div>
              </div>
            </div>
          </div>
        </div>

      {/* END DASHBOARD */}

</div>

<div className={`tab-pane fade ${activeTab === 'Inventory' ? 'show active' : ''}`} id="Inventory" role="tabpanel" aria-labelledby="profile-tab">

      <div className="ap">
<Quotation />
  </div>
</div>

  <div className={`tab-pane fade ${activeTab === 'Open LC' ? 'show active' : ''}`} id="Send LPO" role="tabpanel" aria-labelledby="profile-tab">       
        </div>
        <div className={`tab-pane fade ${activeTab === 'Send LPO' ? 'show active' : ''}`} id="Open LC" role="tabpanel" aria-labelledby="contact-tab">
        <div className='card '></div>
<Form className='p-4 m-3' style={{background:'#F9FAFB', color:'#666666', fontSize:'14px', border:'none'}} onSubmit={handleSubmit} >
  {/* Header Information */}

  <Row>
  <Col md={3}>
      <Form.Group controlId="seller">
        <Form.Label>Seller:</Form.Label>
        <Form.Control type="text" name="seller" value={formData.seller} onChange={handleChange} />
      </Form.Group>
    </Col>

    <Col md={3}>
      <Form.Group controlId="trader_name">
        <Form.Label>Trader Name:</Form.Label>
        <Form.Control type="text" name="trader_name" value={formData.trader_name} onChange={handleChange} />
      </Form.Group>
    </Col>
    <Col md={3}>
      <Form.Group controlId="shipping_address">
        <Form.Label>Shipping Address:</Form.Label>
        <Form.Control type="text" rows={3} name="shipping_address" value={formData.shipping_address} onChange={handleChange} />
      </Form.Group>
    </Col>

        <Col md={3}>
      <Form.Group controlId="product_description">
        <Form.Label>Description:</Form.Label>
        <Form.Control type="text" rows={3} name="product_description" value={formData.product_description} onChange={handleChange} />
      </Form.Group>
    </Col>

     </Row>
    <Row>
    <Col md={3}>
        <Form.Group controlId="quantity">
        <Form.Label>Quantity:</Form.Label>
        <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
      </Form.Group>
      
          </Col>
    <Col md={3}>
    <Form.Group controlId="unit_price">
        <Form.Label>Unit Price:</Form.Label>
        <Form.Control type="number" name="unit_price" value={formData.unit_price} onChange={handleChange} />
      </Form.Group>
    </Col>
  <Col md={3}>
        <Form.Group controlId="total_amount">
        <Form.Label>Total amount:</Form.Label>
        <Form.Control type="number" name="total_amount" value={formData.total_amount} onChange={handleChange} />
      </Form.Group>
      
          </Col>
        <Col md={3}>
        <Form.Group controlId="tax">
        <Form.Label>Tax rate:</Form.Label>
        <Form.Control type="number" name="tax" value={formData.tax} onChange={handleChange} />
      </Form.Group>
      
          </Col>
    <Col md={3}>
    <Form.Group controlId="payment_terms">
        <Form.Label>Payment terms:</Form.Label>
          <Form.Control 
            type="text" 
            name="payment_terms" // Ensure the name attribute matches the corresponding key in formData
            value={formData.payment_terms} 
            onChange={handleChange} 
          />
</Form.Group>

    </Col>
    <Col md={3}>
         <Form.Group controlId="special_instructions">
        <Form.Label>Special instructions:</Form.Label>
        <Form.Control type="text" name="special_instructions" value={formData.special_instructions} onChange={handleChange} />
      </Form.Group>
    </Col>
    <Col md={3}>
      <Form.Group controlId="delivery_terms">
              <Form.Label>Delivery Terms:</Form.Label>
        <Form.Control type="text" rows={3} name="delivery_terms" value={formData.delivery_terms} onChange={handleChange} />
      </Form.Group>
    </Col>
    </Row>

      <Row>
            </Row>
<hr />

  <Button className='btn btn-sm btn-primary bg-success text-white' style={{width:'200px'}}  type="submit">Create</Button>
</Form>
        </div>
        <div className={`tab-pane fade ${activeTab === 'Open LC' ? 'show active' : ''}`} id="Open LC" role="tabpanel" aria-labelledby="home-tab">
        <Row>
         {/* lc */}
<Row>
    <Col md={10}>
      <Col className="bg-light p-4 rounded shadow">
      {lcUploadSuccess ? (
  <div>
    <h4 className="text-success mb-4">Letter of Credit Document Uploaded Successfully</h4>
    <p className="text-success">
      <br />
      Thank you
    </p>
    <Button variant="secondary btn-sm" onClick={() => setActiveSection('BreederPayments')} className="mt-3">
      Back 
    </Button>
  </div>
) : (
  <div>
    <h6 className="text-success mb-4">Upload Letter of Credit Document</h6>
    <Form>
      <Form.Group controlId="lcDocument">
        <Form.Label className="text-primary">Choose the Letter of Credit Document</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) => setLcDocument(e.target.files[0])}
        />
      </Form.Group>
      <Button variant="primary btn-sm mt-3" onClick={handleLcUpload} style={{ width: '100px', fontSize:'15px' }}>
        Upload
      </Button>
      <Button className='bg-success' variant=" btn-sm mt-3 " onClick={handleLcUpload} style={{ width: '100%', fontSize:'15px' }}>
        Send to bank
      </Button>
    </Form>
    
    {lcUploadMessage && (
      <div>
        <p className={lcUploadSuccess ? "text-success mt-3" : "text-danger mt-3"}>{lcUploadMessage}</p>
        <Button className='btn btn-sm' variant="secondary" onClick={() => setActiveSection('BreederPayments')}>
          Back
        </Button>
      </div>
    )}
  </div>
)}
      </Col>
    </Col>
  </Row>
{/* end lc */}

        </Row>
        </div>
      </div>
</div>

  <Container>
    <Row>
      
    </Row>
  </Container>
  <ToastContainer />

</div>

  );
};

export default BankDashboard;
