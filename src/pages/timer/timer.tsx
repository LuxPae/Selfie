import {Column} from "../../components/atoms/Column";
import {FaBars, FaFastForward, FaPlay, FaStepBackward, FaStepForward, FaStop, FaTimes} from 'react-icons/fa';
import {Row} from "../../components/atoms/Row";
import {TextComponent} from "../../components/atoms/Text";
import {Button} from "../../components/atoms/Button";
import {Container} from "../../components/atoms/Container";
import {Stack} from "../../components/atoms/Stack";
import {CircularProgress} from "../../components/molecoles/CircularProgress";
import React, {useContext, useEffect, useState} from "react";
import {SettingsColumn} from "../../components/molecoles/SettingsColumn";
import useSnackbar from "../../components/atoms/Snackbar";
import {useBreakpointValue} from "@chakra-ui/react";
import {TimerButton} from "../../components/molecoles/TimerButton";
import {
    background,
    greenColor,
    greenColorEndGradient,
    grey,
    primaryColor,
    primaryColorEndGradient,
    yellowColor,
    yellowColorEndGradient
} from "../../scripts/COLORS";
import Header from "../../components/Header";
import {getLastTimer, postTimer, putTimer} from "../../API/timer";
import GlobalContext from "../../context/GlobalContext";
import {Timer} from "../../API/model/timer";

export type WorkMode = "study" | "pause" | "idle";

const TimerPage = () => {
    const {user} = useContext(GlobalContext);

    const initialSeconds: number = 40 * 60; // 40 * 60
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(false);

    const [cycles, setCycles] = useState(5);
    const [studyMinutes, setStudyMinutes] = useState(40);
    const [pauseMinutes, setPauseMinutes] = useState(10);
    const [currentTotalSeconds, setCurrentTotalSeconds] = useState(0);

    const [currentCycle, setCurrentCycle] = useState(1);
    const [currentMode, setCurrentMode] = useState<WorkMode>("idle");

    const [currentTimer, setCurrentTimer] = useState<Timer | undefined>(undefined);

    const [showMenu, setShowMenu] = useState(false);

    const atLeastDesktop = !useBreakpointValue({base: true, lg: false});

    const showSnackbar = useSnackbar();

    const {currentTime: currentDate} = useContext(GlobalContext);

    const currentTime = currentDate || Date.now();

    function getStudySeconds() {
        return studyMinutes * 60;
    }

    function getPauseSeconds() {
        return pauseMinutes * 60;
    }

    useEffect(() => {
        console.log(`currentTime => ${currentTime}`);

        // @ts-ignore
        getLastTimer({token: user.token}).then(data => {
                const timer: Timer = data?.data || {};
                const {
                    cycles,
                    timestampEnd,
                    timestampStart,
                    mode,
                    pauseMinutes: pauseMinutesApi,
                    studyMinutes: studyMinutesApi
                } = timer || {};

                if ((currentTime < (timestampEnd || 0)) && mode !== 'idle') {
                    setCurrentTimer(timer);

                    const originalEndTime = (timestampStart || 0) + (cycles || 1) * ((pauseMinutesApi || 0) * 60000 + (studyMinutesApi || 0) * 60000);
                    const timeDifference = originalEndTime - (timestampEnd || 0);

                    const newTimestampStart = (timestampStart || 0) - timeDifference;
                    const interval = Number(currentTime) - newTimestampStart;
                    const studyTime = ((studyMinutesApi || 0) * 60000);
                    const pauseTime = ((pauseMinutesApi || 0) * 60000);

                    console.log("log_1", {
                        originalEndTime: formatTimestamp(originalEndTime || 0),
                        timestampEnd: formatTimestamp(timestampEnd || 0),
                        timeDifference,
                        interval,
                        studyTime,
                        pauseTime,
                        timestampStart: formatTimestamp(timestampStart || 0),
                        newTimestampStart: formatTimestamp(newTimestampStart || 0),
                    });

                    const cycleLength = (studyTime + pauseTime);
                    const currentCycle = Math.floor(interval / cycleLength);

                    const cycleStartTime = (newTimestampStart + (currentCycle * cycleLength));
                    const studyEnd = cycleStartTime + studyTime;
                    const pauseEnd = studyEnd + pauseTime;

                    console.log("log_2", {
                        cycleStartTime: formatTimestamp(cycleStartTime || 0),
                        studyEnd: formatTimestamp(studyEnd || 0),
                        pauseEnd: formatTimestamp(pauseEnd || 0),
                    });

                    const currentPhase: WorkMode = Number(currentTime) < studyEnd ? "study" : "pause";
                    console.log('currentPhase', {currentPhase, currentTime, studyEnd});
                    const currentSecond = Math.floor((currentPhase === 'study' ? (studyEnd - Number(currentTime)) : (pauseEnd - Number(currentTime))) / 1000);

                    setCycles(cycles || 1);
                    setStudyMinutes(studyMinutes || 0);
                    setPauseMinutes(pauseMinutes || 0);
                    setCurrentMode(currentPhase || "study");
                    setCurrentCycle(currentCycle + 1 || 0);

                    setSeconds(currentSecond);

                    setIsActive(true);
                } else {
                    setIsActive(false);
                    //
                    // setCycles(5);
                    // setStudyMinutes(studyMinutes || 0);
                    // setPauseMinutes(pauseMinutes || 0);
                    // setCurrentMode("idle");
                    // setSeconds(initialSeconds);
                }
            }
        );
    }, [user]);

    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (isActive && seconds > 0) {
            timerId = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);
        }

        return () => clearInterval(timerId);
    }, [isActive, seconds]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    function getCurrentTotalSeconds() {
        if (currentMode === 'pause') return getPauseSeconds();
        return getStudySeconds();
    }

    const handlePlay = () => {
        setIsActive(true);
        setCurrentMode('study');

        setCurrentTotalSeconds(getCurrentTotalSeconds);

        postTimer({
            // @ts-ignore
            token: user.token,
            data: {
                cycles: cycles,
                studyMinutes: studyMinutes,
                pauseMinutes: pauseMinutes,
                timestampStart: currentTime,
                timestampEnd: currentTime + cycles * (getStudySeconds() * 1000) + cycles * (getPauseSeconds() * 1000),
                mode: currentMode,
                counter: currentCycle
            }
        }).then((data) => {
            const timer: Timer = data?.data?.data || {};
            setCurrentTimer(timer);
        });
    };

    const handleStop = () => {
        setIsActive(false);
        setSeconds(getStudySeconds);
        setCurrentCycle(1);
        setCurrentMode('idle');

        putTimer({
            id: currentTimer?._id || "",
            // @ts-ignore
            token: user.token,
            data: {
                mode: 'idle',
            }
        }).then((data) => {
            setCurrentTimer(prevState => ({...prevState, ...(data?.data?.data)}));
        });
    }

    const nextStep = () => {
        const prevSeconds = seconds;
        const {timestampEnd} = currentTimer || {};

        if (currentMode === 'study') {
            setSeconds(getPauseSeconds);
            setCurrentMode('pause');

            putTimer({
                id: currentTimer?._id || "",
                // @ts-ignore
                token: user.token,
                data: {
                    mode: "pause",
                    timestampEnd: (timestampEnd || 0) - (getStudySeconds() * 1000 - prevSeconds),
                }
            }).then((data) => {
                setCurrentTimer(prevState => ({...prevState, ...(data?.data?.data)}));
            });
        } else {
            if (currentCycle < cycles) {
                setSeconds(getStudySeconds);
                setCurrentMode('study');
                setCurrentCycle(currentCycle + 1);

                putTimer({
                    id: currentTimer?._id || "",
                    // @ts-ignore
                    token: user.token,
                    data: {
                        mode: "study",
                        counter: currentCycle + 1,
                        timestampEnd: (timestampEnd || 0) - (getPauseSeconds() * 1000 - prevSeconds),
                    }
                }).then((data) => {
                    setCurrentTimer(prevState => ({...prevState, ...(data?.data?.data)}));
                });
            } else {
                handleStop();
            }
        }
    }

    const restartCycle = () => {
        const prevSeconds = seconds;
        const {timestampEnd} = currentTimer || {};

        const secondsToAdd = currentMode === 'study' ? prevSeconds : (getStudySeconds() * 1000 + prevSeconds);

        setCurrentMode('study');
        setSeconds(getStudySeconds);

        putTimer({
            id: currentTimer?._id || "",
            // @ts-ignore
            token: user.token,
            data: {
                mode: currentMode,
                timestampEnd: (timestampEnd || 0) + secondsToAdd,
            }
        }).then((data) => {
            setCurrentTimer(prevState => ({...prevState, ...(data?.data?.data)}));
        });
    }

    const nextCycle = () => {
        const prevSeconds = seconds;
        const {timestampEnd} = currentTimer || {};

        const secondsToRemove = currentMode === 'study' ? ((getPauseSeconds() * 1000) + ((getStudySeconds() * 1000) - prevSeconds)) : (getPauseSeconds() * 1000 - prevSeconds);

        setCurrentMode('study');
        setSeconds(getStudySeconds);
        setCurrentCycle(currentCycle + 1);

        putTimer({
            id: currentTimer?._id || "",
            // @ts-ignore
            token: user.token,
            data: {
                mode: currentMode,
                counter: currentCycle + 1,
                timestampEnd: (timestampEnd || 0) - secondsToRemove,
            }
        }).then((data) => {
            setCurrentTimer(prevState => ({...prevState, ...(data?.data?.data)}));
        });
    }

    const functionButtonsEnabled = isActive && currentCycle < cycles;

    function getMoodColor() {
        if (!isActive) return primaryColor;
        if (currentMode === 'study') return greenColor;
        if (currentMode === 'pause') return yellowColor;
        return primaryColor;
    }

    function getMoodColorEndGradient() {
        if (!isActive) return primaryColorEndGradient;
        if (currentMode === 'study') return greenColorEndGradient;
        if (currentMode === 'pause') return yellowColorEndGradient;
        return primaryColorEndGradient;
    }

    useEffect(() => {
        setSeconds(getStudySeconds);
        setCurrentMode('study');
        setCurrentCycle(1);
        setIsActive(false);
    }, [studyMinutes]);

    useEffect(() => {
        if (seconds === 0) {
            if (currentCycle < cycles) {
                if (currentMode === 'pause' || currentMode === 'idle') {
                    setSeconds(getStudySeconds);
                    setCurrentMode('study');
                    setCurrentCycle(currentCycle + 1);
                    showSnackbar({message: "E' tempo di tornare a studiare", status: "warning"});

                    putTimer({
                        id: currentTimer?._id || "",
                        // @ts-ignore
                        token: user.token,
                        data: {
                            mode: "study",
                            counter: currentCycle + 1,
                            // timestampStart: currentTime,
                            // timestampEnd: currentTime + (studyMinutes * 1000)
                        }
                    }).then((data) => {
                        setCurrentTimer(prevState => ({...prevState, ...(data?.data?.data)}));
                    });
                }
                if (currentMode === 'study') {
                    setSeconds(getPauseSeconds);
                    setCurrentMode('pause');
                    showSnackbar({message: "E' tempo di fare una pausa", status: "info"});

                    putTimer({
                        id: currentTimer?._id || "",
                        // @ts-ignore
                        token: user.token,
                        data: {
                            mode: "pause",
                            counter: currentCycle + 1,
                            // timestampStart: currentTime,
                            // timestampEnd: currentTime + (pauseMinutes * 1000)
                        }
                    }).then((data) => {
                        setCurrentTimer(prevState => ({...prevState, ...(data?.data?.data)}));
                    });
                }
            } else {
                handleStop();
                showSnackbar({
                    message: "Hai completato la sessione di studio",
                    status: "success",
                    soundType: 'success'
                });
            }
        }
    }, [currentCycle, currentMode, cycles, getPauseSeconds, getStudySeconds, pauseMinutes, seconds, showSnackbar, studyMinutes]);

    return (
        <Column backgroundColor="rgb(43, 43, 43)" width={'100vw'} paddingBottom={"24px"}>
            <Header/>
            <Row padding={16} width={'100%'} alignItems="center" gap={'16px'} alignSelf="flex-start">
                {(!showMenu && !atLeastDesktop) &&
                    <FaBars color={'white'}
                            style={{width: '24px', height: '24px', cursor: 'pointer', marginRight: '16px'}}
                            onClick={_ => {
                                setShowMenu(true);
                            }}/>}
                {(showMenu && !atLeastDesktop) &&
                    <FaTimes color={'white'}
                             style={{width: '24px', height: '24px', cursor: 'pointer', marginRight: '16px'}}
                             onClick={_ => {
                                 setShowMenu(false);
                             }}/>}
            </Row>

            <Container height={1} opacity='0.3' backgroundColor={grey}/>

            {showMenu && <Column width={'100%'} height={'100%'} backgroundColor="rgb(43, 43, 43)" paddingBottom={'24px'} zIndex={5}>
                <SettingsColumn
                    setCycles={setCycles}
                    setStudyMinutes={setStudyMinutes}
                    setPauseMinutes={setPauseMinutes}
                    colorMood={getMoodColor()}
                    colorMoodEndGradient={getMoodColorEndGradient()}
                    cyclesNumber={cycles}
                    studyNumber={studyMinutes}
                    pauseNumber={pauseMinutes}
                    width={'100vw'}
                    currentTimer={currentTimer}
                />
            </Column>}

            {!showMenu && <Row height={'100%'} flex={1} alignItems={'center'} backgroundColor="rgb(43, 43, 43)" paddingBottom={'24px'} justifyContent={'center'}>
                {atLeastDesktop && <SettingsColumn setCycles={setCycles}
                                                   setStudyMinutes={setStudyMinutes}
                                                   setPauseMinutes={setPauseMinutes}
                                                   colorMood={getMoodColor()}
                                                   colorMoodEndGradient={getMoodColorEndGradient()}
                                                   cyclesNumber={cycles}
                                                   studyNumber={studyMinutes}
                                                   pauseNumber={pauseMinutes}
                                                   currentTimer={currentTimer}
                />}

                <Column width={atLeastDesktop ? '60vw' : '100vw'} paddingBottom={'24px'} backgroundColor={background} alignItems="center"
                        justifyContent={'center'}>

                    <TextComponent
                        color="white"
                        justifySelf="center"
                        fontWeight={800}
                        fontSize={32}>{currentCycle} / {cycles}</TextComponent>

                    <Stack justifyContent={'center'}>
                        <TextComponent
                            position="absolute"
                            top='50%'
                            left={"50%"}
                            transform="translate(-50%, -50%)"
                            color="white"
                            justifySelf="center"
                            fontWeight={800}
                            fontSize={32}>{formatTime(seconds)}</TextComponent>
                        <CircularProgress radius={150} progress={(100 * seconds) / currentTotalSeconds}
                                          strokeColor={getMoodColor()}/>
                    </Stack>

                    <Button width={atLeastDesktop ? '40vw' : '70vw'} height={"48px"} borderRadius={"16px"}
                            marginTop={"48px"}
                            background={`linear-gradient(to bottom, ${getMoodColor()}, ${getMoodColorEndGradient()})`}
                            onClick={!isActive ? handlePlay : handleStop}>
                        <Row alignItems="center" justifyContent="center" gap={'16px'}>
                            {isActive ? <FaStop color="white" size={12}/> : <FaPlay color="white" size={12}/>}
                            <TextComponent color="white" fontWeight={'800'}
                                           fontSize={14}>{!isActive ? 'AVVIA'.toUpperCase() : 'STOP'.toUpperCase()}</TextComponent>
                        </Row>
                    </Button>

                    <TimerButton
                        functionButtonsEnabled={functionButtonsEnabled}
                        action={nextStep}
                        icon={<FaStepForward color="white" size={12}/>}
                        atLeastDesktop={atLeastDesktop}
                        title={"SALTA UNO STEP"}/>

                    <TimerButton
                        functionButtonsEnabled={functionButtonsEnabled}
                        action={restartCycle}
                        icon={<FaStepBackward color="white" size={12}/>}
                        atLeastDesktop={atLeastDesktop}
                        title={"RICOMINCIA IL CICLO"}/>

                    <TimerButton
                        functionButtonsEnabled={functionButtonsEnabled}
                        action={nextCycle}
                        icon={<FaFastForward color="white" size={12}/>}
                        atLeastDesktop={atLeastDesktop}
                        title={"SALTA UN CICLO"}/>
                </Column>
            </Row>}
        </Column>
    );
};

export function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
}

const StudyTime = () => { return ( <div className="study-time"></div> ); };

export default TimerPage;
