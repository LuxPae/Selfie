import {Column} from "./atoms/Column";
import {TextComponent} from "./atoms/Text";
import {Input, VStack} from "@chakra-ui/react";
import {background} from "../scripts/COLORS";
import Header from "./Header";
import React, {useContext} from "react";
import GlobalContext from "../context/GlobalContext";

export default function TimeMachine() {
    const {setCurrentTime, currentTime} = useContext(GlobalContext);

    //@ts-ignore
    const handleInputChange = (event) => {
        const value = event.target.value;
        const date = new Date(value);
        const timestamp = date.getTime();
        setCurrentTime(timestamp);
    };

    return (
        <Column width={'100%'} height={'100vh'} overflow={"hidden"} backgroundColor={background}>
            <Header/>
            <VStack alignSelf={'stretch'} px={"48px"} alignItems={'flex-start'}>
                <TextComponent color={'white'}>Data selezionata</TextComponent>
                <Input
                    backgroundColor={'white'}
                    value={convertTimestampToDatetimeLocal(currentTime || Date.now())}
                    onInput={handleInputChange}
                    type={'datetime-local'}/>
            </VStack>
        </Column>
    )
}

function convertTimestampToDatetimeLocal(timestamp: number) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
