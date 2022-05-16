import { ITimeDifferenceConcept, ITimeDifferenceFormatParams, ITimeDifferenceTrackInfo, ITimeDifferenceTrackParams } from "../types/time-diff";
export declare class TimeDifferenceConcept implements ITimeDifferenceConcept {
    private checkpoints_;
    Format({ date, until, ...rest }: ITimeDifferenceFormatParams): [string, number, boolean];
    Track({ handler, until, startImmediately, ...rest }: ITimeDifferenceTrackParams): ITimeDifferenceTrackInfo;
    private Format_;
    private ComputeLabel_;
}
