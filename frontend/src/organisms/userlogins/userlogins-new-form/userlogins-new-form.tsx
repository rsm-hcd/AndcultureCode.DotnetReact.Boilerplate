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
import {
    useLocalization,
    usePageErrors,
} from "andculturecode-javascript-react";
import { RouteUtils } from "utilities/route-utils";
import { CollectionUtils, StringUtils } from "andculturecode-javascript-core";
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
    showTitle?: boolean;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const NewUserLoginForm: React.FunctionComponent<NewUserLoginFormProps> = (
    props: NewUserLoginFormProps
) => {
    const hasDefaultEmail = StringUtils.hasValue(props.defaultEmail);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const { setPageErrors, pageErrors, resetPageErrors } = usePageErrors();
    const [signingIn, setSigningIn] = useState(false);
    const { t } = useLocalization<CultureResources>();
    const [userName, setUserName] = useState("");
    const [userNameError, setUserNameError] = useState("");

    const showTitle = props.showTitle === true;

    useEffect(() => {
        if (StringUtils.hasValue(props.defaultEmail)) {
            setUserName(props.defaultEmail!);
        }
    }, [props.defaultEmail]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSigningIn(true);

        const formHasErrors = await validate();
        if (formHasErrors) {
            setSigningIn(false);
            return;
        }
        resetPageErrors();

        // TODO

        props.onSuccess?.();
    };

    const resetErrors = () => {
        setUserNameError("");
        setPasswordError("");
    };

    const validate = async () => {
        resetErrors();
        let hasErrors = false;

        if (userName.length === 0) {
            setUserNameError("Email Address is required.");
            hasErrors = true;
        }
        if (password.length === 0) {
            setPasswordError("Password is required.");
            hasErrors = true;
        }

        return hasErrors;
    };

    return (
        <div className={COMPONENT_CLASS}>
            {showTitle && (
                <Heading priority={HeadingPriority.One}>{t("signIn")}</Heading>
            )}
            <Form onSubmit={handleSubmit} buttonText={t("signIn")}>
                <InputFormField
                    disabled={hasDefaultEmail || signingIn}
                    errorMessage={userNameError}
                    inputTestId="userName"
                    isValid={StringUtils.isEmpty(userNameError)}
                    label={t("emailAddress")}
                    maxLength={100}
                    onChange={(e) => setUserName(e.target.value)}
                    required={!hasDefaultEmail}
                    showCharacterCount={false}
                    type={InputTypes.Email}
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
