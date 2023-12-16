import React from "react";
import { FaCheckCircle, FaMoneyBill, FaShieldAlt, FaUsers, FaCogs } from "react-icons/fa";

const HomeContent = () => {
  return (
    <>
      <div className="main-container" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '97%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ marginBottom: '20px', color: '#2E8B57', textAlign: 'left' }}>Are You a Breeder?</h3>
            <ul className="p-3" style={{ fontSize: '16px', lineHeight: '1.6' }}>
              <li style={{ marginBottom: '20px' }}>
                <FaCheckCircle style={{ color: '#2E8B57', marginRight: '10px' }} />
                Supply breeds to XYZ abattoir and get paid seamlessly.
              </li>
              <li style={{ marginBottom: '20px' }}>
                <FaShieldAlt style={{ color: '#2E8B57', marginRight: '10px' }} />
                Secure authentication for the check-in of goats.
              </li>
              <li style={{ marginBottom: '20px' }}>
                <FaMoneyBill style={{ color: '#2E8B57', marginRight: '10px' }} />
                Integrated banking for swift and hassle-free payments.
              </li>
              <li style={{ marginBottom: '20px' }}>
                <FaUsers style={{ color: '#2E8B57', marginRight: '10px' }} />
                Be part of a transparent and efficient goat supply chain management system.
              </li>
              <li>
                <FaCogs style={{ color: '#2E8B57', marginRight: '10px' }} />
                Explore advanced features for effective breeding management.
              </li>
            </ul>
          </div>
          <br /><br />
          <a href='register' style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn btn-success btn-lg">
              Register Now
            </button>
          </a>
        </div>
      </div>
    </>
  );
};

export default HomeContent;
