import { IAnimationTransition } from "../types/animation";
export interface ITransitionParams {
    componentId: string;
    contextElement: HTMLElement;
    target?: HTMLElement;
    callback: () => any;
    reverse?: boolean;
}
export declare function ResolveTransition(info: IAnimationTransition | null, reverse: boolean): IAnimationTransition | null;
export declare function TransitionCheck({ componentId, contextElement, target, callback, reverse }: ITransitionParams): (() => void) | null;
