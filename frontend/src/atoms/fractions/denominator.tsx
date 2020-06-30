import * as React from "react";

interface DenominatorProps {}

const Denominator: React.FunctionComponent<DenominatorProps> = (props) => {
    return <span className="c-fraction__denominator">{props.children}</span>;
};

export default Denominator;
