import React, { PropsWithChildren } from "react";
import { Paragraph } from "andculturecode-javascript-react-components";

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface CardProps {
    label: string;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Components
// -------------------------------------------------------------------------------------------------

const Card: React.FC<CardProps> = (props: PropsWithChildren<CardProps>) => {
    return (
        <div className="c-card">
            <div className="c-card__content">
                <Paragraph>{props.children}</Paragraph>
            </div>
            <div className="c-card__label">
                <Paragraph>{props.label}</Paragraph>
            </div>
        </div>
    );
};

// #endregion Components

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default Card;

// #endregion Exports
