import * as React from "react";

interface TextProps extends Partial<React.CSSProperties> {
    children: React.ReactNode;
}

export const TextComponent: React.FC<TextProps> = ({ children, ...other }) => {
    return <span style={{ ...other }}>{children}</span>;
};
