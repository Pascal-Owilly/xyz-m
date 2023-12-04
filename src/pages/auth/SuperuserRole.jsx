import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkUserRole } from './CheckUserRoleUtils'; // Update the path accordingly

const SuperuserRoute = ({ children }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('loading');

  useEffect(() => {
    // Check user role and update state
    checkUserRole().then((role) => {
      console.log('User Role from HOC:', role); // Log the user's role
      setUserRole(role);
    });
  }, []);

  // Redirect non-superusers to a different page
  useEffect(() => {
    if (userRole !== 'superuser') {
        console.log('Redirecting non-superuser');

        navigate('/', { replace: true });
    }
  }, [userRole, navigate]);

  return <>{userRole === 'superuser' ? children : null}</>;
};

export default SuperuserRoute;
