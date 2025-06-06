
export type UserPreferences = {
    theme: 'light' | 'dark' | 'system'
    language: string; 
    notifications: boolean;
    timezone?: string;
}
export type User = {
    id: string;
    name: string;
    email: string;
    permissions: string[]; // Array of permission strings
    preferences: UserPreferences;
    createdAt?: string;
    updatedAt?: string; 
    avatarUrl?: string; 
    isActive: boolean,
    hasPermission: (permission: string) => boolean
}
