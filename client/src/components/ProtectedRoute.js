import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component checks for authentication before rendering the component
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token'); // Check if token exists

    if (!token) {
        // If no token, redirect to login
        return <Navigate to="/login" />;
    }

    return children; // If authenticated, render the component
}

export default ProtectedRoute;
