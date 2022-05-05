export interface ITimeDifferenceFormatParams{
    date: Date;
    short?: boolean;
    ucfirst?: boolean;
    capitalize?: boolean;
    until?: boolean;
}

export interface ITimeDifferenceTrackInfo{
    stop: () => void;
    resume: () => void;
    stopped: () => boolean;
}

export type ITimeDifferenceTrackHandlerType = (label: string) => void | boolean;

export interface ITimeDifferenceTrackParams extends ITimeDifferenceFormatParams{
    handler: ITimeDifferenceTrackHandlerType;
    startImmediately?: boolean;
}

export interface ITimeDifferenceConcept{
    Format(params: ITimeDifferenceFormatParams): [string, number, boolean];
    Track(params: ITimeDifferenceTrackParams): ITimeDifferenceTrackInfo;
}
