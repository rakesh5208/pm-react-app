
export type ProjectStatus = {
    id:string;
    name: string;
    label: string;
}

export type ProjectPriority = {
    id:string;
    name: string;
    label: string;
}

export type Project = {
    id: string;
    name: string;
    key: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    statusId: string;
    startDate: string;
    endDate: string;
    priorityId: string
}