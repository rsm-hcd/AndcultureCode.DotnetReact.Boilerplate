import CollapsePanel from "molecules/collapse-panel/collapse-panel";
import Faker from "faker";
import React from "react";

export default {
    title: "Molecules | Collapse Panel / Collapse Panel",
    component: CollapsePanel,
};

export const collapsePanelDefault = () => (
    <CollapsePanel
        panelTop={<span>{Faker.lorem.words(2)}</span>}
        collapse={true}
        buttonAriaText="Default Panel">
        <div>
            <p>{Faker.lorem.words(5)}</p>
        </div>
    </CollapsePanel>
);
