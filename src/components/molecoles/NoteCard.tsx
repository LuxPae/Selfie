import React, {useMemo} from "react";
import {StackProps, VStack} from "@chakra-ui/react";
import {TextComponent} from "../atoms/Text";
import {FaTrash} from "react-icons/all";
import {NoteModel} from "../../API/model/note";
import {blueColor} from "../../scripts/COLORS";

// const backgroundColors = [
//     "#1E90FF", // DodgerBlue
//     "#9e2e00", // OrangeRed
//     "#128e12", // LimeGreen
//     "#5f0fac", // BlueViolet
//     "#9f1e65", // DeepPink
//     "#9a851e", // Gold
//     "#0b7e80", // DarkTurquoise
//     "#ba2e17", // Tomato
//     "#4682B4", // SteelBlue
//     "#6A5ACD"  // SlateBlue
// ];

interface NoteCardProps extends StackProps {
    model?: NoteModel,
    index: number;
    onDeleteFunction: (id?: string) => void;
}

export const NoteCard = ({model, index, onDeleteFunction, ...other}: NoteCardProps) => {
    const {_id, title, text: description} = model || {};

    const descriptionPreview = useMemo(() => {
        return description?.substring(0, 200) || "";
    }, [description]);

    return <VStack position={'relative'} minH={'200px'}
                   alignItems={'center'} justifyContent={'center'}
        // borderRadius={"16px"} padding={"16px"} backgroundColor={backgroundColors[index % 10]} {...other}>
                   borderRadius={"16px"} padding={"16px"} backgroundColor={blueColor} {...other}>
        <FaTrash color={'white'}
                 onClick={() => onDeleteFunction(_id)}
                 style={{
                     position: 'absolute',
                     top: '24px',
                     right: '24px',
                     height: '20px',
                     width: '20px',
                     cursor: 'pointer'
                 }}/>
        <TextComponent color={'white'} fontWeight={'bold'}>
            {title}
        </TextComponent>
        <TextComponent color={'white'} textOverflow={"ellipsis"}>
            {descriptionPreview}
        </TextComponent>
    </VStack>
}
