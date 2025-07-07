import * as React from "react";// prendo da R, metto in R obj

interface ImageProps extends Partial<React.CSSProperties> {//props stile opt
    src: string;
    alt?: string;
}

export const Image: React.FC<ImageProps> = ({ src, alt, ...other }) => {// split props, rest →

    return <img src={src} alt={alt} style={{ ...other }} />;
};
