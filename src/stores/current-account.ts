import { create } from "zustand";
import type { Account } from "../types/account";
import { createAccountHelper } from "../utils/account-helper";

export type AccountStore = {
    currentAccount: Account | null;
    isLoadingBrandingConfig: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    brandingConfigs: any ;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    brandingFetchedError: any;
    setCurrentAccount: (account: Account | null) =>  void;
    fetchAccountBrandingConfigs: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateBranding: (data: any) => void
}

export const useCurrentAccountStore = create<AccountStore>()((set, get) =>({
    currentAccount: null,
    isLoadingBrandingConfig: false,
    brandingConfigs: null,
    brandingFetchedError: null,

    setCurrentAccount: (account: Account | null) => {
        set({ currentAccount: account ? createAccountHelper(account) : account })
    },

    fetchAccountBrandingConfigs: async () => {
        try {
            const isFeatureEnabled  = get().currentAccount?.hasFeature('branding_customization');
            if(!isFeatureEnabled) {
                // setting as empty object, in case the branding feature not enabled to make sure we are setting state
                set({ brandingConfigs: {} });
                return;
            }
            
            set({ isLoadingBrandingConfig: true });
            await new Promise(resolve => setTimeout(resolve, 500));
            const response = await fetch('/public/mocks/branding.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set({brandingConfigs : data });
            const headDom = document.querySelector('#pm-react-app head');
            if (headDom) {
                const brandingStyles = Object.keys(data).map((key) => `${key}: ${data[key]}`).join(';');
                const brandingStyleDom = document.createElement('style');
                brandingStyleDom.setAttribute('type', 'text/css');
                brandingStyleDom.setAttribute('id', 'customer-branding-style-vars');
                brandingStyleDom.innerText = `:root { ${brandingStyles} }`;
                headDom.appendChild(brandingStyleDom)
            }
        } catch (error) {
            set({ brandingFetchedError: error })
        } finally {
            set({ isLoadingBrandingConfig: false })
        }
    },

    updateBranding: (data) => {
        set({brandingConfigs: data});
    }
}));