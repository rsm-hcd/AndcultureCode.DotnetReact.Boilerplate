import {
    Anchor,
    CheckboxFormField,
    Form,
    Heading,
    HeadingPriority,
    InputFormField,
    PasswordFormField,
    SubmitButton,
    Paragraph,
    InputTypes,
} from "andculturecode-javascript-react-components";
import * as React from "react";
import { useState } from "react";
import { siteMap } from "sitemap";
import {
    useLocalization,
    usePageErrors,
} from "andculturecode-javascript-react";
import { RouteUtils } from "utilities/route-utils";
import { CollectionUtils, StringUtils } from "andculturecode-javascript-core";
import CultureResources from "utilities/interfaces/culture-resources";
import UserLoginService from "utilities/services/user-login-service";
import UserLoginRecord from "models/view-models/user-login-record";
import useIdentity from "utilities/hooks/use-identity";
import { useGlobalState } from "utilities/contexts/use-global-state-context";
import IdentityRecord from "models/view-models/identity-record";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const COMPONENT_CLASS = "c-userlogin-new-form";

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

interface NewUserLoginFormProps {
    buttonText?: string;

    /**
     * Optional callback that will be fired after successfully logging in the user.
     */
    onSuccess?: (identity: IdentityRecord) => void;

    showLogo?: boolean;
    showTitle?: boolean;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const NewUserLoginForm: React.FunctionComponent<NewUserLoginFormProps> = (
    props: NewUserLoginFormProps
) => {
    // -----------------------------------------------------------------------------------------
    // #region Properties
    // -----------------------------------------------------------------------------------------

    const { create } = UserLoginService.useCreate();
    const { setGlobalState } = useGlobalState();
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const { setPageErrors, pageErrors, resetPageErrors } = usePageErrors();
    const [signingIn, setSigningIn] = useState(false);
    const { t } = useLocalization<CultureResources>();
    const { getIdentity } = useIdentity();
    const [userName, setUserName] = useState("");
    const [userNameError, setUserNameError] = useState("");

    const showTitle = props.showTitle !== false;

    // #endregion Properties

    // -----------------------------------------------------------------------------------------
    // #region Private Functions
    // -----------------------------------------------------------------------------------------

    const createUserLogin = async (): Promise<UserLoginRecord> => {
        const login = new UserLoginRecord({ password, userName });
        const response = await create(login);
        return response.result!.resultObject;
    };

    const resetErrors = () => {
        setUserNameError("");
        setPasswordError("");
    };

    const signIn = async (): Promise<IdentityRecord | undefined> => {
        try {
            const userLogin = await createUserLogin();
            const identity = await getIdentity(userLogin);

            if (identity == null) {
                return;
            }

            return identity;
        } catch {
            return;
        }
    };

    const validate = () => {
        resetErrors();
        let hasErrors = false;

        if (StringUtils.isEmpty(password)) {
            setPasswordError(t("propertyIsRequired", { name: "Password" }));
            hasErrors = true;
        }

        if (StringUtils.isEmpty(userName)) {
            setUserNameError(t("propertyIsRequired", { name: "Username" }));
            hasErrors = true;
        }

        return !hasErrors;
    };

    // #endregion Private Functions

    // -----------------------------------------------------------------------------------------
    // #region Event Handlers
    // -----------------------------------------------------------------------------------------

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSigningIn(true);

        // Validate
        if (!validate()) {
            setSigningIn(false);
            return;
        }
        resetPageErrors();

        // Sign-in
        const identity = await signIn();
        if (identity == null) {
            setSigningIn(false);
            setPageErrors([t("errorSigningIn")]);
            return;
        }

        setGlobalState((state) => state.setIdentity(identity));
        props.onSuccess?.(identity);
    };

    // #endregion Event Handlers

    return (
        <div className={COMPONENT_CLASS}>
            {// if
            showTitle && (
                <Heading priority={HeadingPriority.One}>{t("signIn")}</Heading>
            )}
            <Form onSubmit={handleSubmit} buttonText={t("signIn")}>
                <InputFormField
                    disabled={signingIn}
                    errorMessage={userNameError}
                    inputTestId="userName"
                    isValid={StringUtils.isEmpty(userNameError)}
                    label={t("userName")}
                    maxLength={100}
                    onChange={(e) => setUserName(e.target.value)}
                    required={true}
                    showCharacterCount={false}
                    type={InputTypes.Text}
                    value={userName}
                />
                <PasswordFormField
                    disabled={signingIn}
                    errorMessage={passwordError}
                    inputTestId="password"
                    isValid={StringUtils.isEmpty(passwordError)}
                    label={t("password")}
                    onChange={(e) => setPassword(e.target.value)}
                    required={true}
                    value={password}
                />
                {// if
                signingIn ? (
                    `${t("signingIn")}...`
                ) : (
                    //else
                    <React.Fragment>
                        <SubmitButton
                            buttonText={props.buttonText ?? t("signIn")}
                            cssClassName="c-button"
                        />
                        <CheckboxFormField
                            checked={rememberMe}
                            label={t("rememberMe")}
                            onChange={(e) => setRememberMe(!rememberMe)}
                        />
                    </React.Fragment>
                )}

                {// if
                CollectionUtils.hasValues(pageErrors) &&
                    pageErrors.map((error: string, key: number) => (
                        <Paragraph
                            key={key}
                            cssClassName={`${COMPONENT_CLASS}__errors`}>
                            {error}
                        </Paragraph>
                    ))}
            </Form>
            {// if
            !signingIn && (
                <div className={`${COMPONENT_CLASS}__help-links`}>
                    <Anchor to={RouteUtils.getUrl(siteMap.root)}>
                        {t("forgotYourPassword")}
                    </Anchor>
                    <Anchor to={RouteUtils.getUrl(siteMap.root)}>
                        {t("needHelpSigningIn")}
                    </Anchor>
                </div>
            )}
        </div>
    );
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default NewUserLoginForm;

// #endregion Exports
