import { IConfigOptions } from "../types/config";
import { IGlobal } from "../types/global";
export declare const InlineJSGlobalKey = "__InlineJS_GLOBAL_KEY__";
export declare function CreateGlobal(configOptions?: IConfigOptions, idOffset?: number): IGlobal;
export declare function GetOrCreateGlobal(configOptions?: IConfigOptions, idOffset?: number): IGlobal;
