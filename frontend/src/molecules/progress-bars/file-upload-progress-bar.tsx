import {
    Icon,
    Icons,
    IconSizes,
    Button,
    ButtonStyles,
    ButtonTypes,
    Paragraph,
    ProgressBar,
} from "andculturecode-javascript-react-components";
import React from "react";
import { StringUtils } from "andculturecode-javascript-core";

// -------------------------------------------------------------------------------------------------
// #region Constants
// -------------------------------------------------------------------------------------------------

const COMPONENT_CLASS = "c-file-upload-progress-bar";
const BAR_CLASS = `${COMPONENT_CLASS}__bar`;
const TOP_CLASS = `${COMPONENT_CLASS}__top`;
const TOP_STATUS_CLASS = `${TOP_CLASS}__status`;
const TOP_STATUS_TEXT_CLASS = `${TOP_STATUS_CLASS}__text`;

// #endregion Constants

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

interface FileUploadProgressBarProps {
    cssClassName?: string;
    isErrored?: boolean;
    onRetryClick?: () => void;
    value: number;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Functions
// -------------------------------------------------------------------------------------------------

/**
 * Incoming value must be between 0 and 100
 * @param value
 */
const preprocessValue = (value: number): number => {
    value = Math.round(value);

    if (value < 0) {
        return 0;
    }

    if (value > 100) {
        return 100;
    }

    return value;
};

// #endregion Functions

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const FileUploadProgressBar: React.FC<FileUploadProgressBarProps> = (
    props: FileUploadProgressBarProps
) => {
    const classNames = [COMPONENT_CLASS];
    const value = preprocessValue(props.value);
    const isErrored = props.isErrored;
    const isNotErrored = !isErrored;
    const isUploaded = value >= 100;

    if (isErrored) {
        classNames.push("-error");
    }

    if (isNotErrored && isUploaded) {
        classNames.push("-success");
    }

    if (StringUtils.hasValue(props.cssClassName)) {
        classNames.push(props.cssClassName!);
    }

    return (
        <div className={classNames.join(" ")}>
            <div className={TOP_CLASS}>
                <div className={TOP_STATUS_CLASS}>
                    {// if
                    !isUploaded && isNotErrored && (
                        <div className={TOP_STATUS_TEXT_CLASS}>
                            <Paragraph>Uploading...</Paragraph>
                        </div>
                    )}
                    {// if
                    isUploaded && isNotErrored && (
                        <div className={TOP_STATUS_TEXT_CLASS}>
                            <Icon
                                type={Icons.Checkmark}
                                size={IconSizes.Large}
                            />
                            <Paragraph>File Uploaded!</Paragraph>
                        </div>
                    )}
                    {// if
                    isErrored && (
                        <div className={`${TOP_STATUS_TEXT_CLASS} -error`}>
                            <Paragraph>Upload Failed</Paragraph>
                            <Button
                                onClick={() => props.onRetryClick?.()}
                                style={ButtonStyles.Anchor}
                                type={ButtonTypes.Button}>
                                Try Again
                            </Button>
                        </div>
                    )}
                    {// if
                    isNotErrored && (
                        <Paragraph
                            cssClassName={`${TOP_STATUS_CLASS}__percent`}>
                            {value}%
                        </Paragraph>
                    )}
                </div>
            </div>
            <div className={BAR_CLASS}>
                <ProgressBar value={value} isErrored={isErrored} />
            </div>
        </div>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default FileUploadProgressBar;

// #endregion Exports
