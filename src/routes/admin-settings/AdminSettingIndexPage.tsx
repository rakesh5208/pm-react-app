import { useMemo } from 'react'
import { buildSettingsSections } from '@/constants/admin-setting-routes-config';
import { Link } from 'react-router';
import { useCurrentAccountStore } from '@/stores/current-account';
import { useCurrentUserStore } from '@/stores/current-user';
const AdminSettingIndexPage = () => {
    const {currentAccount } = useCurrentAccountStore();
    const { currentUser } = useCurrentUserStore();

    const sections = useMemo(() => buildSettingsSections(currentUser, currentAccount), [currentUser, currentAccount]);
    return (
        <div className='flex flex-col gap-8'>
            {sections.map(section => {
                return (
                    <div key={section.id} className="flex flex-col gap-4">
                        <h2 className='text-2xl font-semibold'>{section.label}</h2>
                        <div className='flex gap-4'>
                            {
                                section.subsections.map(subsection => {
                                    return (
                                        <Link key={subsection.id} to ={subsection.path} className='min-h-10 w-56 rounded p-2 bg-card-background hover:bg-card-hover'>
                                            {subsection.label}
                                        </Link>
                                    )
                                }
                                )
                            }
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default AdminSettingIndexPage;