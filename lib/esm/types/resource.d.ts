export declare type ResourceType = 'link' | 'script' | 'data';
export interface IResourceOptions {
    type: ResourceType;
    attribute: 'href' | 'src' | 'json' | 'text';
    target: 'head' | 'body' | null;
    path: string;
    additionalAttributes?: Record<string, string>;
}
export interface IResourceMixedItemInfo {
    type: ResourceType;
    path: string;
}
export interface IResourceGetParams {
    items: IResourceMixedItemInfo | string | Array<IResourceMixedItemInfo | string>;
    concurrent?: boolean;
    attributes?: Record<string, string>;
}
export interface IResourceConcept {
    Get(params: IResourceGetParams): Promise<any>;
    GetStyle(path: string | Array<string>, concurrent?: boolean, attributes?: Record<string, string>): Promise<any>;
    GetScript(path: string | Array<string>, concurrent?: boolean, attributes?: Record<string, string>): Promise<any>;
    GetData(path: string | Array<string>, concurrent?: boolean, json?: boolean): Promise<any>;
}
