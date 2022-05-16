import { IResourceConcept, IResourceGetParams, IResourceOptions } from "../types/resource";
export declare class Resource implements IResourceConcept {
    private origin_;
    private loadMap_;
    constructor(origin_?: string);
    Get({ items, concurrent, attributes }: IResourceGetParams): Promise<any>;
    GetStyle(path: string | Array<string>, concurrent?: boolean, attributes?: Record<string, string>): Promise<any>;
    GetScript(path: string | Array<string>, concurrent?: boolean, attributes?: Record<string, string>): Promise<any>;
    GetData(path: string | Array<string>, concurrent?: boolean, json?: boolean): Promise<any>;
    private Get_;
    static BuildOptions(type: 'link' | 'script' | 'data', path: string, attributes?: Record<string, string>, json?: boolean): IResourceOptions;
}
