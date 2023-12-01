import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../auth/config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Home = () => {
  const baseUrl = BASE_URL;
  const navigate = useNavigate();
  const [breaderData, setBreaderData] = useState(null);
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/breader-trade`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        const data = await response.json();
        setBreaderData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="main-container">
      {/* Display the Breader data */}
      {breaderData && (
        <div>
          <h2 className='mb-4'>Breaders List</h2>
          <div className="row">
            {breaderData.map((breader) => (
              <div key={breader.id} className="col-lg-3 mb-4">
                <div className="card" style={{borderRadius:'10px'}}>
                  <div className="card-body">
                    <h5 className="card-title">{breader.community} Community</h5>
                    <p className="card-text">
                      <strong>Breader:</strong> {breader.breader}
                    </p>
                    <p className="card-text">
                      <strong>Market:</strong> {breader.market}
                    </p>
                    {/* Add more information as needed */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
