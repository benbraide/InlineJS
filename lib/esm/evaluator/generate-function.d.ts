import { IEvaluateOptions } from "../types/evaluate-options";
export declare function GenerateValueReturningFunction(expression: string, componentId?: string, alertAlways?: boolean): Function | null | undefined;
export declare function GenerateVoidFunction(expression: string, componentId?: string, alertAlways?: boolean): Function | null | undefined;
export declare function CallIfFunction(value: any, handler?: (value: any) => void, componentId?: string, params?: Array<any>): any;
export type GeneratedFunctionType = (handler?: (value: any) => void, params?: Array<any>, contexts?: Record<string, any>) => any;
export declare function GenerateFunctionFromString({ componentId, contextElement, expression, disableFunctionCall, waitPromise, voidOnly }: IEvaluateOptions): GeneratedFunctionType;
