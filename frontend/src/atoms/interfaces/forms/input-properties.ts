import { InputTypes } from "atoms/constants/input-types";

export interface InputProperties {
    ariaLabelledBy?: string;
    disabled?: boolean;
    isValid?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: InputTypes;
    value?: string;
}
