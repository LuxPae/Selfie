import { VStack } from "@chakra-ui/react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { primaryColor } from "../../scripts/COLORS";

interface AddFabProps {
    isCreate?: boolean;
    onOpen: () => void;
}

export const AddFab = ({isCreate = true, onOpen}: AddFabProps) => {
    return <VStack width={"72px"}
                        height={"72px"}
                        position={'fixed'}
                        bottom={"32px"}
                        right={"32px"}
                        justifyContent={'center'}
                        alignItems={'center'}
                        borderRadius={'50%'}
                        onClick={onOpen}
                        cursor={'pointer'}
                        backgroundColor={primaryColor}>
                    {isCreate ? <FaPlus color={'white'}/> : <FaEdit color="white"/>}
                </VStack>;
}