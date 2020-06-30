import ResourceType from "utilities/enumerations/resource-type";
import FileExtensions from "utilities/file-extensions";

/**
 * Take a relative path (i.e. some/relative/path.jpg)
 * and return the filename (i.e. path.jpg)
 * @param path
 */
const relativePathToFilename = (path: string): string =>
    path.replace(/^.*[\\/]/, "");

/**
 * Given a path, return the file type based on extension.
 * i.e. docx => "Document", .png => "Image"
 * @param path
 */
const fileTypeLabelFromPath = (path: string) => {
    try {
        const extension = getFileExtension(path);
        if (extension == null) {
            return ResourceType.File;
        }

        if (FileExtensions.video.includes(extension)) {
            return ResourceType.Video;
        }

        if (FileExtensions.image.includes(extension)) {
            return ResourceType.Image;
        }

        if (FileExtensions.document.includes(extension)) {
            return ResourceType.Document;
        }

        return ResourceType.File;
    } catch (e) {
        return ResourceType.File;
    }
};

const getFileExtension = (path: string): string | undefined => {
    try {
        return path
            .split(".")
            .pop()!
            .toLowerCase();
    } catch (e) {
        return undefined;
    }
};

const PathUtils = {
    fileTypeLabelFromPath,
    getFileExtension,
    relativePathToFilename,
};

export default PathUtils;
