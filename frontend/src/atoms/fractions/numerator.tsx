import * as React from "react";

interface NumeratorProps {}

const Numerator: React.FunctionComponent<NumeratorProps> = (props) => {
    return (
        <React.Fragment>
            <span className="c-fraction__numerator">{props.children}</span>
            <span className="c-fraction__separator">&frasl;</span>
        </React.Fragment>
    );
};

export default Numerator;
