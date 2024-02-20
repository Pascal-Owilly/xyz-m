import React from 'react';

const InvoiceSuccessMessage = () => {
  const goBack = () => {
    window.history.back();
    window.history.back();

  };

  return (
    <div style={styles.container}>
      <h1 style={styles.successMessage}> Registration success!</h1>
      <button onClick={goBack} style={styles.dashboardLink}>
        Go back
      </button>
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
    border: 'none',
    background: 'none',
  },
};

export default InvoiceSuccessMessage;
