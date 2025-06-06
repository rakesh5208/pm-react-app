import { useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router';
import Avatar from './Avatar';
import { useSessionStore } from '@/stores/session';
import type { User } from '@/types/user';
import { useCurrentUserStore } from '@/stores/current-user';

const MainNavList = (currentUser: User | null) => {
    return [
        { name: 'home', path: '/home', label: 'Home', hasAccess: true },
        { name: 'projects', path: '/projects', label: 'Projects', hasAccess: true },
        { name: 'admin-setting', path: '/admin-settings', label: 'Admin Settings', hasAccess: currentUser?.hasPermission('manage:admin_settings') },
    ].filter(nav => nav.hasAccess);
}
const MainNav = () => {
    const { currentUser } = useCurrentUserStore();
    const { logout } = useSessionStore();
    const navigate = useNavigate();

    // need to filter by the user accessible navs
    const navs = useMemo(() => MainNavList(currentUser), [currentUser]);
    if(!currentUser) {
        return null;
    }

    const onLogout = async () => {
        await logout();
        navigate('/login')
    }
    return (
        <nav className="bg-primary-nav-background">
            <div className='container mx-auto flex flex-row'>
                <ul className="flex-1 flex">
                    {navs.map(nav => (
                        <li key={nav.name} className='px-2 py-4'>
                            <NavLink
                                to={nav.path}
                                className={({ isActive }) => {
                                    const baseClass = 'p-2 text-primary-nav-foreground hover:bg-primary-nav-hover-background hover:rounded';
                                    return `${baseClass} ${isActive ? 'bg-primary-nav-active-background rounded' : ''}`
                                }}
                            >
                                {nav.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <ul className='flex justify-end px-2 items-center gap-2'>
                    <li role='button'>
                        <Avatar user = { currentUser } />
                    </li>

                    <li role='button' onClick = { onLogout } className='text-primary-nav-foreground cursor-pointer'>
                        Logout
                    </li>
                </ul>
            </div>

        </nav>
    )
}

export default MainNav