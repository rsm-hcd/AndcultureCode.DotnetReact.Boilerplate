import {
    Button,
    ButtonStyles,
} from "andculturecode-javascript-react-components";
import ButtonGroup from "organisms/button-groups/button-group";
import React from "react";

export default {
    component: ButtonGroup,
    title: "Organisms | Button Groups / Button Group",
};

export const buttonGroupDefault = () => (
    <ButtonGroup>
        <Button style={ButtonStyles.TertiaryAlt}>Button 1</Button>
        <Button style={ButtonStyles.TertiaryAlt}>Button 2</Button>
        <Button style={ButtonStyles.TertiaryAlt}>Button 3</Button>
        <Button style={ButtonStyles.TertiaryAlt}>Button 4</Button>
    </ButtonGroup>
);
