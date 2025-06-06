import React, { type PropsWithChildren } from 'react'
import MainNav from './MainNav';
import { Outlet } from 'react-router'

const AppLayout: React.FC<PropsWithChildren> = () => {
  return (
    <div className="flex flex-col h-screen">
        <MainNav/>
        <div className="overflow-y-auto p-4">
            <div className='container mx-auto'>
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default AppLayout