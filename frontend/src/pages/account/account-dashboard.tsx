import React from "react";
import Heading from "atoms/typography/heading";
import { HeadingPriority } from "atoms/constants/heading-priority";
import { SkipNavContent } from "@reach/skip-nav";
import { useGlobalState } from "utilities/contexts/use-global-state-context";
import { siteMap } from "sitemap";
import RouteTabs from "molecules/route-tabs/route-tabs";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

interface AccountDashboardPageProps {}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const AccountDashboardPage: React.FC<AccountDashboardPageProps> = (
    props: any
) => {
    const { globalState } = useGlobalState();
    const cssClassName = "c-account-dashboard";

    let tabs = [
        {
            route: siteMap.account.information,
            label: "Your Information",
        },
    ];
    if (globalState.currentIdentity?.userIsTeamMember()) {
        tabs.push({
            route: siteMap.account.team,
            label: globalState.currentIdentity.userIsTeamAdmin()
                ? "Team Management"
                : "Your Team",
        });
    }
    return (
        <React.Fragment>
            <SkipNavContent>
                <div className={cssClassName} tabIndex={-1}>
                    <Heading priority={HeadingPriority.Four}>
                        Account Settings
                    </Heading>
                    <RouteTabs routes={props.routes} tabs={tabs} />
                </div>
            </SkipNavContent>
        </React.Fragment>
    );
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default AccountDashboardPage;

// #endregion Exports
