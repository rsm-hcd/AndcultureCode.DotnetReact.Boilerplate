import { LoaderStyles } from "atoms/constants/loader-styles";
import SubmitButton from "atoms/forms/submit-button";
import Loader from "atoms/loaders/loader";
import Paragraph from "atoms/typography/paragraph";
import UserLoginRecord from "models/view-models/user-login-record";
import InputFormField from "molecules/form-fields/input-form-field";
import PasswordFormField from "molecules/form-fields/password-form-field";
import Form from "molecules/forms/form";
import * as React from "react";
import { useState, useEffect } from "react";
import { siteMap } from "sitemap";
import usePageErrors from "utilities/hooks/use-page-errors";
import UserLoginService from "utilities/services/user-logins/user-login-service";
import StringUtils from "utilities/string-utils";
import CreateUserDto from "models/interfaces/create-user-dto";
import {
    ObjectValidationResult,
    ObjectValidator,
} from "utilities/validation/object-validator/object-validator";
import SubscriptionType from "organisms/enums/subscription-type";
import UserService from "utilities/services/users/user-service";
import { ToastManager } from "utilities/toast/toast-manager";
import { v4 } from "uuid";
import { useSignupContext } from "utilities/contexts/signup/use-signup-context";
import GlobalStateRecord from "models/view-models/global-state-record";
import { ParagraphSizes } from "atoms/constants/paragraph-sizes";
import CreateUserDtoRecord from "models/view-models/create-user-dto-record";
import { CreateUserDtoValidator } from "models/validation/create-user-dto-validator";
import { ListService } from "utilities/services/service-factory";
import UserConfigurationRecord from "models/view-models/user-configuration-record";
import UserConfigurationService, {
    UserConfigurationListQueryParams,
} from "utilities/services/user-configurations/user-configuration-service";
import {
    GlobalStateUpdater,
    useGlobalState,
} from "utilities/contexts/use-global-state-context";
import { History } from "history";
import { useHistory } from "react-router-dom";
import useIdentity from "utilities/hooks/use-identity";
import SignupContextRecord from "models/view-models/signup-context-record";

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

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const BASE_CLASS = "c-new-user-form";
const PASSWORD_REQUIREMENTS =
    "Must be at least 6 characters long and contain 3 of the 4 following character types: 'UpperCase', 'LowerCase', 'Number', or 'Special Character'.";

// #endregion Constants

const NewUserForm: React.FunctionComponent<NewUserFormProps> = (
    props: NewUserFormProps
) => {
    const formId = props.formId ?? v4();
    const { signupContext, setSignupContext } = useSignupContext();

    // State
    const [creatingUser, setCreatingUser] = useState<boolean>(false);
    const [errorResult, setErrorResult] = useState<
        ObjectValidationResult<CreateUserDto>
    >({});

    const hasDefaultEmail = StringUtils.hasValue(props.defaultEmail);
    const isFreeTrial =
        signupContext.selectedSubscriptionType === SubscriptionType.FreeTrial;

    const { handlePageLoadError } = usePageErrors();
    const { setGlobalState } = useGlobalState();
    const { buildCurrentIdentity } = useIdentity();
    const history = useHistory();
    const {
        list: userConfigurationsListApi,
    } = UserConfigurationService.useList();
    const { create: userCreateApi } = UserService.useCreate();
    const { create: userLoginCreateApi } = UserLoginService.useCreate();

    useEffect(() => {
        if (
            StringUtils.hasValue(props.defaultEmail) &&
            StringUtils.isEmpty(signupContext.newUser.email)
        ) {
            setSignupContext(
                signupContext.with({
                    newUser: signupContext.newUser?.with({
                        email: props.defaultEmail,
                    }),
                })
            );
        }
    }, [props.defaultEmail, signupContext, setSignupContext]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formHasErrors = validate(signupContext.newUser, setErrorResult);
        if (formHasErrors) {
            window.scrollTo(0, 0);
            return;
        }

        async function createUser() {
            try {
                setCreatingUser(true);
                const dto = signupContext.newUser.with({
                    startFreeTrial: isFreeTrial,
                });
                const userCreateResponse = await userCreateApi(dto);
                if (userCreateResponse.result?.hasErrors()) {
                    ToastManager.error(
                        "There was a problem creating your account."
                    );
                    setCreatingUser(false);
                    return;
                }

                const userLoginCreateResponse = await userLoginCreateApi(
                    new UserLoginRecord({
                        password: signupContext.newUser.password,
                        userName: signupContext.newUser.email,
                    })
                );
                if (userLoginCreateResponse.result?.hasErrors()) {
                    ToastManager.error("There was a problem signing you in.");
                    setCreatingUser(false);
                    return;
                }

                const identity = await buildCurrentIdentity(
                    userLoginCreateResponse.resultObject
                );

                if (identity != null) {
                    setGlobalState((globalState: GlobalStateRecord) =>
                        globalState.setIdentity(identity)
                    );
                }

                if (isFreeTrial) {
                    listUserConfigurations(
                        history,
                        userConfigurationsListApi,
                        setGlobalState
                    );
                    ToastManager.success("Your free trial has begun.");
                    return;
                }

                setCreatingUser(false);

                if (props.onSuccess != null) {
                    props.onSuccess();
                }
            } catch (result) {
                setCreatingUser(false);
                handlePageLoadError(result);
            }
        }
        createUser();
    };

    const handleFormFieldChange = (key: keyof CreateUserDto, value: string) => {
        setSignupContext((previousValue: SignupContextRecord) =>
            previousValue.with({
                newUser: previousValue.newUser?.set(key, value),
            })
        );
    };

    return (
        <div className={BASE_CLASS}>
            <Form
                buttonText={props.submitButtonText}
                id={formId}
                onSubmit={handleSubmit}>
                <InputFormField
                    errorMessage={ObjectValidator.getConcatenatedErrorsFor<
                        CreateUserDto
                    >("firstName", errorResult)}
                    inputTestId="firstName"
                    isValid={
                        !ObjectValidator.hasErrorsFor<CreateUserDto>(
                            "firstName",
                            errorResult
                        )
                    }
                    label="First Name "
                    maxLength={100}
                    placeholder="Enter your first name..."
                    onChange={(e) =>
                        handleFormFieldChange("firstName", e.target.value)
                    }
                    required={true}
                    showCharacterCount={false}
                    value={signupContext.newUser?.firstName}
                />
                <InputFormField
                    errorMessage={ObjectValidator.getConcatenatedErrorsFor<
                        CreateUserDto
                    >("lastName", errorResult)}
                    inputTestId="lastName "
                    isValid={
                        !ObjectValidator.hasErrorsFor<CreateUserDto>(
                            "lastName",
                            errorResult
                        )
                    }
                    label="Last Name "
                    maxLength={100}
                    onChange={(e) =>
                        handleFormFieldChange("lastName", e.target.value)
                    }
                    placeholder="Enter your last name..."
                    required={true}
                    showCharacterCount={false}
                    value={signupContext.newUser?.lastName}
                />
                <InputFormField
                    disabled={hasDefaultEmail}
                    errorMessage={ObjectValidator.getConcatenatedErrorsFor<
                        CreateUserDto
                    >("email", errorResult)}
                    inputTestId="email"
                    isValid={
                        !ObjectValidator.hasErrorsFor<CreateUserDto>(
                            "email",
                            errorResult
                        )
                    }
                    label="Your Email Address "
                    maxLength={100}
                    onChange={(e) =>
                        handleFormFieldChange("email", e.target.value)
                    }
                    placeholder="Enter your email address..."
                    required={!hasDefaultEmail}
                    showCharacterCount={false}
                    value={signupContext.newUser?.email}
                />
                <div className={`${BASE_CLASS}__password`}>
                    <PasswordFormField
                        errorMessage={ObjectValidator.getConcatenatedErrorsFor<
                            CreateUserDto
                        >("password", errorResult)}
                        inputTestId="password"
                        isValid={
                            !ObjectValidator.hasErrorsFor<CreateUserDto>(
                                "password",
                                errorResult
                            )
                        }
                        label="Create a Password "
                        onChange={(e) =>
                            handleFormFieldChange("password", e.target.value)
                        }
                        placeholder="Create a password..."
                        required={true}
                        value={signupContext.newUser?.password}
                    />
                    <Paragraph size={ParagraphSizes.XSmall}>
                        {PASSWORD_REQUIREMENTS}
                    </Paragraph>
                </div>
                <PasswordFormField
                    errorMessage={ObjectValidator.getConcatenatedErrorsFor<
                        CreateUserDto
                    >("confirmPassword", errorResult)}
                    inputTestId="confirmPassword"
                    isValid={
                        !ObjectValidator.hasErrorsFor<CreateUserDto>(
                            "confirmPassword",
                            errorResult
                        )
                    }
                    label="Confirm Password "
                    onChange={(e) =>
                        handleFormFieldChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm password..."
                    required={true}
                    value={signupContext.newUser?.confirmPassword}
                />

                {props.loading ?? creatingUser ? (
                    <Loader
                        accessibleText={
                            props.loading ? "Loading" : "Creating account"
                        }
                        type={LoaderStyles.DualBallNeutral}
                    />
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

// -----------------------------------------------------------------------------------------
// #region Helper Methods
// -----------------------------------------------------------------------------------------

const listUserConfigurations = (
    history: History,
    list: ListService<
        UserConfigurationRecord,
        UserConfigurationListQueryParams
    >,
    setGlobalState: GlobalStateUpdater
) => {
    const listUserConfigurations = async () => {
        try {
            await list();
            history.push(siteMap.dashboards.user);
        } catch (error) {
            // If we encounter an error loading the user configuration, we are treating this as a fatal system error.
            // Log out the user which will redirect them to the login page to re-attempt.
            // This strategy may be further revised later when toasts or an alert system is present.
            setGlobalState((globalState: GlobalStateRecord) =>
                globalState.setUnauthenticated()
            );
        }
    };

    listUserConfigurations();
};

const validate = (
    user: CreateUserDtoRecord,
    setErrorResult: React.Dispatch<
        React.SetStateAction<ObjectValidationResult<CreateUserDto>>
    >
) => {
    const validateResult = new CreateUserDtoValidator().validate(user);
    setErrorResult(validateResult);
    return ObjectValidator.hasErrors(validateResult);
};

// #endregion Helper Methods

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export default NewUserForm;

// #endregion Exports
