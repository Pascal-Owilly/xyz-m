import React, { useState, useEffect } from 'react';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { checkUserRole } from './auth/CheckUserRoleUtils'; 
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const Admin = () => {
  const navigate = useNavigate();

  const baseUrl = BASE_URL;
  const authToken = Cookies.get('authToken');
  const [userRole, setUserRole] = useState('');
  const [breadersCount, setBreadersCount] = useState(0);
  const [supplyVsDemandData, setSupplyVsDemandData] = useState([]);

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
    // ... your other useEffect logic
  }, [baseUrl, authToken]);

  useEffect(() => {
    const checkUser = async () => {
      const userRole = await checkUserRole();
      setUserRole(userRole);

      if (userRole !== 'superuser') {
        navigate('/unauthorized');
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <>
      <div className="main-container">
        <div className="">
          <div className="container-fluid" style={{ minHeight: '10vh' }}>
            <h2 className="" style={{ marginBottom: '6vh' }}>SCM Administration </h2>
            <div className="row">
            <div className="col-lg-3 col-md-6 mb-3">
      <div className="card-box height-100-p widget-style3">
        <div className="d-flex flex-wrap">
          <div className="widget-data">
            <div className="weight-700 font-24 text-dark">Buyers</div>
            <div className="font-14 text-secondary weight-500">5000</div>
          </div>
          <div className="widget-icon">
            <div className="icon" data-color="#09cc06">
              <i className="fas fa-plane"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="col-lg-3 col-md-6 mb-3">
    <a href='/breaders'>

      <div className="card-box height-100-p widget-style3">
        <div className="d-flex flex-wrap">
          <div className="widget-data">
            <div className="weight-700 font-24 text-dark">Breaders</div>
            <div className="font-14 text-secondary weight-500">{breadersCount}</div>
          </div>
          <div className="widget-icon">
            <div className="icon" data-color="#09cc06">
              <i className="fas fa-plane"></i>
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
            <div className="weight-700 font-24 text-dark">Earnings</div>
            <div className="font-14 text-secondary weight-500">Kes 5,000,000</div>
          </div>
          <div className="widget-icon">
            <div className="icon" data-color="#09cc06">
              <i className="fas fa-plane"></i>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div className="col-lg-3 col-md-12 mb-3">
    <a href='/inventory-dashboard'>

      <div className="card-box height-100-p widget-style3">
        <div className="d-flex flex-wrap">
          <div className="widget-data">
            <div className="weight-700 font-24 text-dark">Inventory</div>
            <div className="font-14 text-secondary weight-500">5 Activities</div>
          </div>
          <div className="widget-icon">
            <div className="icon" data-color="#09cc06">
              <i className="fas fa-plane"></i>
            </div>
          </div>
        </div>
      </div>
      </a>
 
    </div>
            </div>
          </div>
          <div>
            <h3 className='mt-4'>Breed Supply vs Demand</h3>
            <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
