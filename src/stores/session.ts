
import { create } from "zustand";
import { STORAGE_KEYS } from "../constants/local-storage-keys";
import { initSessionFromStore } from "../utils/init-store";
import storage from "../utils/storage";

export type SessionStore = {
    isLoading: boolean;
    isLoginRequested: boolean;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    error: any;
    fetchSession: () => Promise<void>;
    logout: () => Promise<void>;
    login: () => Promise<void>;
}

export const useSessionStore = create<SessionStore>()((set) => ({
    account: null,
    user: null,
    isLoading: false,
    isLoginRequested: false,
    error: null,
    fetchSession: async () => {
        try {
            set({ isLoading: true, error: null });

            await new Promise(resolve => setTimeout(resolve, 500));
            const storedSession = storage.getItem(STORAGE_KEYS.SESSION);
            if (!storedSession) {
                set({ isLoading: false });
                return;
            }
            const data = JSON.parse(storedSession);
            initSessionFromStore(data.account, data.user);
            set({ isLoading: false });

        } catch (error) {
            set({ isLoading: false, error: error });
        }
    },
    
    logout: async () => {
        initSessionFromStore(null, null);
        storage.removeItem(STORAGE_KEYS.SESSION);
    },
    
    login: async () => {
        try {
            set({ isLoginRequested: true, error: null });

            await new Promise(resolve => setTimeout(resolve, 500));
            const response = await fetch('/public/mocks/session.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Session data fetched:', data);
            storage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(data));

            initSessionFromStore(data.account, data.user);
            set({ isLoginRequested: false });
        } catch (error) {
            set({ isLoginRequested: false, error });
        }
    }
}));
