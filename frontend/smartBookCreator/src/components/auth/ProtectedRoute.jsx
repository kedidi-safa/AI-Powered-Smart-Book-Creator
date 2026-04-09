import React from 'react'
import { Navigate, useLocation } from 'react-router';
import {MoonLoader} from "react-spinners";
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({children}) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading){
        return <div><MoonLoader /></div>
    }

    if (!isAuthenticated){
        return <Navigate to="/" state={{from: location}} replace />
    }

    return children;
}

export default ProtectedRoute