import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ContextWrapper from "./context/ContextWrapper.js"
import {ChakraProvider, theme} from "@chakra-ui/react"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ContextWrapper>
            <ChakraProvider theme={theme}>
                <App/>
            </ChakraProvider>
        </ContextWrapper>
    </React.StrictMode>
);
