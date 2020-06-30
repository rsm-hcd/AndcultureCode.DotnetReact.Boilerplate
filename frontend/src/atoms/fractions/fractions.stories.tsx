import Fraction from "atoms/fractions/fractions";
import React from "react";
import XmlUtils from "utilities/xml-utils";

export default {
    title: "Atoms | Fractions",
    component: Fraction,
};

const xml = `<fraction>
<numerator>1</numerator>
<denominator>2</denominator>
</fraction>`;
export const fractionDefault = () => (
    <div>{XmlUtils.convert(xml, XmlUtils.fractionConverter)}</div>
);
