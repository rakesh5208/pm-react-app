import { useCurrentAccountStore } from '@/stores/current-account'

const AccountsBranding = () => {
    const { currentAccount } = useCurrentAccountStore();
    if (!currentAccount) {
        return null;
    }
    return (
        <div>
            <section>
                <h2 className="text-lg font-semibold pb-2 border-b border-card-background border-dashed">Customize account branding</h2>
                <div className="gap-3 py-4 rounded-md grid sm:grid-cols-3">
                    <div>
                        <label className="font-semibold"> Logo </label>
                        <p className="text-prop text-page-secondary-foreground"> {currentAccount.settings.branding.logoUrl}</p>
                    </div>
                    <div>
                        <label className="font-semibold"> Color </label>
                        <p className="text-prop text-page-secondary-foreground"> {currentAccount.settings.branding.colorScheme}</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AccountsBranding