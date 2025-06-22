import React, { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import MainNav from './MainNav';
import { Outlet } from 'react-router'

const AppLayout: React.FC<PropsWithChildren> = () => {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight ] = useState(0);
  useEffect(() => {
    if(headerRef.current) {
      const ele = headerRef.current as Element;
      const props = ele.getBoundingClientRect();
      setHeaderHeight(props.height);
    }
  }, [])
  return (
    <div className="flex flex-col h-screen">
        <div ref={headerRef}>
          <MainNav/>
        </div>
        <div className="bg-card-background overflow-hidden pb-4" style={{height: `calc(100vh - ${headerHeight}px)`}}>
            <div className='container mx-auto bg-page-background p-4 h-full rounded'>
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default AppLayout