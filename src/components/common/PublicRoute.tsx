import React, { useEffect, type ReactNode } from 'react'
import { useNavigate } from "react-router";
import { useCurrentUserStore } from '@/stores/current-user';

interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { currentUser } = useCurrentUserStore();
    const navigate = useNavigate();

    useEffect(() => {
        // if auth user, login to home page
        if(currentUser) {
            navigate('/home', { replace: true })
        }
    }, [navigate, currentUser])

    return (
        <>
            {children}
        </>
    )
}

export default PublicRoute;