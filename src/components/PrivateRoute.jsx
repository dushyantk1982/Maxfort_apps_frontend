import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp * 1000; // convert to ms
    return Date.now() < exp;
  } catch (e) {
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  return isTokenValid() ? children : <Navigate to="/" />;
};

export default PrivateRoute;









// For deployment