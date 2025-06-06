import type { Account } from "../types/account";

export const createAccountHelper = (account: Account) => {
    return {
        ...account,
        hasFeature: (feature:string):boolean => {
            return account?.features.includes(feature) || false;
        },
        isIntegrationEnabled: (name: string) => {
            const integration = account.integrations.find((integration) => integration.name === name);
            return account && !!integration && integration.enabled
        }

    }
}