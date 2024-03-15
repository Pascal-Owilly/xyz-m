import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../auth/config';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import defaultImg from '../../../images/profile.webp';

const BreaderInfo = () => {
  const baseUrl = BASE_URL;
  const { sellerId } = useParams();
  const [sellerData, setSellerData] = useState({});
  const [controlCenters, setControlCenters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sellerResponse = await axios.get(`${baseUrl}/api/all-sellers/${sellerId}/`);
        setSellerData(sellerResponse.data);

        const controlCenterResponse = await axios.get(`${baseUrl}/api/control-centers/`);
        const filteredCenters = controlCenterResponse.data.filter(center => center.seller === parseInt(sellerId));
        setControlCenters(filteredCenters);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchData();
    }
  }, [sellerId]);

  return (
    <div className='main-container' style={{ backgroundColor: 'rgb(248, 250, 251)', color: '#111', padding: '', minHeight: '85vh' }}>
      <div className='container' style={{ maxWidth: '', margin: '' }}>
        <h4 className='mb-4' style={{ color: '#666', textTransform: '' }}>{sellerData.full_name}'s profile</h4>
        <hr />
        <div className='row'>
          <div className='col-md-4'>
            <img src={defaultImg} className='img img-rounded' alt="Profile" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }} />
          </div>
          <div className='col-md-8'>
            <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
              <table className='table' style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #ddd', borderRadius: '5px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', width: '30%' }}>Joined on:</td>
                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{sellerData.formatted_created_at}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Address:</td>
                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{sellerData.address}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email:</td>
                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{sellerData.email}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', textAlign: 'left' }}>Username:</td>
                    <td style={{ padding: '10px', textAlign: 'left' }}>{sellerData.username}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', textAlign: 'left' }}>System id:</td>
                    <td style={{ padding: '10px', textAlign: 'left' }}>{sellerData.id}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {controlCenters.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-3">Control Centers:</h4>
                <ul>
                  {controlCenters.map(center => (
                    <li key={center.id}>{center.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreaderInfo;
