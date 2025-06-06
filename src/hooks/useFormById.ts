import { useEffect, useMemo, useState } from "react";
import { useFormsStore } from "../stores/form"

export const useFormById = (id: string) => {
    const { forms, isLoading,  fetchFormById, error } = useFormsStore();
    const [formLoaded, setFormLoaded] = useState(false);
    
    // get form from store cache
    const form = useMemo(() => {
        return forms.find((form) => form.id === id);
    }, [forms, id]);

    useEffect(() => {
        // load the form if form not found in the cache
        if(!form && !formLoaded) {
            fetchFormById(id).then(() => setFormLoaded(true))
        }
    }, [form, fetchFormById, setFormLoaded, id, formLoaded])
    
    return {
        form,
        isFormLoading: isLoading && !form,
        error
    }
}