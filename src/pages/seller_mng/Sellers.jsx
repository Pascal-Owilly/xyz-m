// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container, Form, Button, ProgressBar, Navbar, Nav, NavDropdown, NavLink, FormGroup, FormLabel, InputGroup, Table, Pagination, Carousel } from 'react-bootstrap';
import { FaTruck } from 'react-icons/fa'; 
import { BASE_URL } from '../auth/config';
import Cookies from 'js-cookie';
import axios from 'axios';
import './Seller.css';
import { FaFileInvoice, FaList, FaMoneyBillAlt, FaWarehouse, FaArchive } from 'react-icons/fa'; 
import ReactApexChart from 'react-apexcharts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Quotation from './Quotation';

const Sellers = ({ orderId }) => {

  // ADMIN DASHBOARD
  const baseUrl = BASE_URL;
  const [breadersCount, setBreadersCount] = useState(0);
  const [supplyVsDemandData, setSupplyVsDemandData] = useState([]);
  const [totalBuyers, setTotalBuyers] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [user, setUser] = useState(null);
  const [remainingBreeds, setRemainingBreeds] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [quotationsPerPage] = useState(5); // Number of quotations per page
  const [quotations, setQuotations] = useState([]);
  const [updateCompleted, setUpdateCompleted] = useState(false);

  // Pagination
  const itemsPerPage = 7; // Number of items to display per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // admin vars
    const [activeSection, setActiveSection] = useState('Negotiations');
    const [paymentCode, setPaymentCode] = useState('');
    const [paymentData, setPaymentData] = useState(null);
    const [error, setError] = useState(null);
    const accessToken = Cookies.get('accessToken');
    const [selectedBreeder, setSelectedBreeder] = useState('');
    const [showForm, setShowForm] = useState(false);

    // LC
    const [lcDocument, setLcDocument] = useState(null);
    const [profile, setProfile] = useState(null)
    const [userProfile, setUserProfile] = useState(null);
    const [arrivedOrdersData, setArrivedOrdersData] = useState([]);
    const [shipmentProgressData, setShipmentProgressData] = useState([]);
    const [logisticsStatuses, setLogisticsStatuses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [letterOfCredits, setLetterOfCredits] = useState([]);
    const [lcUploadSuccess, setLcUploadSuccess] = useState(false);
    const [lcUploadMessage, setLcUploadMessage] = useState('');

    // Leven info

    const [supplyStatus, setSupplyStatus] = useState('');
    const [breedsData, setBreedsData] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/supply-vs-demand`);
          setBreedsData(response.data.supply_vs_demand_data);
          calculateSupplyStatus(response.data.supply_vs_demand_data);
        } catch (error) {
          console.error('Error fetching supply vs demand data:', error);
        }
      };
  
      fetchData();
    }, []);

    useEffect(() => {
      // Automatically reveal all cards after 5 seconds
      const timer = setTimeout(() => {
        setShowAll(true);
      }, 5000);
  
      return () => clearTimeout(timer);
    }, []);

    const calculateSupplyStatus = (data) => {
      const totalBreeds = data.reduce((acc, item) => acc + item.total_bred, 0);
  
      if (totalBreeds > 100) {
        setSupplyStatus('Crucial');
      } else if (totalBreeds > 50) {
        setSupplyStatus('Need More Supplies');
      } else {
        setSupplyStatus('Normal Level');
      }
    };
  
    const getStatusMessage = (count) => {
      if (count > 100) {
        return 'Crucial';
      } else if (count > 50) {
        return 'Need More Supplies';
      } else {
        return 'Normal';
      }
    };

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
    // end level
    useEffect(() => {
      // Fetch letter of credits from the new endpoint with headers
      axios.get(`${baseUrl}/api/all-lcs/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(response => {
          console.log('Fetched letter of credits:', response.data);
          setLetterOfCredits(response.data);
          console.log('LC list', response)
        })
        .catch(error => console.error('Error fetching letter of credits:', error));
    }, [baseUrl, accessToken]);

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

  const renderDocumentPreview = (documentUrl, altText) => {
    if (!documentUrl) {
      return null;
    }
    // Get the file extension
    const fileExtension = documentUrl.split('.').pop()?.toLowerCase(); // Added null check with '?'
    console.log('File Extension:', fileExtension);
    // Check the file type and render accordingly
    if (fileExtension === 'pdf') {
      return <embed src={documentUrl} type="application/pdf" width="50" height="50" />;
    } else if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
      return <img src={documentUrl} alt={altText} width="50" height="50" />;
    } else {
      // For other file types, provide a generic link
      return <a href={documentUrl} target="_blank" rel="noopener noreferrer">View Document</a>;
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
  
  const chartLevelData = {
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
      if (Array.isArray(supplyVsDemandData)) {
        const remainingBreedsData = supplyVsDemandData.map((item) => {
          const remainingCount = Math.max(0, item.total_bred - item.total_slaughtered);
          return {
            breed: item.breed,
            remainingCount,
          };
        });
  
        setRemainingBreeds(remainingBreedsData);
      }
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

    fetchUserData();
  }, []);

  const [activeTab, setActiveTab] = useState('Home');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
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
          <a href='/quotation' className={`nav-link`} style={{color:'#d9d9d9'}} id="home-tab">Send quotataion</a>
        </li>
             
        <li className="nav-item">
          <a href='/control-centers-single-trader' className={`nav-link`} style={{color:'#d9d9d9'}} id="home-tab">Control centers</a>
        </li>        
      </ul>

      <div className="tab-content mt-3 mb-3" id="myTabContent">
      <div className={`tab-pane fade ${activeTab === 'Home' ? 'show active' : ''}`} id="Home" role="tabpanel" aria-labelledby="profile-tab">
      <div className="d-flex justify-content-between align-items-center">
  <h5 style={{ color: '#999999' }}>
    <i className='dw dw-settings text-primary' style={{ fontSize: '20px' }}></i> Manage Supplies
  </h5>
  <div className="text-right">
    <a href='/supplier-register'>
      <button className='btn btn-sm' style={{ background: 'white', color: '#ccc' }}>
        Register supplier
      </button>
    </a>
  </div>
</div>
      <hr />
      {/* DASHBOARD */}
      <div className="">
      <div className="container-fluid" style={{ minHeight: '' }}>
  <div className="row">
  <div className="col-lg-3 col-md-12 mb-4">
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

<div className="col-lg-3 col-md-6 mb-4">
  <a href='/breaders'>
    <div className="card-box height-100-p widget-style3 custom-card">
      <div className="d-flex flex-wrap">
        <div className="widget-data">
          <div className="weight-600 font-18 text-dark">Suppliers</div>
          <div className="font-14 text-secondary weight-500">List</div>
        </div>
        <div className="widget-icon" style={{background:'#001b40'}}>
          <div className="icon" data-color="#001b40">
            <FaList />
          </div>
        </div>
      </div>
    </div>
  </a>
</div>

<div className="col-lg-3 col-md-6 mb-4">
<a href='/quotation-list'>
  <div className="card-box height-100-p widget-style3">
    <div className="d-flex flex-wrap">
      <div className="widget-data">
        <div className="weight-600 font-18 text-dark">Quotations </div>
        <div className="font-14 text-secondary weight-500">List history</div>
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

<div className="col-lg-3 col-md-6 mb-4">
  <a  onClick={() => handleTabClick('Open LC')} style={{cursor:'pointer'}}>
    <div className="card-box height-100-p widget-style3 custom-card">
      <div className="d-flex flex-wrap">
        <div className="widget-data"><div className="weight-600 font-18 text-dark">L.C </div>
          <div className="font-14 text-secondary weight-500">List</div>
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
        </div>
        <div className={`tab-pane fade ${activeTab === 'Open LC' ? 'show active' : ''}`} id="Open LC" role="tabpanel" aria-labelledby="home-tab">
         {/* lc */}
<Row>
<h5 className='mt-2 mb-3' style={{ color:'#999999'}}>List of LCs</h5>

<Card style={{ width: '100%', padding: '1rem', borderRadius: '10px', minHeight: '70vh', color: '#666666' }}>
      <Table style={{ color: '#999999' }} responsive striped bordered hover>
        <thead>
          <tr>
            <th>Letter of credit</th>
            <th>LC ID</th>
            <th>Issue Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {letterOfCredits && letterOfCredits.map(letterOfCredit => (
            <tr key={letterOfCredit.id}>
             <td>{renderDocumentPreview(letterOfCredit.lc_document, `LC Document for ${letterOfCredit.buyer}`)} 
             <a href={letterOfCredit.lc_document} target="_blank" rel="noopener noreferrer" className="btn btn-sm float-right " style={{backgroundColor:'rgb(255, 255, 255)', fontSize:'12px', color:'#999999'}}>
              View
              </a>
</td>
              <td>#{letterOfCredit.id}</td>
              <td>{new Date(letterOfCredit.issue_date).toLocaleString()}</td>
              <td style={{ textTransform: 'capitalize' }}>
  {/* <button className='btn btn-sm text-white' style={{ backgroundColor: getButtonColor(letterOfCredit.status) }}>
    {letterOfCredit.status}
  </button> */}
</td>
              <td>
              <select
      className="form-select p-1 text-dark bg-white"
      onChange={(e) => {
        // Check LC status before updating
        if (lcStatus === 'active') {
          handleUpdateStatus(letterOfCredit.id, e.target.value);
        } else {
          // Display error message or prevent update
          console.error('Cannot update status. Letter of credit is not active.');
        }
      }}
      style={{ border: 'none', borderRadius: '30px', padding: '5px' }}
    >
      <option style={{ fontSize: '12px' }} value="">Update</option>
      <option style={{ fontSize: '12px' }} value="approved">Approv</option>
      <option style={{ fontSize: '12px' }} value="rejected">Reject</option>

    </select>
              </td>
            </tr>
          ))}
        </tbody>
        
      </Table>
      <Pagination
        itemsPerPage={quotationsPerPage}
        totalItems={quotations.length}
        paginate={paginate}
      />
    </Card>
  </Row>
{/* end lc */}
        </div>
      </div>
</div>
  <ToastContainer />
</div>

  );
};

export default Sellers;
