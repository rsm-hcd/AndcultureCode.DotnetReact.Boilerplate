import { ModalTransitions } from "molecules/constants/modal-transitions";
import { ModalTypes } from "molecules/constants/modal-types";
import Modal from "molecules/modals/modal";
import React from "react";
import { boolean, select, text } from "@storybook/addon-knobs";

export default {
    title: "Molecules | Modals",
    component: Modal,
};

export const modal = () => {
    return (
        <React.Fragment>
            <Modal
                closeDialog={() => null}
                isVisible={boolean("visible", true)}
                label={text("Aria Label", "Accessible text")}
                transition={ModalTransitions.Fade}
                type={select("Type", ModalTypes, ModalTypes.Bottom)}>
                <p>Hello World!</p>
            </Modal>
        </React.Fragment>
    );
};
