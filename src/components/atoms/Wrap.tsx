import * as React from "react";

interface WrapProps extends Partial<React.CSSProperties> {
    children: React.ReactNode;
}

export const Wrap: React.FC<WrapProps> = ({children, ...other}) => {
    return (
        <div className={"flex flex-row flex-wrap"}
             style={{
                 ...other,
             }}
        >
            {children}
        </div>
    );
};
