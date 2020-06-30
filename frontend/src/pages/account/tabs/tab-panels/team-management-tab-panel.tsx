import React from "react";
import { useGlobalState } from "utilities/contexts/use-global-state-context";
import GroupInviteCard from "organisms/group-invite-card/group-invite-card";
import useUserRoleGroups from "utilities/hooks/domain/user-role-groups/use-user-role-groups";
import UserRoleGroupRecord from "models/view-models/user-role-group-record";
import UserRoleGroupRow from "organisms/user-role-groups/user-role-group-row";
import { DeleteService } from "utilities/services/service-factory";
import UserRoleGroupService from "utilities/services/user-role-groups/user-role-group-service";
import ResultRecord from "models/view-models/result-record";
import { ToastManager } from "utilities/toast/toast-manager";
import Loader from "atoms/loaders/loader";
import { Redirect } from "react-router-dom";
import { siteMap } from "sitemap";
import useRefreshIdentity from "utilities/hooks/use-refresh-identity";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

interface TeamManagementTabPanelProps {}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const BASE_CLASS = "c-account-dashboard__team-management";
const ERROR_DELETING_USERROLEGROUP =
    "There was an error removing this user. Please try again.";

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const TeamManagementTabPanel: React.FC<TeamManagementTabPanelProps> = () => {
    const { globalState } = useGlobalState();
    const currentUserRoleGroup =
        globalState.currentIdentity?.userRoles.find(
            (ur) => ur.id === globalState.currentIdentity?.userLogin?.userRoleId
        )?.userRoleGroup ?? new UserRoleGroupRecord();

    const magicLinkUrlTemplate = `${
        globalState.systemSettings?.groupInvitiationsBaseUrl
    }/group/${
        currentUserRoleGroup?.group?.id
    }/invitation/:token?invitedBy=${globalState.currentIdentity?.user?.getFirstAndLastName()}&teamName=${
        currentUserRoleGroup?.group?.name
    }`;

    const { delete: deleteApi } = UserRoleGroupService.useDelete();

    // Page errors + API service hooks
    useRefreshIdentity();
    const {
        loaded,
        loading,
        refresh: refreshUserRoleGroups,
        resultObject: userRoleGroups,
    } = useUserRoleGroups(currentUserRoleGroup.groupId, true);
    const teamMemberCount = userRoleGroups?.length ?? 0;

    if (
        globalState.currentIdentity != null &&
        !globalState.currentIdentity.userIsTeamMember()
    ) {
        return <Redirect to={siteMap.account.information} />;
    }

    return (
        <div className={BASE_CLASS}>
            <div className={`${BASE_CLASS}__team-name`}>
                {currentUserRoleGroup?.group?.name ?? "Team name not available"}
            </div>
            {currentUserRoleGroup?.isAdmin && (
                <GroupInviteCard
                    group={currentUserRoleGroup?.group!}
                    magicLinkUrlTemplate={encodeURI(magicLinkUrlTemplate)}
                    userRoleGroups={userRoleGroups}
                />
            )}
            <div className={`${BASE_CLASS}__team-members`}>
                <div className={`${BASE_CLASS}__team-members__title`}>
                    {loaded ? `${teamMemberCount} ` : "-- "}
                    {`Team Member${teamMemberCount > 1 ? "s" : ""}`}
                </div>
                {loading && <Loader accessibleText="Loading team members..." />}
                {!loading && loaded && (
                    <React.Fragment>
                        {userRoleGroups?.map(
                            (userRoleGroup: UserRoleGroupRecord) => (
                                <UserRoleGroupRow
                                    currentUserRoleGroup={currentUserRoleGroup}
                                    key={userRoleGroup.id}
                                    onDelete={() => {
                                        handleDeleteUserRoleGroup(
                                            deleteApi,
                                            refreshUserRoleGroups,
                                            userRoleGroup
                                        );
                                    }}
                                    userRoleGroup={userRoleGroup}
                                />
                            )
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Functions
// -----------------------------------------------------------------------------------------

const getSuccessMessage = (userRoleGroup: UserRoleGroupRecord): string => {
    const user = userRoleGroup.userRole?.user;
    if (user == null) {
        return "Succesfully removed user from the team.";
    }

    return `Successfully removed ${user.getFirstAndLastName()} from the team.`;
};

const handleDeleteUserRoleGroup = async (
    deleteApi: DeleteService,
    refreshUserRoleGroups: () => void,
    userRoleGroup: UserRoleGroupRecord
) => {
    try {
        await deleteApi(userRoleGroup.id ?? 0);
    } catch (error) {
        // If there are specific errors from the API, lets use those.
        if (error instanceof ResultRecord && error.hasErrors()) {
            ToastManager.error(error.listErrorMessages());
            return;
        }

        ToastManager.error(ERROR_DELETING_USERROLEGROUP);
        return;
    }

    refreshUserRoleGroups();
    ToastManager.success(getSuccessMessage(userRoleGroup));
};

// #endregion Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default TeamManagementTabPanel;

// #endregion Exports
