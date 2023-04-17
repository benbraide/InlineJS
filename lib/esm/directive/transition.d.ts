import { IAnimationEaseParams, IAnimationTransition } from "../types/animation";
export interface ITransitionParams {
    componentId: string;
    contextElement: HTMLElement;
    target?: HTMLElement;
    callback: (waited: boolean) => any;
    onAbort?: () => void;
    onPass?: (params: IAnimationEaseParams) => void;
    reverse?: boolean;
    allowRepeats?: boolean;
}
export declare const DefaultTransitionDuration = 300;
export declare const DefaultTransitionDelay = 0;
export declare const DefaultTransitionRepeats = 0;
export declare function ResolveTransition(info: IAnimationTransition | null, reverse: boolean): IAnimationTransition | null;
export declare function WaitTransition({ componentId, contextElement, target, callback, onAbort, onPass, reverse, allowRepeats }: ITransitionParams): (() => void) | null;
