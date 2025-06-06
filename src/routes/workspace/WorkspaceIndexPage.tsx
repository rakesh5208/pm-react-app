import { useEffect } from 'react'
import { useProjectStore } from '@/stores/projects'
import { useNavigate } from 'react-router'

const WorkspaceIndexPage = () => {
    const navigate = useNavigate();
    const { isResolvingProject, workspaceSelectedProject } = useProjectStore();
    console.log("Rendering WorkspaceIndexPage")
    useEffect(() => {
        if(!isResolvingProject && workspaceSelectedProject) {
            console.log("workspaceSelectedProject", workspaceSelectedProject)
            // navigate to sprints page
            navigate(`/ws/${workspaceSelectedProject.key}/sprints`);
        }
    }, [navigate, workspaceSelectedProject, isResolvingProject])

    return (
        <div>WorkspaceIndexPage</div>
    )
}

export default WorkspaceIndexPage