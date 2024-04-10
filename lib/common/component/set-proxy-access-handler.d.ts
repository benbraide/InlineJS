import { IComponent } from "../types/component";
import { IDirectiveProxyAccessHandler } from "../types/directive";
import { IProxyAccessHandler } from "../types/proxy";
export declare function SetProxyAccessHandler(component: IComponent | string | null, proxyHandler: IProxyAccessHandler | IDirectiveProxyAccessHandler | null): () => void;
export declare function StoreProxyHandler(component: IComponent | string | null): (callback: () => void) => void;
