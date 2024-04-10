import { IDirective, IDirectiveProxyAccessHandler } from "../types/directive";
import { IProxyAccessHandler } from "../types/proxy";
export declare function CreateDirective(name: string, value: string, proxyAccessHandler?: IProxyAccessHandler | IDirectiveProxyAccessHandler | null): IDirective | null;
