import React from "react";

interface CircularProgressProps extends Partial<React.CSSProperties> {
    progress: number;
    strokeColor?: string;
    radius?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ progress, strokeColor = 'red', radius = 100, ...other }) => {
    const stroke = 10;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const strokeDashoffset = circumference - progress / 100 * circumference;

    return (
        <svg
            style={{ ...other }}
            height={radius * 2}
            width={radius * 2}
        >
            <circle
                stroke={strokeColor}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
        </svg>
    );
};
