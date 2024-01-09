import React, { useState, useEffect } from 'react';
import { FaFileInvoice, FaList, FaMoneyBillAlt, FaWarehouse, FaArchive } from 'react-icons/fa'; // Import the desired icons

import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { checkUserRole } from './auth/CheckUserRoleUtils'; 
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const Admin = () => {
  const navigate = useNavigate();

  const baseUrl = BASE_URL;
  const accessToken = Cookies.get('accessToken');
  const [userRole, setUserRole] = useState('');
  const [breadersCount, setBreadersCount] = useState(0);
  const [supplyVsDemandData, setSupplyVsDemandData] = useState([]);
  const [totalBuyers, setTotalBuyers] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [profile, setProfile] = useState([]);
  const [user, setUser] = useState(null);
  const [remainingBreeds, setRemainingBreeds] = useState([]);

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
        background: 'transparent', // Set background to transparent
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
        setBreedSupplyStatus(`You have a total of ${totalRemaining} breeds in the yard.`);
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
            background: 'lightgreen',
          },
          track: {
            background: 'lightblue',
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
          gradientToColors: ['#FFD700'],
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
    const checkUser = async () => {
      const role = await checkUserRole();
      setUserRole(role);
  
      if (role !== 'superuser' && role !== 'admin') {
        navigate('/unauthorized');
      }
    };
  
    checkUser();
  }, [navigate]);
  
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

  

  return (
    <>
      <div className="main-container">
        <div className="">
          <div className="container-fluid" style={{ minHeight: '10vh' }}>
          <h2 className="" style={{ marginBottom: '6vh', color: 'rgb(0, 27, 49)' }}>
              SCM Admin{' '}
            </h2>
            <a href='/register-buyer'>
              <button
                className=''
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#fff',
                  backgroundColor:'rgb(0, 27, 49)',
                  position: 'absolute',
                  top: '14vh',
                  right: 10,
                }}
              >
                Register buyer{' '}
              </button>
            </a>
            <div className="row">

            <div className="col-lg-3 col-md-12 mb-3">
  <a href='/inventory-dashboard'>
    <div className="card-box height-100-p widget-style3">
      <div className="d-flex flex-wrap">
        <div className="widget-data">
          <div className="weight-700 font-20 text-dark">Inventory</div>
          <div className="font-14 text-secondary weight-500">Information</div>
        </div>
        <div className="widget-icon" style={{background:'rgb(0, 27, 49)'}}>
          <div className="icon" data-color="#09cc06">
            <FaArchive /> {/* Use the FaArchive icon */}
          </div>
        </div>
      </div>
    </div>
  </a>
</div>

           

<div className="col-lg-3 col-md-6 mb-3">
  <a href='/breaders'>
    <div className="card-box height-100-p widget-style3 custom-card">
      <div className="d-flex flex-wrap">
        <div className="widget-data">
          <div className="weight-700 font-20 text-dark">Breaders</div>
          <div className="font-14 text-secondary weight-500">List</div>
        </div>
        <div className="widget-icon" style={{background:'rgb(0, 27, 49)'}}>
          <div className="icon" data-color="#09cc06">
            <FaList /> {/* Use the FaList icon */}
          </div>
        </div>
      </div>
    </div>
  </a>
</div>

<div className="col-lg-3 col-md-6 mb-3">
  <div className="card-box height-100-p widget-style3">
    <div className="d-flex flex-wrap">
      <div className="widget-data">
        <div className="weight-700 font-20 text-dark">Earnings</div>
        <div className="font-14 text-secondary weight-500">Kes 5,000,000</div>
      </div>
      <div className="widget-icon" style={{background:'rgb(0, 27, 49)'}}>
        <div className="icon" data-color="#09cc06">
          <FaMoneyBillAlt /> {/* Use the FaMoneyBillAlt icon */}
        </div>
      </div>
    </div>
  </div>
</div>



<div className="col-lg-3 col-md-6 mb-3">
  <a href='/warehouse'>
    <div className="card-box height-100-p widget-style3 custom-card">
      <div className="d-flex flex-wrap">
        <div className="widget-data">
          <div className="weight-700 font-20 text-dark">Send invoice</div>
          <div className="font-14 text-secondary weight-500">Buyers</div>
        </div>
        <div className="widget-icon" style={{background:'rgb(0, 27, 49)'}}>
          <div className="icon" data-color="#09cc06">
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
                  <h4 className='mt-4' style={{ color: '#001f33', opacity: 0.5 }}>Breed Supply vs Demand</h4>
                  <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
                </div>
                  
                </div>
              </div>
              <div className='col-md-4'>

              <div className='card p-2 mt-1'
                style={{background:'rgb()', borderRadius:'10px', boxShadow:'0 0 28px rgba(0,0,0,.08)'}}
                >
                  <h6 className='mx-2  text-primary' style={{ color: '' }}>Total left in the yard by category </h6>
                  <hr />
                  <ReactApexChart options={remainingBreedsChartData.options} series={remainingBreedsChartData.series} type="donut" height={350} />
                </div>
                <div className="card p-2 mt-3 mx-2"
                  style={{
                    background: '#fff',
                    borderRadius: '5px', // Adjust the border radius as needed
                    boxShadow: '0px 4px 10px rgba(255, 255, 255, .9)', // Adjust the shadow as needed
                    color: '#ffffff',
                    border:'none'
                    // Set text color to white
                  }}
                          >
          <h6 className='mx-2'>{breedSupplyStatus}</h6>
        </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
