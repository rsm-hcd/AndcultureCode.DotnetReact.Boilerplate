import CollapsePanel from "molecules/collapse-panel/collapse-panel";
import Faker from "faker";
import React from "react";

export default {
    component: CollapsePanel,
    title: "Molecules | Collapse Panel / Collapse Panel",
};

export const collapsePanelDefault = () => (
    <CollapsePanel
        buttonAriaText="Default Panel"
        collapse={true}
        panelTop={<span>{Faker.lorem.words(2)}</span>}>
        <div>
            <p>{Faker.lorem.words(5)}</p>
        </div>
    </CollapsePanel>
);
