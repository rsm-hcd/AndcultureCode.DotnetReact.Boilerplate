const video = ["mkv", "mov", "mp4", "mpeg", "mpg", "webm", "wmv"];

const image = ["bpm", "gif", "jpeg", "jpg", "png"];

// can't use the name "document" in global scope
const _document = [
    "doc",
    "docx",
    "epub",
    "pdf",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "txt",
    "rtf",
];

const FileExtensions = {
    video,
    image,
    document: _document,
};

export default FileExtensions;
