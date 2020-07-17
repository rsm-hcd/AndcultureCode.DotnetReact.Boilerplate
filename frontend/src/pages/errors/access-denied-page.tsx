import {
    Anchor,
    Heading,
    HeadingPriority,
    ParagraphSizes,
    Paragraph,
} from "andculturecode-javascript-react-components";
import * as React from "react";
import { siteMap } from "sitemap";

interface AccessDeniedPageProps {}

const AccessDeniedPage: React.FunctionComponent<AccessDeniedPageProps> = (
    props
) => {
    return (
        <React.Fragment>
            <main className="c-access-denied-page">
                <Heading priority={HeadingPriority.One}>
                    We can't let you see this page
                </Heading>
                <Paragraph size={ParagraphSizes.Base}>
                    To access this page, you may need to{" "}
                    <Anchor to={siteMap.userlogins.new}>log in</Anchor>
                </Paragraph>
            </main>
        </React.Fragment>
    );
};

export default AccessDeniedPage;
