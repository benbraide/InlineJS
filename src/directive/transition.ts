export interface ITransitionParams{
    componentId: string;
    contextElement: HTMLElement;
    callback: () => void;
    reverse?: boolean;
}

export function TransitionCheck({ componentId, contextElement, callback }: ITransitionParams){
    callback();
}
