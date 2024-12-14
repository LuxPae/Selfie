import * as React from "react";
import {PropsWithChildren} from "react";
import {primaryColor, primaryColorEndGradient} from "../../scripts/COLORS";
import {VStack} from "@chakra-ui/react";
import {ContainerProps} from "@chakra-ui/react/dist/types/container/container";

export const ScrollableAreaY = ({children, ...other}: PropsWithChildren<Partial<ContainerProps>>) => {
    return <VStack overflowY={'auto'} css={{
        '&::-webkit-scrollbar': {
            width: '12px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'trasparent',
            marginTop: '24px',
            marginBottom: '24px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: primaryColor,
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: primaryColorEndGradient,
        },
    }} {...other}>
        {children}
    </VStack>
}
