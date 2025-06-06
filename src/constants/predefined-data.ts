import { useProjectPriorityStore } from "../stores/project-priority";
import { useProjectStatusStore } from "../stores/project-status";
import type { ProjectPriority, ProjectStatus } from "../types/project";

const getProjectStatuses = (): ProjectStatus[] => {
    return [
        { id: "1", name: "active", label: "Active" },
        { id: "2", name: "archived", label: "Archived" },
        { id: "3", name: "open", label: "Open" },
        { id: "4", name: "in_progress", label: "In Progress" },
        { id: "5", name: "completed", label: "Completed" }
    ]
};

const getProjectPriorities = (): ProjectPriority[] => {
    return [
        { id: "1", name: "low", label: "Low" },
        { id: "2", name: "medium", label: "Medium" },
        { id: "3", name: "high", label: "High" },
        { id: "4", name: "urgent", label: "Urgent" }
    ]
}

interface PredefinedData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storeInitDataFn: (data: any[]) => void, // zustand store name
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataFn: () => Record<string, any>[] // dataFn to return the list of the data, made as function so that in future we can any intl service, translated the key
}

const predefinedDataConfigs: PredefinedData[] = [
    {
        storeInitDataFn: useProjectStatusStore.getState().initData,
        dataFn: getProjectStatuses
    },
    {
        storeInitDataFn: useProjectPriorityStore.getState().initData,
        dataFn: getProjectPriorities
    }
];



export const loadPredefinedDataToStore = () => {
    predefinedDataConfigs.forEach((config) => {
        const data = config.dataFn();
        config.storeInitDataFn(data);
    })
}

