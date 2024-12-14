import {Box, HStack, Spinner, StackProps, VStack} from "@chakra-ui/react";
import {TextComponent} from "../../components/atoms/Text";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {FaTimes} from "react-icons/fa";
import {NoteModel} from "../../API/model/note";
import {getNote} from "../../API/note";
import {primaryColor} from "../../scripts/COLORS";
import {formatDate} from "../../scripts/utils";
import GlobalContext from "../../context/GlobalContext";
import { Row } from "../../components/atoms/Row";
import { Column } from "../../components/atoms/Column";
import { AddItemModal } from "../notes/AddItemModal";

const AddFabModal = ({callback, data}: { callback?: VoidFunction, data: NoteModel }) => {
    return <AddItemModal model={data} onClose={(value) => {
        if (value && callback) {
            callback();
        }
    }}/>
}

export const NoteDetail = ({...props}: StackProps) => {
    const [data, setData] = useState<NoteModel>();
    const [isLoading, setIsLoading] = useState(false);
    const {id: noteId} = useParams() || {};
    const navigate = useNavigate();

    const {user} = useContext(GlobalContext);

    function fetchNote() {
        setIsLoading(true);
        try {
            noteId && getNote({
                id: noteId,
                // @ts-ignore
                token: user.token,
            }).then(value => setData((value?.data as NoteModel) || {})).finally(() => setIsLoading(false));
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchNote();
    }, [noteId]);

    if (isLoading) {
        return <VStack width={"100%"} height={"100%"} justifyContent={'center'} alignItems={'center'}>
            <Spinner size={'xl'} color={primaryColor}/>
        </VStack>
    }

    if (data) {
        const {title, text, categories, creation_date, edit_date} = data || {};
        return <VStack width={"100%"} height={"100%"} position={'relative'} alignItems={'flex-start'}
                       padding={'24px'} {...props}>
            <Box onClick={() => navigate(-1)} cursor={'pointer'}>
                <FaTimes width={'48px'} height={'48px'} size={32} color={'white'}/>
            </Box>
            <Row gap={"12px"}>
            {(categories?.length || 0) > 0 &&
                <TextComponent padding={'8px'} marginTop={'24px'} backgroundColor={primaryColor} borderRadius={'16px'}
                               fontWeight={'normal'} color={'white'}>{categories}</TextComponent>
                               }
            </Row>
            <Column alignItems="center" alignSelf="center">
                <TextComponent alignSelf={'center'} fontWeight={'bold'} fontSize={24}
                            color={'white'}>{title}</TextComponent>
                {/* <HStack width={'100%'} justifyContent={'space-between'}> */}
                    <TextComponent marginTop={'16px'} fontWeight={'normal'} color={'white'}><b>Creata
                        il:</b> {formatDate({date: creation_date})}</TextComponent>
                    <TextComponent fontWeight={'normal'} color={'white'}><b>Modificata
                        il:</b> {formatDate({date: edit_date})}</TextComponent>
                {/* </HStack> */}
                <TextComponent marginTop={'24px'} fontWeight={'normal'} color={'white'}>{text}</TextComponent>
            </Column>

            <AddFabModal data={data} callback={() => fetchNote()} />
        </VStack>
    }

    return <></>;
}
