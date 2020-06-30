import React from "react";
import Paragraph from "atoms/typography/paragraph";

export interface CardProps {
    children: any;
    label: string;
}

const Card: React.FC<CardProps> = (props: CardProps) => {
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

/*
---------------------------------------------------------------------------------------------
Exports
---------------------------------------------------------------------------------------------
*/

export default Card;
