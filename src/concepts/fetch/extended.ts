import { FetchPathHandlerType, IExtendedFetchConcept, IFetchMockResponseParams } from "../../types/fetch";
import { NativeFetchConcept } from "./native";

interface IFetchPathHandlerInfo{
    path: string | RegExp;
    handler: FetchPathHandlerType;
}

export class ExtendedFetchConcept extends NativeFetchConcept implements IExtendedFetchConcept{
    private handlers_ = new Array<IFetchPathHandlerInfo>();
    
    public Get(input: RequestInfo, init?: RequestInit){
        let handler = this.FindPathHandler_((typeof input === 'string') ? input : input.url);
        return ((handler && handler({ input, init })) || super.Get(input, init));
    }

    public AddPathHandler(path: string | RegExp, handler: FetchPathHandlerType){
        this.handlers_.push({ path, handler });
    }

    public RemovePathHandler(handler: FetchPathHandlerType){
        this.handlers_ = this.handlers_.filter(info => (info.handler !== handler));
    }

    public MockResponse({ response, delay, errorText }: IFetchMockResponseParams): Promise<Response>{
        return new Promise<Response>((resolve, reject) => {
            let decide = () => {
                let err = (errorText && ((typeof errorText === 'string') ? errorText : errorText()));
                if (err){
                    reject(err);
                }
                else{
                    resolve(new Response(response));
                }
            };
            
            if (typeof delay === 'number' && delay > 0){
                setTimeout(decide, delay);
            }
            else{//No delay
                decide();
            }
        });
    }

    private FindPathHandler_(path: string){
        let info = this.handlers_.find(info => ((typeof info.path === 'string') ? (info.path === path) : info.path.test(path)));
        return (info ? info.handler : null);
    }
}
