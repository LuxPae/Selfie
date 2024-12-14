import * as React from "react";

interface StackProps extends Partial<React.CSSProperties> {
    children: React.ReactNode;
}

export const Stack: React.FC<StackProps> = ({ children, ...other }) => {
    return <div style={{ position: 'relative', ...other }}>{children}</div>;
};
