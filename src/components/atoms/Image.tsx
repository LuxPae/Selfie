import * as React from "react";

interface ImageProps extends Partial<React.CSSProperties> {
    src: string;
    alt?: string;
}

export const Image: React.FC<ImageProps> = ({ src, alt, ...other }) => {
    return <img src={src} alt={alt} style={{ ...other }} />;
};
