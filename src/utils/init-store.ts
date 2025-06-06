import { useCurrentAccountStore } from "../stores/current-account";
import { useCurrentUserStore } from "../stores/current-user";

import type { Account } from "../types/account";
import type { User } from "../types/user";

export const initSessionFromStore = (account: Account | null, user: User | null) => {
    useCurrentAccountStore.getState().setCurrentAccount(account);
    useCurrentUserStore.getState().setCurrentUser(user);
}