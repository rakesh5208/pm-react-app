import { useEffect, useMemo } from 'react'
import { Outlet, useParams } from 'react-router';
import { useProjectStore } from '@/stores/projects';

const WorkspaceResolvePage = () => {
    const { key } = useParams();
    const { isResolvingProject, fetchProjectByKey, workspaceSelectedProject, error } = useProjectStore();
    const isWorkspaceChanged = useMemo(() => key !== workspaceSelectedProject?.key ,[key, workspaceSelectedProject])
    
    useEffect(() => {
        if(key) {
            fetchProjectByKey(key)
        }
    }, [key]);

    if (isResolvingProject || isWorkspaceChanged ||  !workspaceSelectedProject ) {
        return <div> setting up your workspace ...</div>
    }

    if(error) {
        return <div> Error while resolving project</div>
    }
    return <Outlet/> ;
}

export default WorkspaceResolvePage