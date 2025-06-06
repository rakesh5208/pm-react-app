import { useProjectStore } from '@/stores/projects'
import { Link } from 'react-router';

const SprintListPage = () => {
  const { workspaceSelectedProject }  = useProjectStore();
  return (
    <div>
        <Link to = {`/ws/${workspaceSelectedProject?.key}/sprints/1/board-settings`}>Board settings </Link>
    </div>
  )
}

export default SprintListPage