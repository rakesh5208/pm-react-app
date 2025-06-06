import { create } from "zustand";
import type { User } from "../types/user";
import { createUserHelper } from "../utils/user-helper";

export type CurrentUserStore = {
    currentUser: User | null;
    setCurrentUser: (user: User | null) =>  void
}

export const useCurrentUserStore = create<CurrentUserStore>()((set) =>({
    currentUser: null,

    setCurrentUser: (user: User | null) => {
        set({ currentUser: user ? createUserHelper(user) :  user });
    }
}));