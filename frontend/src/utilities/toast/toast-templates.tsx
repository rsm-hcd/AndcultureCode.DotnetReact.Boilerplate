import { IconSizes } from "atoms/constants/icon-sizes";
import { Icons } from "atoms/constants/icons";
import Icon from "atoms/icons/icon";
import React from "react";
import { ToastContent } from "react-toastify";

const getTemplate = (
    icon: Icons,
    content: string | ToastContent
): ToastContent => (
    <div className="c-toast-content">
        <div className="c-toast-content__icon-container">
            <Icon
                type={icon}
                size={IconSizes.Large}
                cssClassName="c-toast-content__icon-container__icon"
            />
        </div>
        <div className="c-toast-content__body">{content}</div>
    </div>
);

export class ToastTemplates {
    static success(content: string | ToastContent): ToastContent {
        return getTemplate(Icons.CheckmarkOvalFilled, content);
    }

    static error(content: string | ToastContent): ToastContent {
        return getTemplate(Icons.Warning, content);
    }

    static warning(content: string | ToastContent): ToastContent {
        // warning uses same icon as error, just colored differently
        return ToastTemplates.error(content);
    }

    static info(content: string | ToastContent): ToastContent {
        return getTemplate(Icons.Information, content);
    }
}
