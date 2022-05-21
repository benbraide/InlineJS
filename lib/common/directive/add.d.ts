import { FunctionDirectiveHandlerType, IDirectiveHandler, IDirectiveHandlerCallbackDetails, WrappedFunctionDirectiveHandlerType } from "../types/directive";
export declare function AddDirectiveHandler(handler: IDirectiveHandler | IDirectiveHandlerCallbackDetails | FunctionDirectiveHandlerType | WrappedFunctionDirectiveHandlerType, target?: string): void;
