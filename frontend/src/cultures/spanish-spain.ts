import {
    BaseSpanishSpain,
    Culture,
    LocalizationUtils,
} from "andculturecode-javascript-core";
import CultureResources from "utilities/interfaces/culture-resources";

const SpanishSpain: Culture<CultureResources> = LocalizationUtils.cultureFactory(
    BaseSpanishSpain,
    {
        resources: {
            createAnAccount: "Crea una cuenta",
            emailAddress: "dirección de correo electrónico",
            errorSigningIn:
                "Hubo un problema al iniciar sesión. Vuelva a intentarlo.",
            forgotYourPassword: "Olvidaste tu contraseña",
            needHelpSigningIn: "¿Necesita ayuda para iniciar sesión?",
            "newUserLoginForm-errors-loginGeneral":
                "Se produjo un problema al iniciar sesión. Vuelve a intentarlo.",
            "newUserLoginForm-errors-loginFailed":
                "Error de inicio de sesion. Proporcione un correo electrónico y contraseña válidos.",
            password: "contraseña",
            propertyIsRequired: "se requiere {{name}}",
            rememberMe: "Recuérdame",
            signIn: "Registrarse",
            signingIn: "Iniciando sesión",
            signUp: "Regístrate",
            userName: "Nombre de usuario",
        },
    }
);

export default SpanishSpain;
