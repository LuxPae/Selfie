import {Column} from "../../components/atoms/Column";
import {Container} from "../../components/atoms/Container";
import React, {useContext, useEffect, useState} from "react";
import {AddItemModal} from "./AddItemModal";
import {Outlet, useNavigate} from "react-router-dom";
import {ScrollableAreaY} from "../../components/atoms/ScrollableAreaY";
import {background, grey} from "../../scripts/COLORS";
import {deleteNote, getNotes} from "../../API/note";
import {NoteModel} from "../../API/model/note";
import GlobalContext from "../../context/GlobalContext";
import {NoteCard} from "../../components/molecoles/NoteCard";
import Header from "../../components/Header";
import {VStack} from "@chakra-ui/react";
import {TextComponent} from "../../components/atoms/Text";

export default function NotesPage() {
    return <>
        <Column width={'100vw'} height={'100vh'} overflowY={"hidden"} backgroundColor={background}>
            <Header/>
            <ScrollableAreaY>
                <Outlet />
            </ScrollableAreaY>
        </Column>
    </>
}

const AddFab = ({callback}: { callback: VoidFunction }) => {
    return <AddItemModal onClose={(value) => {
        if (value) {
            callback();
        }
    }}/>
}

export const NotesContent = () => {
    const [noteList, setNoteList] = useState<NoteModel[]>([]);
    const [currentId, setCurrentId] = useState<string | undefined>();

    const {user} = useContext(GlobalContext);

    useEffect(() => {
        fetchNotes();
    }, []);

    
    async function fetchNotes() {
        // @ts-ignore
        await getNotes({token: user.token}).then(value => {
            const result = (value?.data as NoteModel[]) || [];
            setNoteList(result);
        });
    }

    const navigate = useNavigate();

    return <VStack width={'100%'}>
        <TextComponent color={'white'} fontWeight={'bold'} fontSize={24} marginTop={'24px'} marginBottom={'8px'}>Seleziona
            una nota per
            vedere il suo dettaglio</TextComponent>
        <Container opacity='0.3' marginRight={16} backgroundColor={grey}/>
        <ScrollableAreaY alignSelf={'stretch'} alignItems={'stretch'}>
            <Column gap={"16px"} padding={'48px'} columnGap={'16px'} rowGap={'16px'}>
                {noteList.map((value, index) => {
                    return <NoteCard key={`note_id_${index}`} cursor={'pointer'} onDeleteFunction={id => {
                        // @ts-ignore
                        deleteNote({id: id || "", token: user.token}).then(value1 => {fetchNotes().then(() => {
                            navigate('/notes');
                        });});
                    }} model={value} index={index} onClick={() => {
                        setCurrentId(value._id);
                        navigate(`/notes/detail/${value._id}`);
                    }}/>
                })}
            </Column>
        </ScrollableAreaY>
        <AddFab callback={() => fetchNotes()}/>
    </VStack>
}
