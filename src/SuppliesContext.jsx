import React, { createContext, useContext, useState, useEffect } from 'react';

const SuppliesContext = createContext();

export const SuppliesProvider = ({ children }) => {
  // Initialize state from local storage or default to null
  const [suppliesData, setSuppliesData] = useState(() => {
    const storedData = localStorage.getItem('suppliesData');
    return storedData ? JSON.parse(storedData) : null;
  });

  // Update local storage when suppliesData changes
  useEffect(() => {
    localStorage.setItem('suppliesData', JSON.stringify(suppliesData));
  }, [suppliesData]);

  return (
    <SuppliesContext.Provider value={{ suppliesData, setSuppliesData }}>
      {children}
    </SuppliesContext.Provider>
  );
};

export const useSupplies = () => {
  return useContext(SuppliesContext);
};
