import Anchor from "atoms/anchors/anchor";
import { HeadingPriority } from "atoms/constants/heading-priority";
import { InputTypes } from "atoms/constants/input-types";
import SubmitButton from "atoms/forms/submit-button";
import Heading from "atoms/typography/heading";
import Paragraph from "atoms/typography/paragraph";
import CheckboxFormField from "molecules/form-fields/checkbox-form-field";
import InputFormField from "molecules/form-fields/input-form-field";
import PasswordFormField from "molecules/form-fields/password-form-field";
import Form from "molecules/forms/form";
import * as React from "react";
import { useEffect, useState } from "react";
import { siteMap } from "sitemap";
import { CollectionUtils } from "utilities/collection-utils";
import usePageErrors from "utilities/hooks/use-page-errors";
import { RouteUtils } from "utilities/route-utils";
import StringUtils from "utilities/string-utils";
import { useLocalization } from "andculturecode-javascript-react";
import CultureResources from "utilities/interfaces/culture-resources";

interface NewUserLoginFormProps {
    defaultEmail?: string;
    buttonText?: string;

    /**
     * Optional callback that will be fired after successfully logging in the user.
     */
    onSuccess?: () => void;
    showLogo?: boolean;
    showSignInTitle?: boolean;
}

const NewUserLoginForm: React.FunctionComponent<NewUserLoginFormProps> = (
    props: NewUserLoginFormProps
) => {
    const [password, setPassword] = useState("");
    const [passwordError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [signingIn] = useState(false);
    const [username, setUserName] = useState("");
    const [usernameError] = useState("");
    const hasDefaultEmail = StringUtils.hasValue(props.defaultEmail);

    const { pageErrors } = usePageErrors();
    const { t } = useLocalization<CultureResources>();

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
        <div className="c-userlogin-new-form">
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
                                    cssClassName="c-userlogin-new-form__errors">
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
                <div className="c-userlogin-new-form__help-links">
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

export default NewUserLoginForm;
