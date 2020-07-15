import {
    Button,
    ButtonSizes,
} from "andculturecode-javascript-react-components";
import React from "react";
import { ToastContainer, ToastPosition, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastManager } from "utilities/toast/toast-manager";

export default {
    title: "Atoms | Toasts",
    component: ToastContainer,
};

export const toastDefault = () => (
    <React.Fragment>
        <Button
            onClick={() => ToastManager.success("Success toast!")}
            size={ButtonSizes.Small}>
            Show Success Toast
        </Button>
        &nbsp;
        <Button
            onClick={() => ToastManager.error("Error toast!")}
            size={ButtonSizes.Small}>
            Show Error Toast
        </Button>
        &nbsp;
        <Button
            onClick={() => ToastManager.warn("Warning toast!")}
            size={ButtonSizes.Small}>
            Show Warning Toast
        </Button>
        &nbsp;
        <Button
            onClick={() => ToastManager.info("Info toast!")}
            size={ButtonSizes.Small}>
            Show Info Toast
        </Button>
        <ToastContainer
            draggable={false}
            position={ToastPosition.BOTTOM_RIGHT}
            autoClose={5000}
            closeOnClick={true}
            closeButton={false}
            transition={Zoom}
            toastClassName="c-toast"
        />
    </React.Fragment>
);
