import * as React from "react";

interface RowProps extends Partial<React.CSSProperties> {
    children: React.ReactNode;
    onClick?: () => void;
}

export const Row: React.FC<RowProps> = ({ children, onClick, ...other }) => {
    return <div onClick={onClick} style={{ display: 'flex', flexDirection: 'row', ...other }}>{children}</div>;
};
