import { IGlobal } from "../types/global";
export declare const GlobalCreatedEvent = "inlinejs.global.created";
export declare function GetGlobal(): IGlobal;
export declare function WaitForGlobal(): Promise<unknown>;
