import {useToast, UseToastOptions} from '@chakra-ui/react';
import {useCallback} from 'react';

type SnackbarStatus = 'info' | 'warning' | 'success' | 'error';
type SoundType = 'alert' | 'success';

interface SnackbarProps {
    status: SnackbarStatus,
    message: string,
    soundType?: "alert" | "success"
}

const useSnackbar = () => {
    const toast = useToast();

    const playSound = ({soundType}: { soundType: SoundType }) => {
        const notificationSound = soundType === 'alert' ? require('../../assets/audio/notification_alert.mp3') : require('../../assets/audio/success_alert.mp3');
        const audio = new Audio(notificationSound);
        audio.play();
    };

    return useCallback(({message, status = 'info', soundType = 'alert'}: SnackbarProps) => {
        playSound({soundType: soundType});
        const options: UseToastOptions = {
            title: message,
            status: status,
            duration: 5000,
            isClosable: true,
            position: 'bottom-right',
        };
        toast(options);
    }, [toast]);
};

export default useSnackbar;
