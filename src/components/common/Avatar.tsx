import React, { useMemo } from 'react'
import type { User } from '@/types/user'

interface AvatarProps {
    user: User
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
    const initials = useMemo(() => {
        const splittedNames = user.name.split(' ');
        const firstName = splittedNames[0];
        const firstNameInitial = firstName.charAt(0).toUpperCase();
        if(splittedNames.length > 1) {
            return firstNameInitial + splittedNames[1].charAt(0).toUpperCase();
        }
        return firstName.length > 1 ? firstNameInitial  + firstName.charAt(1).toUpperCase() : firstNameInitial;
    }, [user])
  return (
    <div className='flex items-center justify-center h-8 w-8 rounded-full bg-card-background font-semibold'> {initials}</div>
  )
}

export default Avatar