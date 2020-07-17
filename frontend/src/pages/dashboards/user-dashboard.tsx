import React from "react";
import { Heading } from "andculturecode-javascript-react-components";
import { SkipNavContent } from "@reach/skip-nav";

/*
---------------------------------------------------------------------------------------------
Interfaces
---------------------------------------------------------------------------------------------
*/

interface UserDashboardPageProps {}

/*
---------------------------------------------------------------------------------------------
Component
---------------------------------------------------------------------------------------------
*/

const UserDashboardPage: React.FC<UserDashboardPageProps> = () => {
    return (
        <React.Fragment>
            <div className="c-dashboard">
                <SkipNavContent>
                    <div className="c-dashboard__panel -left" tabIndex={-1}>
                        <Heading priority={3}>User Dashboard</Heading>
                    </div>
                </SkipNavContent>
                <div className="c-dashboard__panel -right"></div>
            </div>
        </React.Fragment>
    );
};

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default UserDashboardPage;
