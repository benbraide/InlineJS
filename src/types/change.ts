export type ChangeType = 'set' | 'delete';

export interface IChange{
    componentId: string;
    type: ChangeType;
    path: string;
    prop: string;
    origin: any;
}

export interface IBubbledChange{
    original: IChange;
    path: string;
}

export type ChangeCallbackType = (changes: Array<IChange | IBubbledChange>) => void;
