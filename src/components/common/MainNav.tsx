import { useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router';
import Avatar from './Avatar';
import { useSessionStore } from '@/stores/session';
import type { User } from '@/types/user';
import { useCurrentUserStore } from '@/stores/current-user';
import { Popover, PopoverContent } from './Popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { HomeIcon, LogOutIcon, PackageIcon, SettingsIcon } from 'lucide-react';

const MainNavList = (currentUser: User | null) => {
    return [
        { name: 'home', path: '/home', label: 'Home', hasAccess: true, icon: HomeIcon },
        { name: 'projects', path: '/projects', label: 'Projects', hasAccess: true, icon: PackageIcon },
        { name: 'admin-setting', path: '/admin-settings', label: 'Admin Settings', hasAccess: currentUser?.hasPermission('manage:admin_settings'), icon: SettingsIcon},
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
        <nav className="bg-card-background">
            <div className='container mx-auto flex flex-row bg-primary-nav-background'>
                <ul className="flex-1 flex">
                    {navs.map(nav => (
                        <li key={nav.name} className='px-2 py-4'>
                            <NavLink
                                to={nav.path}
                                className={({ isActive }) => {
                                    const baseClass = 'flex gap-2 items-center p-2 text-primary-nav-foreground hover:bg-primary-nav-hover-background hover:rounded';
                                    return `${baseClass} ${isActive ? 'bg-primary-nav-active-background rounded' : ''}`
                                }}
                            >
                                <span><nav.icon className='w-4 h-4'/></span>
                                <span>{nav.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <ul className='flex justify-end px-2 items-center gap-2'>
                    <li>
                        <input type="text" placeholder='search ...'/>
                    </li>
                    <li>
                        <Popover>
                            <PopoverTrigger>
                                <Avatar user = { currentUser } />
                            </PopoverTrigger>
                            <PopoverContent align='end'>
                                <ul>
                                    <li role='logout' className='cursor-pointer flex gap-2 items-center' onClick={onLogout}>
                                        <LogOutIcon className='w-4 h-4'/> 
                                        <span>Logout</span>
                                    </li>
                                </ul>
                            </PopoverContent>
                        </Popover>
                    </li>
                </ul>
            </div>

        </nav>
    )
}

export default MainNav