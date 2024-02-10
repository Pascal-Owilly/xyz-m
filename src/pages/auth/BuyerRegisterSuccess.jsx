import React from 'react';
import { Link } from 'react-router-dom';

const InvoiceSuccessMessage = () => {
  return (
    <div style={styles.container}>
    <h1 style={styles.successMessage}>Buyer register success!</h1>
    <p style={styles.infoMessage}>
      To complete buyer address details, please click the link below:
    </p>
    <Link to="https://api.intellima.tech/admin/invoice_generator/buyer/add/" style={styles.dashboardLink}>
Complet buyer registration
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
    minHeight: '85vh',
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
