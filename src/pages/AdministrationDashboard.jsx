import React, { useState, useEffect } from 'react';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';

const Admin = () => {
  const baseUrl = BASE_URL;

  const [breadersCount, setBreadersCount] = useState(0);
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    // Fetch data from Django API endpoint
    fetch(`${baseUrl}/api/breader-count/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setBreadersCount(data.breader_count);
        console.log('count', data.breader_count);
      })
      .catch(error => console.error('Error fetching breaders count:', error));
  }, []);
  

	return(

		<>
  <div className="main-container">
  <div className="">
  <div className="container-fluid" style={{minHeight:'80vh'}}>
	<h2 className='' style={{marginBottom:'6vh'}}>SCM Administration </h2>
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
      <div className="card-box height-100-p widget-style3">
        <div className="d-flex flex-wrap">
          <div className="widget-data">
            <div className="weight-700 font-24 text-dark">Communities</div>
            <div className="font-14 text-secondary weight-500">3000</div>
          </div>
          <div className="widget-icon">
            <div className="icon" data-color="#09cc06">
              <i className="fas fa-plane"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="card-box height-100-p widget-style3">
        <div className="d-flex flex-wrap">
          <div className="widget-data">
            <div className="weight-700 font-24 text-dark">Inventory</div>
            <div className="font-14 text-secondary weight-500">500 Breads</div>
          </div>
          <div className="widget-icon">
            <div className="icon" data-color="#09cc06">
              <i className="fas fa-plane"></i>
            </div>
          </div>
        </div>
      </div>

	

  </div>
</div>

			</div>
			</div>

</>

	)
}

export default Admin;




