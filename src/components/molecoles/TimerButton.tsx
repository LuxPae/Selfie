import React, {ReactElement} from "react";
import {Button} from "../atoms/Button";
import {Row} from "../atoms/Row";
import {TextComponent} from "../atoms/Text";
import {blueColor, blueColorEndGradient} from "../../scripts/COLORS";

export const TimerButton = ({
                                title,
                                functionButtonsEnabled,
                                action,
                                icon,
                                atLeastDesktop
                            }: {
    title: string,
    functionButtonsEnabled: boolean,
    action: VoidFunction,
    icon: ReactElement,
    atLeastDesktop: boolean,
}) => {
    return <Button width={atLeastDesktop ? '40vw' : '70vw'} height={"48px"} borderRadius={"16px"} marginTop={"24px"}
                   cursor={!functionButtonsEnabled ? 'default' : 'pointer'}
                   background={!functionButtonsEnabled ? 'grey' : `linear-gradient(to bottom, ${blueColor}, ${blueColorEndGradient})`}
                   disabled={!functionButtonsEnabled}
                   onClick={action}>
        <Row alignItems="center" justifyContent="center" gap={'16px'}>
            {icon}
            <TextComponent color="white" fontWeight={'800'}
                           fontSize={14}>{title}</TextComponent>
        </Row>
    </Button>
}
