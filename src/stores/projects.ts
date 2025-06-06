import { create } from "zustand";
import type { Project } from "../types/project";

interface ProjectStore {
    projects: Project[];
    projectInShowPage: Project | null,
    workspaceSelectedProject: Project | null,
    isLoading: boolean;
    isResolvingProject: boolean;
    fetchProjects: () => Promise<void>,
    fetchProjectById: (id: string) => Promise<void>,
    fetchProjectByKey: (key: string) => Promise<void>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
}
export const useProjectStore = create<ProjectStore>()((set, get) => ({
    projects: [],
    projectInShowPage: null,
    workspaceSelectedProject: null,
    isLoading: true,
    isResolvingProject: false,
    error: null,
    
    addProject: (project: Project) => {
        set((state) => ({
            projects: [...state.projects, project]
        }));
    },
    
    fetchProjects: async () => {
        try {
            set({ isLoading : true, error: null });
            // mimic wait time
            await new Promise(resolve => setTimeout(resolve, 500));
            const response = await fetch('/public/mocks/projects.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Project[] = await response.json();
            set({ projects: data });
        } catch (error) {
            set({ error }); 
        } finally {
            set({isLoading: false})
        }
    },

    fetchProjectById: async (id: string) => {
        try {
            set({ isLoading : true, error: null, projectInShowPage: null });
            // mimic wait time
            await new Promise(resolve => setTimeout(resolve, 500));

            // mimic the fetch projects, just for the local search, in real world it will be directly call the /projects/123 get api call
            if(get().projects.length == 0) {
                await get().fetchProjects();
            } 

            const project = get().projects.find((project) => project.id === id );
            // if not found throw error, ideally it will be thrown by api / return 404 api response
            if(!project) {
                throw new Error('Project not found for the id ' + id);
            }
            set( { projectInShowPage: project });
        } catch(error) {
            set({error }); 
        }finally {
            set({ isLoading: false });
        }
    },

    fetchProjectByKey: async(key: string) => {
        try {
            set({ isResolvingProject : true, error: null, workspaceSelectedProject: null });
            // mimic wait time
            await new Promise(resolve => setTimeout(resolve, 500));

            // mimic the fetch projects, just for the local search, in real world it will be directly call the /projects/123 get api call
            if(get().projects.length == 0) {
                await get().fetchProjects();
            } 

            const project = get().projects.find((project) => project.key === key );
            // if not found throw error, ideally it will be thrown by api / return 404 api response
            if(!project) {
                throw new Error('Project not found for the id ' + key);
            }
            console.log("workspaceSelectedProject store >> >>", project)
            set( { workspaceSelectedProject: project });
        } catch(error) {
            set({error }); 
        }finally {
            set({ isResolvingProject: false });
        }
    },
}))