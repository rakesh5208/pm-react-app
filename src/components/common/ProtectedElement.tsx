import React, { useMemo } from 'react'
import { useCurrentUserStore } from '@/stores/current-user';
import type { User } from '@/types/user';
import type { Account } from '@/types/account';
import { useCurrentAccountStore } from '@/stores/current-account';

interface HasPrivilegeProps {
    children: React.ReactNode,
    permission?: string;
    feature?: string;
    customIsAllowed?: (opts: { currentUser: User | null, currentAccount: Account | null }) => boolean
}

const ProtectedElement = ({ children, permission , feature  , customIsAllowed }: HasPrivilegeProps) => {
  const { currentUser } = useCurrentUserStore();
  const { currentAccount } = useCurrentAccountStore();
  const allowed = useMemo(() => {
    // only rely of the method if customIsAllowed is given
    if(customIsAllowed) {
      return customIsAllowed({ currentAccount, currentUser });
    }
    // if no feature passed it will be considered as allowed
    const allowedFeature = feature ? currentAccount?.hasFeature(feature) : true;
    // if no permission passed it will be considered as allowed
    const allowedPermission = permission ? currentUser?.hasPermission(permission): true;
    return allowedFeature && allowedPermission;
  }, [currentUser, permission, currentAccount, customIsAllowed, feature]);
  

  return (
    <>
      {
        allowed &&  children
      }
    </>
  )

}

export default ProtectedElement