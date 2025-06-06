import type { Account } from "../types/account";
import type { User } from "../types/user";

interface AdminSettingSection {
    id: string;
    label: string;
    position: number;
    subsections: Array<{ id: string, label: string, hasAccess: boolean, path: string }>;
}

const AdminSettingSections = {
    ACCOUNTS_AND_BILLING: { id: 'accounts-and-billing', label: 'Accounts and Billing', position: 1 },
    ACCOUNT_LEVEL_FORMS_MANAGEMENT: { id: 'account-level-forms-management', label: 'Forms Management', position: 3 },
    USER_AND_ROLE_MANAGEMENT: { id: 'user-and-role-management', label: 'User and Role Management', position: 2 },
    INTEGRATIONS: { id: 'integrations', label: 'Integrations', position: 4 },
    BRANDING: { id: 'branding', label: 'Branding and Customization', position: 5 },
    AUDIT_LOGS: { id: 'audit-logs', label: 'Audit Logs', position: 6 },

}

export const settingRouteConfigs = (currentUser: User | null, currentAccount: Account | null) => {
    const hasManageSettingPermission = !!currentUser?.hasPermission('manage:admin_settings');
    return [
        // Account Level Forms Management Section
        { id: 'project-forms', label: 'Project Forms', hasAccess: hasManageSettingPermission, path: '/admin-settings/project-forms', section: AdminSettingSections.ACCOUNT_LEVEL_FORMS_MANAGEMENT },
        { id: 'user-forms', label: 'User Forms', hasAccess: hasManageSettingPermission, path: '/admin-settings/user-forms', section: AdminSettingSections.ACCOUNT_LEVEL_FORMS_MANAGEMENT },

        // User and Role Management Section
        { id: 'Users', label: 'Users', hasAccess: hasManageSettingPermission, path: '/admin-settings/users', section: AdminSettingSections.USER_AND_ROLE_MANAGEMENT },
        { id: 'Roles', label: 'Roles', hasAccess: hasManageSettingPermission, path: '/admin-settings/roles', section: AdminSettingSections.USER_AND_ROLE_MANAGEMENT },
        
        // Integrations Section
        { id: 'github', label: 'GitHub', hasAccess: hasManageSettingPermission && !!currentAccount?.isIntegrationEnabled('github'), path: '/admin-settings/github', section: AdminSettingSections.INTEGRATIONS },
        { id: 'gitlab', label: 'GitLab', hasAccess: hasManageSettingPermission && !!currentAccount?.isIntegrationEnabled('gitlab'), path: '/admin-settings/gitlab', section: AdminSettingSections.INTEGRATIONS },
        { id: 'jira', label: 'Jira', hasAccess: hasManageSettingPermission && !!currentAccount?.isIntegrationEnabled('jira'), path: '/admin-settings/jira', section: AdminSettingSections.INTEGRATIONS },
        { id: 'slack', label: 'Slack', hasAccess: hasManageSettingPermission && !!currentAccount?.isIntegrationEnabled('slack'), path: '/admin-settings/slack', section: AdminSettingSections.INTEGRATIONS },

        // Branding and Customization Section
        { id: 'themes', label: 'Themes', hasAccess: hasManageSettingPermission && !!currentAccount?.hasFeature('branding_customization'), path: '/admin-settings/themes', section: AdminSettingSections.BRANDING },

        // Audit Logs Section
        { id: 'audit-logs', label: 'Audit Logs', hasAccess: hasManageSettingPermission && !!currentAccount?.hasFeature('audit_logs'), path: '/admin-settings/audit-logs', section: AdminSettingSections.AUDIT_LOGS },

        // Accounts and Billing Section
        { id: 'billing', label: 'Billing', hasAccess: hasManageSettingPermission, path: '/admin-settings/plans-billings', section: AdminSettingSections.ACCOUNTS_AND_BILLING },
        { id: 'accounts', label: 'Accounts', hasAccess: hasManageSettingPermission, path: '/admin-settings/accounts', section: AdminSettingSections.ACCOUNTS_AND_BILLING },

    ]
}
export function buildSettingsSections(currentUser: User | null, currentAccount: Account | null): Array<AdminSettingSection> {
    // filter configs
    const filteredSettingPaths = settingRouteConfigs(currentUser, currentAccount).filter(config => config.hasAccess);
    const configAsObject = filteredSettingPaths.reduce((acc, config) => {
        const sectionId = config.section.id;
        if (acc[sectionId]) {
            acc[sectionId].subsections.push(config);
        } else {
            acc[sectionId] = { ...config.section, subsections: [config] };
        }
        return acc
    }, {} as Record<string, AdminSettingSection>);
    return Object.values(configAsObject).sort((a: AdminSettingSection, b: AdminSettingSection) => a.position - b.position);
}