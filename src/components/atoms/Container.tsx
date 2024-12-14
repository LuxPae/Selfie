import * as React from "react";

interface ContainerProps extends Partial<React.CSSProperties> {
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
}

export const Container: React.FC<ContainerProps> = ({ className, children, onClick, ...other }) => {
    const handleClick = onClick ? () => onClick() : undefined;

    return (
        <div className={className} style={{ ...other }} onClick={handleClick}>
            {children}
        </div>
    );
};
