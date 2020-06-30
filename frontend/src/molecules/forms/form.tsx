import * as React from "react";

interface FormProps {
    action?: string;
    buttonText?: string;
    children?: React.ReactNode;
    cssClassName?: string;
    id?: string;
    method?: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form: React.FC<FormProps> = (props: FormProps) => {
    return (
        <form
            action={props.action}
            id={props.id}
            onSubmit={props.onSubmit}
            method={props.method}
            className={props.cssClassName || "c-form"}>
            {props.children}
        </form>
    );
};

export default Form;
