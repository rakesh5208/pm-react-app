import { useEffect } from 'react'
import { useSessionStore } from './stores/session'

import { Route, Routes } from 'react-router'
import { toast } from 'react-toastify'


import AppLayout from '@/components/common/AppLayout.tsx'
import PublicRoute from '@/components/common/PublicRoute.tsx'
import ProtectedRoute from '@/components/common/ProtectedRoute.tsx'

import HomePage from '@/routes/HomePage.tsx'

import ProjectListPage from '@/routes/projects/ListPage.tsx';
import ProjectShowPage from '@/routes/projects/ShowPage.tsx';

import LoginPage from '@/routes/LoginPage.tsx'
import IndexPage from '@/routes/IndexPage.tsx';

import AdminSettingIndexPage from '@/routes/admin-settings/AdminSettingIndexPage.tsx';
import AccountPage from "@/routes/admin-settings/account-and-billings/AccountPage.tsx";
import PlanAndBillingsPage from "@/routes/admin-settings/account-and-billings/PlanAndBillingsPage.tsx";
import AuditLogsPage from "@/routes/admin-settings/audit-logs/AuditLogsPage.tsx";
import ThemesPage from "@/routes/admin-settings/branding-customizations/ThemesPage.tsx";
import GithubPage from "@/routes/admin-settings/devops-and-integrations/GithubPage.tsx";
import GitLabPage from "@/routes/admin-settings/devops-and-integrations/GitLabPage.tsx";
import JiraPage from "@/routes/admin-settings/devops-and-integrations/JiraPage.tsx";
import SlackPage from "@/routes/admin-settings/devops-and-integrations/SlackPage.tsx";
import ProjectFormsPage from "@/routes/admin-settings/manage-account-level-forms/ProjectFormsPage.tsx";
import UserFormsPage from "@/routes/admin-settings/manage-account-level-forms/UserFormsPage.tsx";
import RolesPage from "@/routes/admin-settings/users-roles-management/RolesPage.tsx";
import UsersPage from "@/routes/admin-settings/users-roles-management/UsersPage.tsx";
import WorkspaceIndexPage from '@/routes/workspace/WorkspaceIndexPage.tsx';
import TasksListPage from '@/routes/workspace/tasks/TasksListPage.tsx';
import TaskNewPage from '@/routes/workspace/tasks/TaskNewPage.tsx';
import TaskShowPage from '@/routes/workspace/tasks/TaskShowPage.tsx';
import SprintListPage from '@/routes/workspace/sprints/SprintListPage.tsx';
import SprintNewPage from '@/routes/workspace/sprints/SprintNewPage.tsx';
import SprintShowPage from '@/routes/workspace/sprints/SprintShowPage.tsx';
import SprintBoardSettings from '@/routes/workspace/sprints/SprintBoardSettingsPage.tsx';
import WorkspaceResolvePage from '@/routes/workspace/WorkspaceResolvePage.tsx';
import { loadPredefinedDataToStore } from './constants/predefined-data.ts';
import { useCurrentAccountStore } from './stores/current-account.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkIntegration = ({ currentAccount, currentUser, integrationName }: any) => {
  return currentUser.hasPermission('manage:admin_settings') && currentAccount.isIntegrationEnabled(integrationName);
}

function App() {
  const { isLoading, error, fetchSession } = useSessionStore();
  const { currentAccount, brandingConfigs, fetchAccountBrandingConfigs, isLoadingBrandingConfig } = useCurrentAccountStore();
  useEffect(() => {
    // initiate predefined data to store
    loadPredefinedDataToStore();
    // fetch session
    fetchSession();

  }, [])

  useEffect(() => {
    // fetch branding data
    fetchAccountBrandingConfigs();
  },[currentAccount, fetchAccountBrandingConfigs]);

  if ((isLoading && !currentAccount) || (isLoadingBrandingConfig || !brandingConfigs) ) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  } else if (error) {
    console.error('Error fetching session:', error);
    toast('Error Occurred while fetching session', {type: 'error'})
  }

  return (
    <Routes>
      <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />


      {/* protected routes */}
      <Route index element={<ProtectedRoute>
        <IndexPage />
      </ProtectedRoute>} />
      {/* app layout routes */}
      <Route element={<AppLayout />}>
        <Route path="home" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} />
        <Route path="projects">
          <Route index element={<ProtectedRoute> <ProjectListPage /></ProtectedRoute>}/>
          <Route path=":id" element={<ProtectedRoute> <ProjectShowPage /></ProtectedRoute>}/>
        </Route>

        <Route path="ws/:key" element = {<WorkspaceResolvePage/>}>
          <Route index element = {<ProtectedRoute><WorkspaceIndexPage/></ProtectedRoute>}/>
          <Route path = "tasks">
            <Route index element = {<ProtectedRoute><TasksListPage/></ProtectedRoute>} />
            <Route path=":id" element = {<ProtectedRoute><TaskShowPage/></ProtectedRoute>} />
            <Route path="new" element = {<ProtectedRoute><TaskNewPage/></ProtectedRoute>} />
          </Route>

          <Route path="sprints">
            <Route index element = {<ProtectedRoute><SprintListPage/></ProtectedRoute>} />
            <Route path="new" element = {<ProtectedRoute><SprintNewPage/></ProtectedRoute>} />
            <Route path=":id">
              <Route index element = {<ProtectedRoute><SprintShowPage/></ProtectedRoute>} />
              <Route path="board-settings" element = { <ProtectedRoute> <SprintBoardSettings/></ProtectedRoute> }/>
            </Route>
          </Route>
        </Route>

        {/* Admin settings routes */}
        <Route path="admin-settings" >
          <Route index element={<ProtectedRoute permission="manage:admin_settings"><AdminSettingIndexPage /></ProtectedRoute>} />

          {/* nested routes for admin settings */}
          <Route path="project-forms" element={<ProtectedRoute permission="manage:admin_settings"> <ProjectFormsPage /> </ProtectedRoute>} />
          <Route path="user-forms" element={<ProtectedRoute permission="manage:admin_settings"> <UserFormsPage /> </ProtectedRoute>} />

          <Route path="users" element={<ProtectedRoute permission="manage:admin_settings"><UsersPage /></ProtectedRoute>} />
          <Route path="roles" element={<ProtectedRoute permission="manage:admin_settings"><RolesPage /> </ProtectedRoute>} />

          <Route path="github" element={<ProtectedRoute customIsAccessible={(opts) => checkIntegration({ ...opts, integrationName: 'github'})}> <GithubPage /></ProtectedRoute>} />
          <Route path="gitlab" element={<ProtectedRoute customIsAccessible={(opts) => checkIntegration({ ...opts, integrationName: 'gitlab'})}> <GitLabPage /></ProtectedRoute>} />
          <Route path="jira" element={<ProtectedRoute customIsAccessible={(opts) => checkIntegration({ ...opts, integrationName: 'jira'})}> <JiraPage /> </ProtectedRoute>} />
          <Route path="slack" element={<ProtectedRoute customIsAccessible={(opts) => checkIntegration({ ...opts, integrationName: 'slack'})}> <SlackPage /></ProtectedRoute>} />
          
          <Route path="themes" element={<ProtectedRoute permission="manage:admin_settings" feature='branding_customization'> <ThemesPage /> </ProtectedRoute>} />

          <Route path="audit-logs" element={<ProtectedRoute permission="manage:admin_settings" feature='audit_logs'> <AuditLogsPage /> </ProtectedRoute>} />

          <Route path="plans-billings" element={<ProtectedRoute permission="manage:admin_settings"> <PlanAndBillingsPage /></ProtectedRoute>} />
          <Route path="accounts" element={<ProtectedRoute permission="manage:admin_settings"> <AccountPage /> </ProtectedRoute>} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
