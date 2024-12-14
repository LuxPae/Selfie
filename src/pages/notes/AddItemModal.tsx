import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    useDisclosure, VStack
} from '@chakra-ui/react';
import React, {useContext, useState} from "react";
import {postNotes, putNotes} from "../../API/note";
import GlobalContext from "../../context/GlobalContext";
import {AddFab} from '../../components/molecoles/AddFab';
import { NoteModel } from '../../API/model/note';

export const AddItemModal = ({model, onClose: onCloseFunction}: { model?: NoteModel, onClose?: (value: boolean) => void }) => {
    const {text: description, title, categories} = model || {};

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [itemName, setItemName] = useState(title || "");
    const [text, setText] = useState(description || "");
    const [category, setCategory] = useState(categories?.join(";"));

    const {user} = useContext(GlobalContext);

    const handleEditItem = () => {
        const categoryList: string[] = category?.split(';').map(value => value.trim()) || [];

        // Logica per aggiungere l'elemento
        putNotes({
            id: model?._id || '',
            data: {
                title: itemName,
                categories: categoryList,
                text
            },
            // @ts-ignore
            token: user.token,
        }).then(_ => {
            onCloseFunction && onCloseFunction(true);
        });
        onClose();
    };

    const handleAddItem = () => {
        const categoryList: string[] = category?.split(';').map(value => value.trim()) || [];

        // Logica per aggiungere l'elemento
        postNotes({
            data: {
                title: itemName,
                categories: categoryList,
                text
            },
            // @ts-ignore
            token: user.token,
        }).then(_ => {
            onCloseFunction && onCloseFunction(true);
        });
        onClose();
    };

    return (
        <>
            <AddFab isCreate={!model} onOpen={onOpen}/>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>{model ? 'Modifica' : 'Crea'} una nota</ModalHeader>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Titolo</FormLabel>
                            <Input
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                placeholder="Inserisci il titolo"
                            />
                            <FormLabel marginTop={'16px'}>Testo</FormLabel>
                            <Input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Inserisci il testo"
                            />
                            <FormLabel marginTop={'16px'}>Categoria</FormLabel>
                            <Input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Inserisci la categoria"
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={model ? handleEditItem : handleAddItem}>
                         {model?'modifica':'crea'}   
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Annulla</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
