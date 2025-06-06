// export type Billing = {
//     id: string;
//     amount: number;
//     cycle: 'monthly' | 'yearly';
//     status: 'paid' | 'unpaid' | 'overdue';
//     paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
//     address?: {
//         street: string;
//         city: string;
//         state: string;
//         zip: string;
//         country: string;
//     }
// }
import type { User } from './user';

export type Subscription = {
    type: 'free' | 'premium' | 'enterprise';
    status: 'active' | 'inactive' | 'expired';
    expiryDate?: string; // Optional for free accounts
}

export type AccountBranding = {
    logoUrl:string;
    colorScheme:string;
}

export type AccountSettings = {
    timezone: string;
    currency: string;
    timeFormat: '12-hour' | '24-hour';
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    branding: AccountBranding;
}

export type AccountIntegration = {
    id: string;
    name: string;
    enabled: boolean; // Whether the integration is enabled
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additionalConfig?: Record<string, any>; // Additional configuration options for the integration
}

export type Account = {
    id: string;
    name: string;
    subscription: Subscription
    settings: AccountSettings;
    features: string[];
    integrations: AccountIntegration[];
    createdAt: string; 
    updatedAt: string;
    owner: User,
    hasFeature: (feature: string) => boolean,
    isIntegrationEnabled: (name: string) => boolean;
};