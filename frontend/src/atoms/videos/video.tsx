import { Paragraph } from "andculturecode-javascript-react-components";
import React from "react";
import PathUtils from "utilities/path-utils";
import { RouteUtils } from "utilities/route-utils";
import { StringUtils } from "andculturecode-javascript-core";

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface VideoProps {
    /**
     * Whether to automatically start playing the video content.
     * Default to false since autoplay is blocked by major browsers
     * in most situations, unless the video is also muted.
     * @default false
     */
    autoplay?: boolean;
    cssClassName?: string;
    /**
     * Play the video in a loop.
     * @default false
     */
    loop?: boolean;
    /**
     * Mute the video. Usually, you need to mute the video
     * if you want to autoplay on page load.
     * @default false
     */
    muted?: boolean;
    /**
     * Show or hide video playback controls.
     * TODO get a design from Brad for the video controls.
     * @default true
     */
    showControls?: boolean;
    /**
     * Array of video URLs. Will generate a <source> tag for each one.
     * Mimetype is assumed based on file extension.
     */
    sources: Array<string>;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const Video: React.FC<VideoProps> = (props: VideoProps) => {
    const CSS_CLASS_NAME = "c-video";
    const classNames = [CSS_CLASS_NAME];
    if (StringUtils.hasValue(props.cssClassName)) {
        classNames.push(props.cssClassName!);
    }

    const getMimetype = (src: string) => {
        const path = RouteUtils.removeQueryString(src);
        return `video/${PathUtils.getFileExtension(path)}`;
    };

    return (
        <video
            autoPlay={props.autoplay}
            className={classNames.join(" ")}
            controls={props.showControls}
            loop={props.loop}
            muted={props.muted}>
            {props.sources.map((src: string) => (
                <source src={src} type={getMimetype(src)} key={src} />
            ))}
            {/* This text will show if HTML5 video is not supported */}
            <Paragraph
                cssClassName={`${CSS_CLASS_NAME}__not-supported-message`}>
                Sorry, your browser does not support HTML5 video playback.
            </Paragraph>
        </video>
    );
};

Video.defaultProps = {
    autoplay: false,
    loop: false,
    muted: false,
    showControls: true,
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default Video;

// #endregion Exports
