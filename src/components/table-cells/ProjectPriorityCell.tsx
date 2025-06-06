import { useMemo } from 'react'
import type { CellComponentProps } from '../../types/table';
import type { Project } from '../../types/project';
import { useProjectPriorityStore } from '../../stores/project-priority';

const ProjectPriorityCell = (props: CellComponentProps<Project, unknown>) => {
    const { getPriorityById } = useProjectPriorityStore();
    const formattedValue = useMemo(() => {
        let value = props.defaultValue;
        const priorityId = props.getValue?.();
        if (priorityId) {
            const priority = getPriorityById(priorityId as string);
            value =priority?.label || '--';
        }
        return value;
    }, [getPriorityById, props])
    
    return (<div className='w-full text-nowrap overflow-hidden text-ellipsis'> {formattedValue} </div>)
}

export default ProjectPriorityCell;