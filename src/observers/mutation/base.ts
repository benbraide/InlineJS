import { GetElementScopeId } from "../../component/element-scope-id";
import { InferComponent } from "../../component/infer";
import { JournalTry } from "../../journal/try";
import { IMutationObserver, IMutationObserverAttributeInfo, IMutationType, MutationObserverHandlerType } from "../../types/mutation";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../../utilities/unique-markers";

interface IMutationObserverHandlerInfo{
    target: Node;
    handler: MutationObserverHandlerType;
    whitelist?: Array<IMutationType>;
}

interface IMutatedInfo{
    added: Array<Node>;
    removed: Array<Node>;
    attributes: Array<IMutationObserverAttributeInfo>;
}

export class MutationObserver implements IMutationObserver{
    private uniqueMarkers_ = GetDefaultUniqueMarkers();
    
    private observer_: globalThis.MutationObserver | null = null;
    private handlers_: Record<string, IMutationObserverHandlerInfo> = {};
    
    public constructor(){
        if (globalThis.MutationObserver){
            try{
                this.observer_ = new globalThis.MutationObserver((entries) => {
                    let mutations: Record<string, IMutatedInfo> = {}, getInfo = (key: string) => {
                        return (mutations[key] = mutations[key] || {
                            added: new Array<Node>(),
                            removed: new Array<Node>(),
                            attributes: new Array<IMutationObserverAttributeInfo>(),
                        });
                    };

                    entries.forEach((entry) => {
                        let key = ((entry.target instanceof HTMLElement) ? GetElementScopeId(InferComponent(entry.target)?.GetRoot() || null) : '');
                        if (!key){//Invalid target
                            return;
                        }

                        if (entry?.type === 'childList'){
                            let info = getInfo(key);
                            info.added.push(...Array.from(entry.addedNodes));
                            info.removed.push(...Array.from(entry.removedNodes));
                        }
                        else if (entry?.type === 'attributes' && entry.attributeName){
                            getInfo(key).attributes.push({
                                name: entry.attributeName,
                                target: entry.target,
                            });
                        }
                    });

                    if (Object.keys(mutations).length == 0){
                        return;
                    }

                    Object.entries(this.handlers_).forEach(([id, info]) => {
                        let key = ((info.target instanceof HTMLElement) ? GetElementScopeId(info.target) : '');
                        if (!key || !(key in mutations)){
                            return;
                        }

                        let getList = <T>(type: IMutationType, info: IMutationObserverHandlerInfo, list: T) => {
                            return ((!info.whitelist || info.whitelist.includes(type)) ? list : undefined);
                        };
                        
                        let added = getList('add', info, mutations[key].added), removed = getList('remove', info, mutations[key].removed);
                        let attributes = getList('attribute', info, mutations[key].attributes);

                        if (added || removed || attributes){
                            JournalTry(() => info.handler({ id, added, removed, attributes }), 'InlineJS.MutationObserver');
                        }
                    });
                });

                this.observer_.observe(document, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: false,
                });
            }
            catch{
                this.observer_ = null;
            }
        }
    }

    public GetNative(){
        return this.observer_;
    }

    public Observe(target: Node, handler: MutationObserverHandlerType, whitelist?: Array<IMutationType>){
        let id = GenerateUniqueId(this.uniqueMarkers_);
        this.handlers_[id] = { target, handler, whitelist };
        return id;
    }

    public Unobserve(target: Node | string){
        if (typeof target !== 'string'){
            Object.entries(this.handlers_).filter(([key, info]) => (info.target === target)).forEach(([key]) => (delete this.handlers_[key]));
        }
        else{//Remove by ID
            delete this.handlers_[target];
        }
    }
}
