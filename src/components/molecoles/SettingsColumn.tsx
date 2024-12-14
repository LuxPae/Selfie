import React, {useContext, useState} from "react";
import {TextComponent} from "../atoms/Text";
import {Input} from "@chakra-ui/react";
import {Column, ColumnProps} from "../atoms/Column";
import {Button} from "../atoms/Button";
import {putTimer} from "../../API/timer";
import {Timer} from "../../API/model/timer";
import GlobalContext from "../../context/GlobalContext";

interface SettingsColumnProps extends ColumnProps {
    setCycles: React.Dispatch<React.SetStateAction<number>>;
    setStudyMinutes: React.Dispatch<React.SetStateAction<number>>;
    setPauseMinutes: React.Dispatch<React.SetStateAction<number>>;
    colorMood: string;
    colorMoodEndGradient: string;
    studyNumber: number;
    pauseNumber: number;
    cyclesNumber: number;
    currentTimer: Timer;
}

export const SettingsColumn = ({
                                   setCycles,
                                   setStudyMinutes,
                                   setPauseMinutes,
                                   colorMood,
                                   colorMoodEndGradient,
                                   studyNumber,
                                   pauseNumber,
                                   cyclesNumber,
                                   currentTimer,
                                   ...other
                               }: Partial<SettingsColumnProps>) => {
    const [cyclesInput, setCyclesInput] = useState<number>();
    const [studyMinutesInput, setStudyMinutesInput] = useState<number>();
    const [pauseMinutesInput, setPauseMinutesInput] = useState<number>();

    const [totalTimeInput, setTotalTimeInput] = useState<string>();

    const {user} = useContext(GlobalContext);

    const handleUpdate = () => {
        putTimer({
            id: currentTimer?._id || "",
            // @ts-ignore
            token: user.token,
            data: {
                mode: 'idle',
            }
        });

        if (cyclesInput && studyMinutesInput && pauseMinutesInput) {
            console.log(`Cycles: ${cyclesInput}, Study Minutes: ${studyMinutesInput}, Pause Minutes: ${pauseMinutesInput}`);
            setCycles!(cyclesInput);
            setStudyMinutes!(studyMinutesInput);
            setPauseMinutes!(pauseMinutesInput);
        } else if (totalTimeInput) {
            const [hours, minutes] = totalTimeInput.split(':').map(Number);
            const totalMinutes = (hours * 60) + minutes;

            let cycleCount = 1;
            let studyCount = totalMinutes / 6 * 5;

            while (studyCount > 60) {
                studyCount = (totalMinutes / ++cycleCount) / 6 * 5;
            }

            const calculatedCycles = Math.floor(cycleCount);

            const studyTime = Math.floor(studyCount);
            const pauseTime = (totalMinutes / cycleCount) - studyTime;

            setCycles!(calculatedCycles);
            setStudyMinutes!(studyTime);
            setPauseMinutes!(pauseTime);

            console.log(`Cycles: 8, Study Minutes: ${studyTime}, Pause Minutes: ${pauseTime}`);
        }
    };

    return <Column width={'40vw'} paddingLeft={'5vw'} overflowY={'auto'} paddingRight={'36px'} {...other}>
        <TextComponent fontSize={24}
                       marginTop={'24px'}
                       fontWeight={'bold'}
                       paddingBottom={'8px'}
                       color={'white'}>
            Sono impostati {cyclesNumber} cicli, {studyNumber} minuti di studio e {pauseNumber} minuti di pausa
        </TextComponent>

        <TextComponent fontSize={16}
                       marginTop={'24px'}
                       fontWeight={'bold'}
                       paddingBottom={'8px'}
                       color={'white'}>
            Numero di cicli
        </TextComponent>

        <Input
            className={'settings_input'}
            placeholder="Es. 5"
            value={cyclesInput}
            type="number"
            color={'white'}
            _placeholder={{
                textColor: 'white'
            }}
            onChange={(e) => {
                setTotalTimeInput("");
                setCyclesInput(Number(e.target.value));
            }}/>

        <TextComponent fontSize={16}
                       marginTop={'24px'}
                       fontWeight={'bold'}
                       paddingBottom={'8px'}
                       color={'white'}>
            Minuti di studio
        </TextComponent>

        <Input
            placeholder="Es. 30"
            type="number"
            value={studyMinutesInput}
            color={'white'}
            _placeholder={{
                textColor: 'white'
            }}
            onChange={(e) => {
                setTotalTimeInput("");
                setStudyMinutesInput(Number(e.target.value));
            }}
        />

        <TextComponent fontSize={16}
                       marginTop={'24px'}
                       fontWeight={'bold'}
                       paddingBottom={'8px'}
                       color={'white'}>
            Minuti di pausa
        </TextComponent>

        <Input
            placeholder="Es. 5"
            type="number"
            value={pauseMinutesInput}
            color={'white'}
            _placeholder={{
                textColor: 'white'
            }}
            onChange={(e) => {
                totalTimeInput && setTotalTimeInput("");
                setPauseMinutesInput(Number(e.target.value));
            }}
        />

        <TextComponent fontSize={16}
                       marginTop={'24px'}
                       marginBottom={'16px'}
                       color={'white'}>
            Oppure inserisci il tempo totale disponibile nel formato hh:mm; il sistema calcolerà
            automaticamente i cicli di studio e pausa basandosi su questo valore.
        </TextComponent>

        <TextComponent fontSize={16}
                       marginTop={'24px'}
                       fontWeight={'bold'}
                       paddingBottom={'8px'}
                       color={'white'}>
            Tempo totale (hh:mm)
        </TextComponent>

        <Input
            placeholder="Es. 1:30"
            value={totalTimeInput}
            color={'white'}
            _placeholder={{
                textColor: 'white'
            }}
            onChange={(e) => {
                cyclesInput && setCyclesInput(0);
                studyMinutesInput && setStudyMinutesInput(0);
                pauseMinutesInput && setPauseMinutesInput(0);
                return setTotalTimeInput(e.target.value);
            }}
        />

        <Button height={"48px"} borderRadius={"16px"} marginTop={"48px"}
                background={`linear-gradient(to bottom, ${colorMood}, ${colorMoodEndGradient})`}
                onClick={handleUpdate}>
            <TextComponent color="white" fontWeight={'800'}
                           fontSize={14}>Aggiorna</TextComponent>
        </Button>
    </Column>
}
