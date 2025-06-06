import { create } from "zustand";
import type { ProjectStatus } from "../types/project";

interface ProjectStatusStore {
    statuses: ProjectStatus[],
    initData: (statuses: ProjectStatus[]) => void
    getStatusById: (id: string) => ProjectStatus | undefined;
}
export const useProjectStatusStore = create<ProjectStatusStore>()((set, get) => ({
    statuses: [],
    // this should be call at the beginning
    initData : (statuses: ProjectStatus[]) =>  {
        set({ statuses });
    },
    
    getStatusById: (id: string) => {
        return get().statuses.find(status => status.id === id);
    }
}));