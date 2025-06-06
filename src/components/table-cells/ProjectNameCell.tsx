import { useMemo } from 'react'
import type { CellComponentProps } from '../../types/table';
import type { Project } from '../../types/project';
import { Link } from 'react-router';

const ProjectNameCell = (props: CellComponentProps<Project, unknown>) => {
    const value = useMemo(() => {
        return props.getValue() as string;
    }, [props]);

    const workspaceLink = useMemo(() => {
        return `/ws/${props.row.original.key}`;
    }, [props]);
    
    return (
        <Link className="text-wrap hover:text-link" to={workspaceLink}>{value}</Link>)
}

export default ProjectNameCell;