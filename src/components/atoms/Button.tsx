import React from "react";

interface ButtonProps extends Partial<React.CSSProperties> {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, ...other }) => {
    return (
        <button style={{ ...other }} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};
