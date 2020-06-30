/**
 * This is needed because the <code>new File()</code> constructor
 * is not supported on IE, Edge, or Safari: https://caniuse.com/#feat=fileapi
 * This implements the full standard File API interface excluding the property
 * <code>webkitRelativePath</code> because this API has not been standardized.
 * Source: https://developer.mozilla.org/en-US/docs/Web/API/File
 */
/* tslint:disable */
declare global {
    // extend the global Window interface and add the missing File class property
    interface Window {
        File: any;
    }
}
const registerFileConstructorPolyfill = () => {
    try {
        new File([], "");
    } catch (e) {
        // @ts-ignore
        window.File = class WindowFile extends Blob {
            public lastModifiedDate: Date;
            public name: string;
            // @ts-ignore
            constructor(bits, filename, opts = {}) {
                super(bits, opts);
                this.lastModifiedDate = new Date();
                this.name = filename;
            }
            get lastModified(): Date {
                return this.lastModifiedDate;
            }
            set lastModified(date: Date) {
                this.lastModifiedDate = date;
            }
        };
    }
};
/* tslint:enable */

const registerGetBoundingClientRectPolyfill = () => {
    (function(global) {
        if (!("window" in global && "document" in global)) return;

        //----------------------------------------------------------------------
        //
        // CSSOM View Module
        // https://dev.w3.org/csswg/cssom-view/
        //
        //----------------------------------------------------------------------

        // Fix for IE8-'s Element.getBoundingClientRect()
        if (
            "TextRectangle" in global &&
            !("width" in (global as any).TextRectangle.prototype)
        ) {
            Object.defineProperties((global as any).TextRectangle.prototype, {
                width: {
                    get: function() {
                        return this.right - this.left;
                    },
                },
                height: {
                    get: function() {
                        return this.bottom - this.top;
                    },
                },
            });
        }
    })(window);
};

const PolyfillUtils = {
    registerFileConstructorPolyfill,
    registerGetBoundingClientRectPolyfill,
};

export default PolyfillUtils;
