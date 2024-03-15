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

  const [buyers, setBuyers] = useState([]);
  const [currentPageBuyers, setCurrentPageBuyers] = useState(1);

  const indexOfLastItemBuyers = currentPageBuyers * itemsPerPage;
const indexOfFirstItemBuyers = indexOfLastItemBuyers - itemsPerPage;
const currentBuyers = buyers.slice(indexOfFirstItemBuyers, indexOfLastItemBuyers)


// Use useEffect to fetch data from the backend when the component mounts
useEffect(() => {
    fetchBuyers();
}, []);

// Fetch sellers from the backend
const fetchBuyers = async () => {
    try {
        const response = await axios.get(`${baseUrl}/api/all-buyers/`);
        setBuyers(response.data);
        console.log(response.data)
    } catch (error) {
        console.error('Error fetching buyers:', error);
    }
};

  return (
    <div className="main-container" style={{minHeight:'80vh'}}>
<div>
        <h4 className='mb-3 mt-4' style={{color:'#666666'}}> Buyers List</h4>
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
                    {currentBuyers.map((buyer, index) => (
                        <tr key={index}>
                            <td>{buyer.id}</td>
                            <td>{buyer.full_name}</td>
                            <td>{buyer.formatted_created_at}</td>
                            <td>
                <a
              href={`/buyer-info/${buyer.id}`}
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
    {Array.from({ length: Math.ceil(buyers.length / itemsPerPage) }, (_, i) => (
        <Pagination.Item key={i + 1} active={i + 1 === currentPageBuyers} onClick={() => paginateBuyers(i + 1)}>
            {i + 1}
        </Pagination.Item>
    ))}
</Pagination>
    </div></div>

  );
};

export default SellersList;
