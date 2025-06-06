import { create } from "zustand";
import type { Form } from "../types/form";

// just for mock form fetch
const FormIdMapMockMap: Record<string, string> = {
    project_form: '/mocks/project_form.json',
    master_task_form: '/mocks/master_task_form.json'
};

interface FormStoreType {
    forms: Form[],
    isLoading: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    fetchFormById: (id: string) => Promise<void>
}

export const useFormsStore = create<FormStoreType>()((set, get)=>({
    forms: [],
    isLoading: false,
    error: null,

    fetchFormById: async (id: string) => {
        try {
            set({ isLoading: true, error: null });
            await new Promise(resolve => setTimeout(resolve, 500));
            const response = await fetch(`${FormIdMapMockMap[id]}`);
            const data = await response.json();
            
            if(!response.ok) {
                throw new Error('Form response is not ok');
            }
            
            const filteredForms = get().forms.filter((form) => form.id !== id );
            set({forms: [
                ...filteredForms,
                data
            ]})
        }catch(err) {
            set( {error: err});
        } finally {
            set({isLoading: false})
        }
    },
}));