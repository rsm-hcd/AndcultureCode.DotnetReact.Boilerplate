import {
    Form,
    InputFormField,
    Paragraph,
    ParagraphSizes,
    PasswordFormField,
    SubmitButton,
} from "andculturecode-javascript-react-components";
import * as React from "react";
import { useState, useEffect } from "react";
import { StringUtils } from "andculturecode-javascript-core";
import { v4 } from "uuid";
import { useHistory } from "react-router-dom";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const COMPONENT_CLASS = "c-new-user-form";
const PASSWORD_REQUIREMENTS =
    "Must be at least 6 characters long and contain 3 of the 4 following character types: 'UpperCase', 'LowerCase', 'Number', or 'Special Character'.";

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

interface NewUserFormProps {
    /**
     * If present the email address will be prefilled and disabled
     */
    defaultEmail?: string;

    /**
     * id of the <Form> element
     */
    formId?: string;

    /**
     * Optional prop used to conditionally extend the loading indicator. By default it will stop after successful
     * creation and login of the new user.
     */
    loading?: boolean;

    /**
     * Called after successfully creating and logging in the user.
     */
    onSuccess?: () => void;
    submitButtonText: string;
}

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Component
// -----------------------------------------------------------------------------------------

const NewUserForm: React.FunctionComponent<NewUserFormProps> = (
    props: NewUserFormProps
) => {
    const formId = props.formId ?? v4();

    // State
    const [creatingUser, setCreatingUser] = useState<boolean>(false);
    const hasDefaultEmail = StringUtils.hasValue(props.defaultEmail);
    const history = useHistory();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        window.alert("handle submit");
    };

    return (
        <div className={COMPONENT_CLASS}>
            <Form
                buttonText={props.submitButtonText}
                id={formId}
                onSubmit={handleSubmit}>
                <InputFormField
                    inputTestId="firstName"
                    label="First Name "
                    maxLength={100}
                    onChange={() => {}}
                    placeholder="Enter your first name..."
                    required={true}
                    showCharacterCount={false}
                    value={""}
                />
                <InputFormField
                    inputTestId="lastName "
                    label="Last Name "
                    maxLength={100}
                    onChange={() => {}}
                    placeholder="Enter your last name..."
                    required={true}
                    showCharacterCount={false}
                />
                <InputFormField
                    disabled={hasDefaultEmail}
                    inputTestId="email"
                    label="Your Email Address "
                    maxLength={100}
                    onChange={() => {}}
                    placeholder="Enter your email address..."
                    required={!hasDefaultEmail}
                    showCharacterCount={false}
                    value={""}
                />
                <div className={`${COMPONENT_CLASS}__password`}>
                    <PasswordFormField
                        inputTestId="password"
                        label="Create a Password "
                        onChange={() => {}}
                        placeholder="Create a password..."
                        required={true}
                        value={""}
                    />
                    <Paragraph size={ParagraphSizes.XSmall}>
                        {PASSWORD_REQUIREMENTS}
                    </Paragraph>
                </div>
                <PasswordFormField
                    inputTestId="confirmPassword"
                    label="Confirm Password "
                    onChange={() => {}}
                    placeholder="Confirm password..."
                    required={true}
                    value={""}
                />

                {props.loading ?? creatingUser ? (
                    props.loading ? (
                        "Loading"
                    ) : (
                        "Creating account"
                    )
                ) : (
                    <SubmitButton
                        buttonText={props.submitButtonText}
                        cssClassName="c-button"
                        formId={formId}
                    />
                )}
            </Form>
        </div>
    );
};

// #endregion Component

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default NewUserForm;

// #endregion Exports
