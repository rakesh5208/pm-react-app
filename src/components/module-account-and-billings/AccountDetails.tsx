import { useCurrentAccountStore } from "@/stores/current-account";

const AccountDetails = () => {
  const { currentAccount } = useCurrentAccountStore();
  
  if(!currentAccount) {
    return null;
  }
  return (
    <div className="text-sm flex flex-col gap-10">
        <section>
            <h2 className="text-lg font-semibold pb-2 border-b border-card-background border-dashed">Account Details</h2>
            <div className="gap-3 py-4 rounded-md grid sm:grid-cols-3">
                <div>
                    <label className="font-semibold"> Name </label>
                    <p className="text-prop text-page-secondary-foreground"> { currentAccount.name }</p>
                </div>
                <div>
                    <label className="font-semibold"> Currency </label>
                    <p className="text-prop text-page-secondary-foreground"> { currentAccount.settings.currency }</p>
                </div>
                <div>
                    <label className="font-semibold"> Timezone </label>
                    <p className="text-prop text-page-secondary-foreground"> { currentAccount.settings.timezone }</p>
                </div>
                
                <div>
                    <label className="font-semibold"> Date Format </label>
                    <p className="text-prop text-page-secondary-foreground"> { currentAccount.settings.dateFormat }</p>
                </div>
                <div>
                    <label className="font-semibold"> Time Format </label>
                    <p className="text-prop text-page-secondary-foreground"> { currentAccount.settings.timeFormat }</p>
                </div>
            </div>
        </section>

        <section>
            <h2 className="text-lg font-semibold pb-2 border-b border-card-background border-dashed"></h2>
            <div className="gap-3 py-4 rounded-md grid sm:grid-cols-3">
                <button type="button">Delete Account </button>
            </div>
        </section>
    </div>
  )
}

export default AccountDetails;