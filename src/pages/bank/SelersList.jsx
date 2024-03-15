import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../auth/config';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';

const SellersList = () => {
  const baseUrl = BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const accessToken = Cookies.get('accessToken');

  const [sellers, setSellers] = useState([]);
  const [controlCenters, setControlCenters] = useState([]);
  const [currentPageSellers, setCurrentPageSellers] = useState(1);

  const indexOfLastItemSellers = currentPageSellers * itemsPerPage;
  const indexOfFirstItemSellers = indexOfLastItemSellers - itemsPerPage;
  const currentSellers = sellers.slice(indexOfFirstItemSellers, indexOfLastItemSellers);

  // Use useEffect to fetch data from the backend when the component mounts
  useEffect(() => {
    fetchSellers();
    fetchControlCenters();
  }, []);

  // Fetch sellers from the backend
  const fetchSellers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/all-sellers/`);
      setSellers(response.data);
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

  // Fetch control centers from the backend
  const fetchControlCenters = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/control-centers/`);
      setControlCenters(response.data);
    } catch (error) {
      console.error('Error fetching control centers:', error);
    }
  };

  // Get control center for the specific seller
  const getControlCenterForSeller = (sellerId) => {
    const center = controlCenters.find(center => center.seller === sellerId);
    return center ? center.name : 'No control center';
  };

  return (
    <div className="main-container" style={{ minHeight: '80vh' }}>
      <div>
        <h4 className='mb-3 mt-4' style={{ color: '#666666' }}> Sellers List</h4>
        <div className="table-responsive">
          <table style={{ color: '#666666' }} className="table table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Date added</th>
                {/* <th>Control Center</th> */}
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {currentSellers.map((seller, index) => (
                <tr key={index}>
                  <td>{seller.id}</td>
                  <td>{seller.full_name}</td>
                  <td>{seller.formatted_created_at}</td>
                  {/* <td>{getControlCenterForSeller(seller.id)}</td> */}
                  <td>
                    <Link to={`/seller-info/${seller.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <button style={{ backgroundColor: 'white', color: '#666666', minWidth: '100px' }}>View details</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination>
          {Array.from({ length: Math.ceil(sellers.length / itemsPerPage) }, (_, i) => (
            <Pagination.Item key={i + 1} active={i + 1 === currentPageSellers} onClick={() => setCurrentPageSellers(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
};

export default SellersList;
