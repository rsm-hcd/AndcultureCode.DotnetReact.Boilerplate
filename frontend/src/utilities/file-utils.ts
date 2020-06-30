import Axios from "axios";
import FileRecord from "models/view-models/file-record";
import { S3Response } from "react-s3-uploader";
import S3Upload from "react-s3-uploader/s3upload";
import FileUploadDestination from "utilities/enumerations/file-upload-destination";
import NumberUtils from "utilities/number-utils";
import { RouteUtils } from "utilities/route-utils";
import FileService from "utilities/services/file-service";
import RemoteAccessDetailsService from "utilities/services/remote-access-details-service";

/**
 * have to use callbacks because of the way S3Upload class works
 */
export interface S3UploadOptions {
    fileUploadDestination?: FileUploadDestination;
    /**
     * Called when beforeUpload returns false, aborting the upload.
     */
    onAbort?: () => void;
    /**
     * Callback executed when progress state is updated (i.e. for a progress bar)
     * @param progress percent complete
     * @param status "waiting", "uploading" or "finalizing"
     * @param file the file
     */
    onProgress?: (progress: number, status: string, file: File) => void;
    /**
     * Return false if we should abort the upload
     * @param file
     */
    beforeUpload?: (file: File) => Promise<boolean>;
    /**
     * Callback when an error occurs
     * @param message
     */
    onError?: (message: string) => void;
    /**
     * Callback when the upload completes
     * @param uploadResult
     * @param file
     */
    onFinish?: (uploadResult: S3Response, file?: FileRecord) => void;
}

const uploadFile = async (
    file: File,
    options: S3UploadOptions
): Promise<S3Response | undefined> => {
    const getSignedUrl = async (
        file: File,
        callback: (params: { signedUrl: string }) => void
    ) => {
        try {
            const result = await RemoteAccessDetailsService.upload(undefined, {
                fileUploadDestination: options.fileUploadDestination,
                relativeProviderPath: file.name,
                contentType: file.type,
            });
            callback({ signedUrl: result.resultObject!.url });
        } catch (e) {
            options.onError?.("Failed to get pre-signed upload URL.");
        }
    };

    const onFinishUploading = async (uploadResult: S3Response) => {
        try {
            const relativePath = RouteUtils.absoluteToRelativePath(
                RouteUtils.removeQueryString(uploadResult.signedUrl)
            );
            const result = await FileService.create(
                new FileRecord({
                    relativeProviderPath: relativePath,
                })
            );

            options.onFinish?.(uploadResult, result.resultObject);
        } catch (e) {
            options.onError?.(
                "Failed to create file record, please try again."
            );
        }
    };

    const uploader = new S3Upload({
        onProgress: options.onProgress,
        getSignedUrl: getSignedUrl,
        onError: options.onError,
        onFinish: onFinishUploading,
        onFinishS3Put: onFinishUploading,
        uploadRequestHeaders: {},
    });
    const shouldContinue = await (options.beforeUpload?.(file) ??
        new Promise<boolean>((resolve) => resolve(true)));
    if (!shouldContinue) {
        options.onAbort?.();
        return undefined;
    }

    return await uploader.uploadFile(file);
};

const deleteFile = async (file: FileRecord): Promise<boolean> => {
    const preSignedUrlResult = await RemoteAccessDetailsService.delete(
        undefined,
        {
            relativeProviderPath: file.relativeProviderPath,
        }
    );
    // will throw error on request error, we can safely use resultObject now

    const url = preSignedUrlResult.resultObject!.url;
    await Axios.delete(url);
    await FileService.delete(file.id!);
    return true;
};

/**
 * Takes bytes as an integer and returns "X.XX Bytes/KB/MB/GB/TB" depending on how large
 * the bytes size is.
 * @param bytes
 */
const formatBytes = (bytes: number): string => {
    if (bytes === 0) {
        return "0 Bytes";
    }

    const units = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.round(Math.floor(Math.log(bytes) / Math.log(1024)));
    const unit = units[i];
    const value = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));

    return `${value} ${unit}`;
};

/**
 * Makes an HTTP HEAD request to the S3 bucket in order to get the Content-Length header.
 * Usage: use in try/catch like you would with a traditional service
 * @param file
 */
const getFileSize = async (file: FileRecord): Promise<string> => {
    const preSignedUrlResult = await RemoteAccessDetailsService.getHead(
        undefined,
        {
            relativeProviderPath: file.relativeProviderPath,
        }
    );
    // will throw error on request error, we can safely use resultObject here

    const absoluteFileUrl = preSignedUrlResult.resultObject!.url;
    const s3HeadResult = await Axios.head(absoluteFileUrl);
    const contentLengthHeader = s3HeadResult.headers["content-length"];
    const bytes = NumberUtils.parseInt(contentLengthHeader);
    if (bytes == null) {
        return "";
    }
    return formatBytes(bytes);
};

const getImageResolution = async (
    file: File
): Promise<{ width: number; height: number }> =>
    new Promise((resolve) => {
        const img = new Image();
        const fileReader = new FileReader();

        fileReader.onload = () => {
            img.src = fileReader.result as string;
        };

        img.onload = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;

            resolve({ width, height });
        };

        fileReader.readAsDataURL(file);
    });

const FileUtils = {
    deleteFile,
    formatBytes,
    getFileSize,
    getImageResolution,
    uploadFile,
};

export default FileUtils;
