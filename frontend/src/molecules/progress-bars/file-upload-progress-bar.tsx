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
// #region Component
// -------------------------------------------------------------------------------------------------

const FileUploadProgressBar: React.FC<FileUploadProgressBarProps> = (
    props: FileUploadProgressBarProps
) => {
    const CSS_CLASS_NAME = "c-file-upload-progress-bar";

    // value must be an integer 0 < value < 100
    let value = Math.round(props.value);

    if (value < 0) {
        value = 0;
    }

    if (value > 100) {
        value = 100;
    }

    const classNames = [CSS_CLASS_NAME];

    if (props.isErrored) {
        classNames.push("-error");
    }

    if (!props.isErrored && value >= 100) {
        classNames.push("-success");
    }

    if (StringUtils.hasValue(props.cssClassName)) {
        classNames.push(props.cssClassName!);
    }

    return (
        <div className={classNames.join(" ")}>
            <div className={`${CSS_CLASS_NAME}__top`}>
                <div className={`${CSS_CLASS_NAME}__top__status`}>
                    {// if
                    value < 100 && !props.isErrored && (
                        <div className={`${CSS_CLASS_NAME}__top__status__text`}>
                            <Paragraph>Uploading...</Paragraph>
                        </div>
                    )}
                    {// if
                    value >= 100 && !props.isErrored && (
                        <div className={`${CSS_CLASS_NAME}__top__status__text`}>
                            <Icon
                                type={Icons.Checkmark}
                                size={IconSizes.Large}
                            />
                            <Paragraph>File Uploaded!</Paragraph>
                        </div>
                    )}
                    {// if
                    props.isErrored && (
                        <div
                            className={`${CSS_CLASS_NAME}__top__status__text -error`}>
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
                    !props.isErrored && (
                        <Paragraph
                            cssClassName={`${CSS_CLASS_NAME}__top__status__percent`}>
                            {value}%
                        </Paragraph>
                    )}
                </div>
            </div>
            <div className={`${CSS_CLASS_NAME}__bar`}>
                <ProgressBar value={value} isErrored={props.isErrored} />
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
