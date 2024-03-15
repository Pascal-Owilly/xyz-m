// Breader.js
import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../auth/config';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { HiBell, HiCube, HiExclamation, HiCurrencyDollar, HiChartBar } from 'react-icons/hi';
import { Pagination } from 'react-bootstrap';

const SellersList = () => {
  const baseUrl = BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const accessToken = Cookies.get('accessToken');

  const [sellers, setSellers] = useState([]);
  const [currentPageSellers, setCurrentPageSellers] = useState(1);

  const indexOfLastItemSellers = currentPageSellers * itemsPerPage;
const indexOfFirstItemSellers = indexOfLastItemSellers - itemsPerPage;
const currentSellers = sellers.slice(indexOfFirstItemSellers, indexOfLastItemSellers)


// Use useEffect to fetch data from the backend when the component mounts
useEffect(() => {
    fetchSellers();
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


  return (
    <div className="main-container" style={{minHeight:'80vh'}}>

<div>
        <h4 className='mb-3 mt-4' style={{color:'#666666'}}> Sellers List</h4>
        <div className="table-responsive">
            <table style={{color:'#666666'}} className="table table-striped">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Date added</th>
                        <th>Details</th>


                    </tr>
                </thead>
                <tbody>
                    {currentSellers.map((seller, index) => (
                        <tr key={index}>
                            <td>{seller.id}</td>
                            <td>{seller.full_name}</td>
                            <td>{seller.formatted_created_at}</td>
                            <td>
                <a
              href={`/seller-info/${seller.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
                              <button style={{backgroundColor:'white', color:'#666666', minWidth:'100px'}}>View details
                          
                              </button>
                              </a>
                              </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <Pagination>
    {Array.from({ length: Math.ceil(sellers.length / itemsPerPage) }, (_, i) => (
        <Pagination.Item key={i + 1} active={i + 1 === currentPageSellers} onClick={() => paginateSellers(i + 1)}>
            {i + 1}
        </Pagination.Item>
    ))}
</Pagination>
    </div></div>

  );
};

export default SellersList;
