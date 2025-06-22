import { useMemo } from 'react'
import { Link, useLocation } from 'react-router';

const Breadcrumb = () => {
    // let breadcrumbs = [];
    const location  = useLocation();

    const breadcrumbs = useMemo(()=> {
        let crumblyData = [];
        // skip in case of the /home route
        if(location.pathname === '/home') return [];
        const segmentedPaths = location.pathname.split('/').filter(segment => segment);
        let breadcrumbLink = ''
        segmentedPaths.forEach((segmentedPath, index) => {
            breadcrumbLink +=  `/${segmentedPath}`;
            const isLast = index === segmentedPaths.length - 1;
            crumblyData.push( { to: isLast ? '' : breadcrumbLink, label: segmentedPath  })
        })
    
        // push home
        crumblyData.unshift({ to : '/home', label: 'Home' })
        
        // skip the /ws routes
        crumblyData = crumblyData.filter((breadcrumb) => breadcrumb.to !== '/ws');
        return crumblyData;
    }, [location])
    
  return (
    <nav>
        <ul className='flex gap-2 p-2'>
        {
            breadcrumbs.map((breadcrumb, index) => {
                return (<li key={ index } className='text-sm'>
                    {
                        breadcrumb.to ? <> <Link  className="text-link" to={breadcrumb.to}>{ breadcrumb.label} </Link> &gt; </> : <span>{ breadcrumb.label }</span> 
                    }
                </li>)
            })
        }
        </ul>
    </nav>
  )
}

export default Breadcrumb