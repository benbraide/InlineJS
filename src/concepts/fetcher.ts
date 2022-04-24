import { IRouterFetcher } from "../types/router";

export class RouterFetcher implements IRouterFetcher{
    public constructor(private path_: string | RegExp, private handler_: (path: string) => Promise<string>){}
    
    public GetPath(){
        return this.path_;
    }

    public Handle(path: string){
        return this.handler_(path);
    }
}
