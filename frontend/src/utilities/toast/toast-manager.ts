import {
    toast,
    ToastContent,
    ToastId,
    ToastOptions,
    ToastPosition,
} from "react-toastify";
import { ToastTemplates } from "utilities/toast/toast-templates";

const defaultToastOptions: ToastOptions = {
    draggable: false,
    position: ToastPosition.BOTTOM_RIGHT,
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
};

const mergeDefaults = (...options: ToastOptions[]): ToastOptions =>
    Object.assign({}, defaultToastOptions, ...options);

export class ToastManager {
    /**
     * Show a success style toast
     * @param content either a string or a TSX element
     * @param options optionally override default toast options
     */
    static success(
        content: string | ToastContent,
        options: ToastOptions = defaultToastOptions
    ): ToastId {
        return toast.success(
            ToastTemplates.success(content),
            mergeDefaults(options)
        );
    }

    /**
     * Show an info style toast
     * @param content either a string or a TSX element
     * @param options optionally override default toast options
     */
    static info(
        content: string | ToastContent,
        options: ToastOptions = defaultToastOptions
    ): ToastId {
        return toast.info(ToastTemplates.info(content), mergeDefaults(options));
    }

    /**
     * Show a warning style toast
     * @param content either a string or a TSX element
     * @param options optionally override default toast options
     */
    static warn(
        content: string | ToastContent,
        options: ToastOptions = defaultToastOptions
    ): ToastId {
        return toast.warn(
            ToastTemplates.warning(content),
            mergeDefaults({ autoClose: 5000 }, options) // increase default timeout for warning toasts
        );
    }

    /**
     * Show an error style toast
     * @param content either a string or a TSX element
     * @param options optionally override default toast options
     */
    static error(
        content: string | ToastContent,
        options: ToastOptions = defaultToastOptions
    ): ToastId {
        return toast.error(
            ToastTemplates.error(content),
            mergeDefaults({ autoClose: 5000 }, options) // increase default timeout for error toasts
        );
    }

    /**
     * Dismiss an existing toast programatically.
     * @param toastId the ID returned by the method which created the toast
     */
    static dismiss(toastId: ToastId): void {
        toast.dismiss(toastId);
    }

    /**
     * Dismiss all toasts programatically.
     */
    static dismissAll(): void {
        toast.dismiss();
    }

    /**
     * Update an existing toast with new content; this could be useful for
     * progress indicators, network state indicators, etc.
     * @param toastId the ID of the toast to update (returned from the method that created it)
     * @param newContent the new content to render into the toast
     */
    static update(toastId: ToastId, newContent: string | ToastContent): void {
        toast.update(toastId, { render: newContent });
    }
}
