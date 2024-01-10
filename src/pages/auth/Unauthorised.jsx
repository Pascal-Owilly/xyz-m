import React from 'react';
import { Link } from 'react-router-dom';
import './Unauthorised.css'; // Create a separate CSS file for styling

const Unauthorized = () => {
  return (
    <div className='main-container'>
      <div className="unauthorized-container">
        <h1>Unauthorized Access</h1>
        <p>
          Oops! It seems like you don't have the necessary permissions to access this page.
        </p>
        <p>
          If you believe this is an error, please contact your administrator.
        </p>
        <Link to="/">Go to Home Page</Link>
      </div>
    </div>
  );
};

export default Unauthorized;
