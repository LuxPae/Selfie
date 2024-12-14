import {BaseResponse} from "./BaseResponse";
import {WorkMode} from "../../pages/timer/timer";

export interface Timer {
    _id?: string;
    cycles?: number;
    studyMinutes?: number;
    pauseMinutes?: number;
    timestampStart?: number;
    timestampPause?: number;
    timestampEnd?: number;
    mode?: WorkMode;
    counter?: number;
}

export type TimerResponse = BaseResponse<Timer>;
