import React, { useState, useEffect } from 'react';
import { HiBell, HiCube, HiExclamation, HiCurrencyDollar, HiChartBar } from 'react-icons/hi';
import { BASE_URL } from '../auth/config';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Buyer = () => {
    const Greetings = () => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        let greeting;
      
        if (currentHour < 5) {
          greeting = 'Good night';
        } else if (currentHour < 12) {
          greeting = 'Good morning';
        } else if (currentHour < 18) {
          greeting = 'Good afternoon';
        } else {
          greeting = 'Good evening';
        }
      
        return greeting;
      };  
        
          const baseUrl = BASE_URL;
          const navigate = useNavigate()
          const [profile, setProfile] = useState([]);
          const authToken = Cookies.get('authToken');
          const [user, setUser] = useState({});
          const [localSuppliesData, setLocalSuppliesData] = useState(null);
          const [buyerInvoices, setBuyerInvoices] = useState([]);

          useEffect(() => {
             const fetchUserData = async () => {
               try {
                const headers = {
                    Authorization: `Token ${authToken}`,
                    'Content-Type': 'application/json',
                  };
                const [buyer, invoiceGenerate, slaughteredData, partTotalsCount, breedSales, breedCut] = await Promise.all([
                    axios.get(`${baseUrl}/api/buyers/`, { headers }),
                    axios.get(`${baseUrl}/api/generate-invoice/`, { headers }),
                    
                  ]);
                 const response = await axios.get(`${baseUrl}/auth/user/`, {
                   headers: {
                     Authorization: `Token ${authToken}`,
                   },
                 });
                 console.log('Buyers', buyer)
                 console.log('invoice', invoiceGenerate)

                 const userData = response.data;
                 setUser(userData);
               } catch (error) {
                 console.error('Error fetching user data:', error);
               }
             };
         
             fetchUserData();
           }, [authToken]);

           useEffect(() => {
            const fetchBuyerInvoices = async () => {
              try {
                const response = await axios.get(`${baseUrl}/api/buyer/${buyerId}`, {
                  headers: {
                    Authorization: `Token ${authToken}`,
                  },
                });
                setBuyerInvoices(response.data);
              } catch (error) {
                console.error('Error fetching buyer invoices:', error);
              }
            };
        
            // Replace 'buyerId' with the actual buyer ID you want to fetch invoices for
            const buyerId = 1; // Replace with the actual buyer ID
            fetchBuyerInvoices();
          }, [authToken, baseUrl]);
        
         
        
    return (
        <>
            <div className='main-container'>
                <h2 className=''>Buyer Dashboard</h2>

                <div>
                    {/* Flash message */}
                    <div style={{ marginBottom: '40px', padding: '5px', backgroundColor: '#e0e0e0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width:'200px', float:'right' }}>
                      <p className='text-center'>
                        {`${Greetings()}, `}
                        <span style={{ textTransform: 'capitalize' }}>{user.username}!</span>
                      </p>
                    </div>

                    <div>
        <hr />

        <ul>
          {buyerInvoices.map((invoice) => (
            <li key={invoice.id}>
              Invoice #{invoice.id} - Total Price: ${invoice.total_price}
            </li>
          ))}
        </ul>
      </div>

                    {/* Notifications */}
                    <div style={{ borderRadius: '50%', position: 'relative', float: 'right', top: 0, backgroundColor: 'lightblue', padding: '10px', width: '40px', height: '40px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <HiBell size={20} color='white' />
                    </div>

                    {/* Purchase Issuance */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCube className='mr-2' /> LC Issued
                    </button>

                    {/* Banking Transactions */}
                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCurrencyDollar className='mr-2' /> Banking Transactions
                    </button>

                    {/* Cataloging live deals */}
                    <button style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiExclamation className='mr-2' /> Cataloging live deals
                    </button>

                    <button className='mx-1' style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', display: 'inline-block', marginBottom: '10px', padding: '15px', width: '48%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiCube className='mr-2' /> Invoice tracking
                    </button>

                    {/* Tracking financed and paid-off deals */}
                    <button style={{ backgroundColor: 'white', color: '#333', textAlign: 'left', marginBottom: '10px', padding: '15px', width: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <HiChartBar className='mr-2' /> Tracking financed and paid-off deals
                    </button>
                </div>
            </div>
        </>
    );
}

export default Buyer;