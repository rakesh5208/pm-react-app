import type { User } from "../types/user";

export const createUserHelper = (user: User) => {
    return {
        ...user,
        hasPermission: (permission:string):boolean => {
            return user?.permissions.includes(permission) || false;
        }
    }
}