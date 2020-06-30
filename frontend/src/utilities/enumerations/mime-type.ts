/**
 * the string values should be the mime-type of
 * the desired file type. You can accept a generic type
 * (i.e. any image type) by using a wildcard in the type/subtype
 * pattern, for example, to allow any image type, "image/*",
 * or you can limit to only png images by using "image/png".
 *
 * @see https://www.iana.org/assignments/media-types/media-types.xhtml
 */
const MimeTypes = {
    Image: [
        // these formats are supported by all browsers
        "image/bmp",
        "image/gif",
        "image/ico",
        "image/jpeg",
        "image/png",
        "image/svg+xml",
    ],
};

export default MimeTypes;
