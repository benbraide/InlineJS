import { IEvaluateOptions } from "../types/evaluate-options";
export declare function GenerateValueReturningFunction(expression: string, contextElement: HTMLElement, componentId?: string): any;
export declare function GenerateVoidFunction(expression: string, contextElement: HTMLElement, componentId?: string): any;
export declare function CallIfFunction(value: any, handler?: (value: any) => void, componentId?: string, params?: Array<any>): any;
export declare type GeneratedFunctionType = (handler?: (value: any) => void, params?: Array<any>, contexts?: Record<string, any>) => any;
export declare function GenerateFunctionFromString({ componentId, contextElement, expression, disableFunctionCall, waitPromise }: IEvaluateOptions): GeneratedFunctionType;
