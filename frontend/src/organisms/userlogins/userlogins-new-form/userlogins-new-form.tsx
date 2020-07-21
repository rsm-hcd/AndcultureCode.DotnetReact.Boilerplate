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
import { useEffect, useState } from "react";
import { siteMap } from "sitemap";
import { CollectionUtils } from "utilities/collection-utils";
import { usePageErrors } from "andculturecode-javascript-react";
import { RouteUtils } from "utilities/route-utils";
import StringUtils from "utilities/string-utils";
import { useLocalization } from "andculturecode-javascript-react";
import CultureResources from "utilities/interfaces/culture-resources";

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
    defaultEmail?: string;

    /**
     * Optional callback that will be fired after successfully logging in the user.
     */
    onSuccess?: () => void;
    showLogo?: boolean;
    showSignInTitle?: boolean;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const NewUserLoginForm: React.FunctionComponent<NewUserLoginFormProps> = (
    props: NewUserLoginFormProps
) => {
    const hasDefaultEmail = StringUtils.hasValue(props.defaultEmail);
    const { pageErrors } = usePageErrors();
    const [password, setPassword] = useState("");
    const [passwordError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [signingIn] = useState(false);
    const { t } = useLocalization<CultureResources>();
    const [username, setUserName] = useState("");
    const [usernameError] = useState("");

    useEffect(() => {
        if (StringUtils.hasValue(props.defaultEmail)) {
            setUserName(props.defaultEmail!);
        }
    }, [props.defaultEmail]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        props.onSuccess?.();
    };

    return (
        <div className={COMPONENT_CLASS}>
            {(props.showSignInTitle ?? true) && (
                <Heading priority={HeadingPriority.One}>{t("signIn")}</Heading>
            )}
            <Form onSubmit={handleSubmit} buttonText={t("signIn")}>
                <InputFormField
                    errorMessage={usernameError}
                    inputTestId="userName"
                    isValid={usernameError.length === 0}
                    label={t("emailAddress")}
                    maxLength={100}
                    onChange={(e) => setUserName(e.target.value)}
                    required={!hasDefaultEmail}
                    showCharacterCount={false}
                    value={username}
                    disabled={hasDefaultEmail || signingIn}
                    type={InputTypes.Email}
                />
                <PasswordFormField
                    errorMessage={passwordError}
                    inputTestId="password"
                    isValid={passwordError.length === 0}
                    label={t("password")}
                    onChange={(e) => setPassword(e.target.value)}
                    required={true}
                    value={password}
                    disabled={signingIn}
                />
                {// if
                signingIn ? (
                    "Signing In..."
                ) : (
                    //else
                    <React.Fragment>
                        <SubmitButton
                            buttonText={props.buttonText ?? t("signIn")}
                            cssClassName="c-button"
                        />
                        {// if
                        CollectionUtils.hasValues(pageErrors) &&
                            pageErrors.map((error: string, key: number) => (
                                <Paragraph
                                    key={key}
                                    cssClassName={`${COMPONENT_CLASS}__errors`}>
                                    {error}
                                </Paragraph>
                            ))}
                        <CheckboxFormField
                            checked={rememberMe}
                            label={t("rememberMe")}
                            onChange={(e) => setRememberMe(!rememberMe)}
                        />
                    </React.Fragment>
                )}
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
