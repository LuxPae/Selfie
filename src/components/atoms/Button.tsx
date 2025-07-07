import React from "react";

interface ButtonProps extends Partial<React.CSSProperties> {//TS: P attese.Opzionali 
    children: React.ReactNode;// R: props x contenuto e riuso
    onClick: () => void;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, ...other }) => {
// FC = TS sa tipo (FC R comp. riceve prop) & <T> = interf. props attesi
 // passa props extra tram style
            // props da utente; other applica props css dinamic (no obj css statico). Spread operator
            
    return (
        <button style={{ ...other }} onClick={onClick} disabled={disabled}>
           {children}
        </button>
    );
};
