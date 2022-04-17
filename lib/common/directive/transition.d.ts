export interface ITransitionParams {
    componentId: string;
    contextElement: HTMLElement;
    callback: () => void;
    reverse?: boolean;
}
export declare function TransitionCheck({ componentId, contextElement, callback }: ITransitionParams): void;
