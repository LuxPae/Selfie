import * as React from "react";

export interface ColumnProps extends Partial<React.CSSProperties> {
    children: React.ReactNode;
}

export const Column: React.FC<ColumnProps> = ({children, ...other}) => {
    return <div className={"flex flex-col"} style={{...other}}>{children}</div>;
};
