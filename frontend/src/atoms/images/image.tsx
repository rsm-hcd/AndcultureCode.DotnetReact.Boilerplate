import * as React from "react";

export interface ImageProps {
    /**
     * Alt text to display for screenreaders or if the image does not load.
     *
     * @type {string}
     * @memberof ImageProps
     */
    altText?: string;

    /**
     * Optional class name to be applied to the img element.
     *
     * @type {string}
     * @memberof ImageProps
     */
    cssClassName?: string;

    /**
     * Path to the image to be rendered.
     *
     * @type {string}
     * @memberof ImageProps
     */
    src: string;
}

const Image: React.FunctionComponent<ImageProps> = (props: ImageProps) => {
    return (
        <img
            alt={props.altText}
            className={props.cssClassName}
            src={props.src}
        />
    );
};

export default Image;
