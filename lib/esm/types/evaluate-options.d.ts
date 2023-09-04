export interface IEvaluateOptions {
    componentId: string;
    contextElement: HTMLElement;
    expression: string;
    disableFunctionCall?: boolean;
    waitPromise?: 'none' | 'default' | 'recursive';
    voidOnly?: boolean;
}
