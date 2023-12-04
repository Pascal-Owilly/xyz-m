import React from 'react';
import { Link } from 'react-router-dom';

const InvoiceSuccessMessage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.successMessage}>Your Invoice is Submitted Successfully!</h1>
      <Link to="/supplier_dashboard" style={styles.dashboardLink}>
        Return to Your Dashboard
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70vh',
  },
  successMessage: {
    fontSize: '24px',   
    fontWeight: 'bold',
    color: '#28a745', // Green color for success
    marginBottom: '20px',
  },
  dashboardLink: {
    fontSize: '18px',
    color: '#007bff', // Blue color for link
    textDecoration: 'none',
    cursor: 'pointer',
  },
};

export default InvoiceSuccessMessage;
