import { STORAGE_KEY_ROOT_PREFIX } from "../constants/local-storage-keys";

const resolveKeyName = (key:string) => {
    return `${STORAGE_KEY_ROOT_PREFIX}${key}`;
}

const setItem = (key: string, value: string) => {
    localStorage.setItem( resolveKeyName(key), value);
}

const getItem =  (key: string) => {
    return localStorage.getItem(resolveKeyName(key));
}

const removeItem = (key: string) => {
    return localStorage.removeItem(resolveKeyName(key))
}

export default {
    setItem,
    getItem,
    removeItem
}
