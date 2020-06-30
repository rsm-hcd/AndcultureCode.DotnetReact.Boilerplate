import FileLink from "atoms/anchors/file-link";
import Button from "atoms/buttons/button";
import { ButtonSizes } from "atoms/constants/button-sizes";
import { ButtonStyles } from "atoms/constants/button-styles";
import { Icons } from "atoms/constants/icons";
import Icon from "atoms/icons/icon";
import Loader from "atoms/loaders/loader";
import FileRecord from "models/view-models/file-record";
import ListBox, { ListBoxItemClassName } from "molecules/lists/list-box";
import FileUploadProgressBar from "molecules/progress-bars/file-upload-progress-bar";
import React, { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { S3Response } from "react-s3-uploader";
import { CollectionUtils } from "utilities/collection-utils";
import { CoreUtils } from "utilities/core-utils";
import FileUploadDestination from "utilities/enumerations/file-upload-destination";
import EnvUtils from "utilities/env-utils";
import PathUtils from "utilities/path-utils";
import FileUtils from "utilities/file-utils";
import StringUtils from "utilities/string-utils";
import { ToastManager } from "utilities/toast/toast-manager";
import uuid from "uuid";

// -------------------------------------------------------------------------------------------------
// #region Interfaces
// -------------------------------------------------------------------------------------------------

export interface FileUploadFieldProps {
    accept?: string | Array<string>;
    /**
     * Return false to abort the upload to S3.
     * This callback gives you an opportunity to perform
     * validation on the file before uploading it.
     * @param file
     */
    beforeUpload?: (file: File) => Promise<boolean>;
    /**
     * If true, will console.log updates about the upload progress,
     * only if in the development environment.
     */
    debugS3UploadProgress?: boolean;
    /**
     * Allows you to show loading file deletion state
     * when deleted from outside this component, for example
     * when closing the solution resource modal with the
     * cancel button.
     */
    deleteLoading?: boolean;
    disabled?: boolean;
    errorMessages?: Array<string>;
    fileUploadDestination?: FileUploadDestination;
    /**
     * Text to render under the "attach file" label.
     * You can use this to display instructions such as
     * a maximum file size or maximum image dimensions.
     */
    helpText?: string;
    isErrored?: boolean;
    /**
     * Field label, defaults to "Attach File"
     */
    label?: string;
    onFileChanged?: (file?: FileRecord) => void;
    onRetryUpload?: () => void;
    onUploadError?: (message: string) => void;
    required?: boolean;
    value?: FileRecord;
}

// #endregion Interfaces

// -------------------------------------------------------------------------------------------------
// #region Component
// -------------------------------------------------------------------------------------------------

const FileUploadField: React.FC<FileUploadFieldProps> = (
    props: FileUploadFieldProps
) => {
    const CSS_BASE_CLASS = "c-file-upload-field";
    const cssClassNames = [CSS_BASE_CLASS, "c-form-field"];
    if (props.isErrored) {
        cssClassNames.push("-error");
    }

    const onFinishUploading = useCallback(
        async (uploadResult: S3Response, file?: FileRecord) => {
            if (!props.isErrored) {
                // show the success state before transitioning
                await CoreUtils.sleep(500);
            }

            setInputFile(undefined);
            setProgress(0);
            props.onFileChanged?.(file);
        },
        [props.onFileChanged, props.isErrored]
    );

    const onUploadError = useCallback(
        (message: string) => {
            ToastManager.error(message);
            props.onUploadError?.(message);
        },
        [props.onUploadError]
    );

    const onProgress = useCallback(
        (percent: number, status: string, file: File) => {
            if (props.debugS3UploadProgress === true) {
                EnvUtils.runIfDevelopment(() =>
                    console.log(
                        `S3-UPLOAD:: ${file.name}: ${percent}% - ${status}`
                    )
                );
            }
            setProgress(percent);
        },
        [props.debugS3UploadProgress]
    );

    const handleRetry = () => inputFile != null && uploadFile(inputFile);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null && e.target.files.length > 0) {
            uploadFile(e.target.files[0]);
        }
    };

    const handleFileRemoved = async () => {
        try {
            setDeleteLoading(true);
            await FileUtils.deleteFile(props.value!);
            props.onFileChanged?.(undefined);
            setDeleteLoading(false);
        } catch (e) {
            ToastManager.error("Failed to remove file.");
            setDeleteLoading(false);
        }
    };

    const [inputFile, setInputFile] = useState<File | undefined>();
    const [progress, setProgress] = useState<number>(0);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (props.deleteLoading === true) {
            setDeleteLoading(true);
        }
    }, [props.deleteLoading]);

    const onUploadStart = useCallback(
        async (file: File, next?: (file: File) => any): Promise<boolean> => {
            setInputFile(file);
            setProgress(0);
            next?.(file);
            return (
                props.beforeUpload?.(file) ??
                new Promise((resolve) => resolve(true))
            );
        },
        [props.beforeUpload]
    );

    const onUploadAbort = useCallback(() => {
        setProgress(0);
        setInputFile(undefined);
        props.onFileChanged?.(undefined);
    }, [props.onFileChanged]);

    const uploadFile = useCallback(
        (file: File) => {
            props.onRetryUpload?.();
            FileUtils.uploadFile(file, {
                fileUploadDestination: props.fileUploadDestination,
                onProgress: onProgress,
                beforeUpload: onUploadStart,
                onAbort: onUploadAbort,
                onError: onUploadError,
                onFinish: onFinishUploading,
            });
        },
        [
            onFinishUploading,
            onUploadError,
            props.onRetryUpload,
            onProgress,
            props.fileUploadDestination,
            onUploadAbort,
            onUploadStart,
        ]
    );

    const handleDrop = useCallback(
        (acceptedFiles: Array<File>, rejectedFiles: Array<FileRejection>) => {
            if (CollectionUtils.hasValues(acceptedFiles)) {
                uploadFile(acceptedFiles[0]);
            }

            if (CollectionUtils.hasValues(rejectedFiles)) {
                if (rejectedFiles.length > 1) {
                    ToastManager.error(
                        "Only 1 file can be attached to a resource."
                    );
                    return;
                }

                ToastManager.error(
                    `${rejectedFiles.length} files failed to upload.`
                );
            }
        },
        [uploadFile]
    );

    const getFileContainerClassNames = (): string => {
        const classNames = [
            ListBoxItemClassName,
            `${CSS_BASE_CLASS}__file-container__progress`,
        ];
        if (progress >= 100 && !props.isErrored) {
            classNames.push("-success");
        }

        if (props.isErrored) {
            classNames.push("-error");
        }

        return classNames.join(" ");
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: props.accept,
        disabled: props.disabled,
        multiple: false,
        onDrop: handleDrop,
    });

    return (
        <div className={cssClassNames.join(" ")}>
            {// if
            props.value == null && inputFile == null && (
                <React.Fragment>
                    <label>
                        {StringUtils.hasValue(props.label)
                            ? props.label
                            : "Attach File"}
                        {props.required === true ? "*" : ""}
                    </label>
                    {StringUtils.hasValue(props.helpText) && (
                        <label className="-help-text">{props.helpText}</label>
                    )}
                    <div
                        className={`${CSS_BASE_CLASS}__file-container`}
                        {...getRootProps()}>
                        <input
                            onChange={handleFileInputChange}
                            {...getInputProps()}
                        />
                        {// if
                        isDragActive && <p>Drop the files here</p>}
                        {// if
                        !isDragActive && (
                            <p
                                className={`${CSS_BASE_CLASS}__file-container__help-text`}>
                                Drag file here or{" "}
                                <span
                                    className={`${CSS_BASE_CLASS}__browse-link`}>
                                    Browse
                                </span>
                            </p>
                        )}
                    </div>
                </React.Fragment>
            )}
            {// if
            (props.value != null || inputFile != null) && (
                <React.Fragment>
                    <label>Attached File</label>
                    <ListBox>
                        {// if
                        props.value == null && inputFile != null && (
                            <div className={getFileContainerClassNames()}>
                                <FileUploadProgressBar
                                    cssClassName={`${CSS_BASE_CLASS}__file-container__progress__progress-bar`}
                                    isErrored={props.isErrored}
                                    onRetryClick={handleRetry}
                                    value={progress}
                                />
                            </div>
                        )}
                        {// if
                        props.value != null && inputFile == null && (
                            <div
                                className={`${ListBoxItemClassName} ${CSS_BASE_CLASS}__file-container__files`}>
                                {// if
                                deleteLoading && (
                                    <Loader accessibleText="Deleting file..." />
                                )}
                                {// if
                                !deleteLoading && (
                                    <FileLink
                                        accessibleText="Download"
                                        cssClassName={`${CSS_BASE_CLASS}__file-container__files__filename`}
                                        relativeProviderPath={
                                            props.value.relativeProviderPath
                                        }>
                                        {PathUtils.relativePathToFilename(
                                            props.value.relativeProviderPath
                                        )}
                                    </FileLink>
                                )}
                                <Button
                                    cssClassName={`${CSS_BASE_CLASS}__file-container__files__remove-btn`}
                                    disabled={props.disabled || deleteLoading}
                                    onClick={handleFileRemoved}
                                    size={ButtonSizes.Small}
                                    style={ButtonStyles.TertiaryAlt}>
                                    <Icon type={Icons.Trashcan} />
                                </Button>
                            </div>
                        )}
                    </ListBox>
                </React.Fragment>
            )}
            {// if
            CollectionUtils.hasValues(props.errorMessages) && (
                <div
                    className={`${CSS_BASE_CLASS}__errors-container c-form-field__bottom__errors`}>
                    {props.errorMessages!.map((s: string) => (
                        <label key={uuid.v4()}>{s}</label>
                    ))}
                </div>
            )}
        </div>
    );
};

// #endregion Component

// -------------------------------------------------------------------------------------------------
// #region Exports
// -------------------------------------------------------------------------------------------------

export default FileUploadField;

// #endregion Exports
