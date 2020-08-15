import {
    BaseEnglishUnitedStates,
    Culture,
    LocalizationUtils,
} from "andculturecode-javascript-core";
import CultureResources from "utilities/interfaces/culture-resources";

const EnglishUnitedStates: Culture<CultureResources> = LocalizationUtils.cultureFactory(
    BaseEnglishUnitedStates,
    {
        resources: {
            createAnAccount: "Create An Account",
            emailAddress: "Email address",
            errorSigningIn:
                "There was a problem logging you in. Please try again.",
            forgotYourPassword: "Forgot Your Password",
            needHelpSigningIn: "Need Help Signing In?",
            "newUserLoginForm-errors-loginGeneral":
                "There was a problem logging you in. Please try again.",
            "newUserLoginForm-errors-loginFailed":
                "Login failed. Please provide a valid email and password.",
            password: "Password",
            propertyIsRequired: "{{name}} is required.",
            rememberMe: "Remember Me",
            signIn: "Sign In",
            signingIn: "Signing In",
            signUp: "Sign Up",
            userName: "Username",
        },
    }
);

export default EnglishUnitedStates;
