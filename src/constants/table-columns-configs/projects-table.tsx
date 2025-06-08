import type { Project } from "@/types/project";
import type { CellComponentProps, TableColumnConfig } from "@/types/table";
import { useProjectStatusStore } from "@/stores/project-status";
import ProjectPriorityCell from "@/components/table-cells/ProjectPriorityCell";
import ProjectNameCell from "@/components/table-cells/ProjectNameCell";

const config: TableColumnConfig<Project> = {
    storageName: 'project_list',
    initialColumns: [
        {
            name: 'name',
            locked: true,
            position: 1,
        },
        {
            name: 'status',
            locked: true,
            position: 2,
        },
        {
            name: 'startDate',
            locked: false,
            position: 3,
        },
        {
            name: 'endDate',
            locked: false,
            position: 4,
        },
        {
            name: 'priority',
            locked: false,
            position: 5,
        },
        {
            name: 'projectManager',
            locked: false,
            position: 6,
        }
    ],
    uiMappedColumns: [
        {
            name: 'createdAt',
            type: 'DATE_TIME'
        },
        {
            name: 'updatedAt',
            type: 'DATE_TIME'
        }
    ],
    excludeColumns: [],
    excludeCustomTypeColumns: ['MULTI_SELECT_AUTO_COMPLETE'],
    defaultConfigs: [
        {
            name: 'name',
            accessorKey: 'name',
            width: 240,
            cell: ProjectNameCell
        },
        {
            name: 'status',
            header: 'Status',
            accessorKey: 'statusId',
            cell: (props: CellComponentProps<Project, unknown>) => {
                let value = '--';
                const statusId = props.getValue?.();
                if(statusId) {
                    const status = useProjectStatusStore.getState().getStatusById(statusId as string);
                    value = status?.label || '--'
                }
                return (<div className="text-nowrap"> { value } </div>)
            }
        },
        {
            name: 'priority',
            header: 'Priority',
            accessorKey: 'priorityId',
            cell: ProjectPriorityCell
        },
]
}

export default config;