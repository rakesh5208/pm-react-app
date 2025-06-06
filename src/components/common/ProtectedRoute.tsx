import React, { useCallback, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router';
import type { User } from '@/types/user';
import type { Account } from '@/types/account';
import { toast } from 'react-toastify';
import Breadcrumb from './Breadcrumb';
import { useCurrentAccountStore } from '@/stores/current-account';
import { useCurrentUserStore } from '@/stores/current-user';

interface ProtectRouteProps {
    children: ReactNode;
    permission?: string; // check if the user has permissions
    feature?: string; // check if the user has feature
    customIsAccessible?: (opts: { currentUser: User | null, currentAccount: Account | null }) => boolean // this takes priority while checking the hasAccess
}

const ProtectedRoute: React.FC<ProtectRouteProps> = ({ children, customIsAccessible, permission, feature }) => {
    const { currentAccount } = useCurrentAccountStore();
    const { currentUser } = useCurrentUserStore();
    const navigate = useNavigate();

    const hasAccessToRoute = useCallback(() => {
        // default allow if no permission passed
        const hasRequiredPermission = permission ? currentUser?.hasPermission(permission) : true;
        // allow access to the route,  if no feature has been default it will be accessible
        const hasRequiredFeature = feature ? currentAccount?.hasFeature(feature) : true;

        return hasRequiredPermission && hasRequiredFeature;
    }, [currentAccount, currentUser, permission, feature]);

    const redirectToHome = useCallback(() => {
        toast("You don't have permission to access", { type: 'error'} )
        navigate('/home', { replace: true })
    }, [navigate]);

    useEffect(() => {
        // if user is unauthenticated , redirect to login
        if (!currentUser) {
            navigate('/login', { replace: true });
        }

        // custom method given it will rely on that, it will skip the permission and feature check
        if(customIsAccessible) {
            const allowed = customIsAccessible({ currentAccount, currentUser });
            if(!allowed) {
                redirectToHome();
            }
        } else if(!hasAccessToRoute()) {
            redirectToHome();
        }
    }, [currentUser, navigate, hasAccessToRoute, customIsAccessible, currentAccount, redirectToHome]);

    // finally render the children
    return (
        <>
            <Breadcrumb/>
            <div className='py-4'>
                {children}
            </div>
            
        </>
    )
}

export default ProtectedRoute