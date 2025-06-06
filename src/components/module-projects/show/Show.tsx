import React, { useEffect } from 'react'
import { useProjectStore } from '@/stores/projects';

interface ProjectShowProps {
    id: string;
}

const Show: React.FC<ProjectShowProps> = ({ id }) => {
    const { isLoading, error, fetchProjectById, projectInShowPage } = useProjectStore();
    useEffect(() => {
        fetchProjectById(id);
    }, [id, fetchProjectById])
    
    if (isLoading) {
        return <div> Loading Project details for {id}</div>
    }

    if (error || (!projectInShowPage)) {
        return <div> Either Project not found and you don't have access to the project</div>
    }

    console.log("Project >>", projectInShowPage)
    return (
        <div>{JSON.stringify(projectInShowPage)}</div>
    )
}

export default Show