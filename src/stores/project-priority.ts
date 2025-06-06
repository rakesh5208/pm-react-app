import { create } from "zustand";
import type { ProjectPriority } from "../types/project";

export interface ProjectPriorityStore {
    priorities: ProjectPriority[];
    initData: (priorities: ProjectPriority[]) => void
    getPriorityById: (id: string) => ProjectPriority | undefined;
}

export const useProjectPriorityStore = create<ProjectPriorityStore>((set, get) => ({
    priorities: [ ],

    // this should be call at the beginning
    initData : (priorities: ProjectPriority[]) =>  {
        set({ priorities });
    },

    getPriorityById: (id: string) => {
        return get().priorities.find(priority => priority.id === id);
    }
}))