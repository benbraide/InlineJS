import { GetElementScopeId } from "../component/element-scope-id";
import { InferComponent } from "../component/infer";
import { JournalTry } from "../journal/try";
import { IMutationObserver, IMutationObserverAttributeInfo, IMutationType, MutationObserverHandlerType } from "../types/mutation";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../utilities/unique-markers";

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
                    const mutations: Record<string, IMutatedInfo> = {}, getInfo = (key: string) => {
                        return (mutations[key] = mutations[key] || {
                            added: new Array<Node>(),
                            removed: new Array<Node>(),
                            attributes: new Array<IMutationObserverAttributeInfo>(),
                        });
                    };

                    entries.forEach((entry) => {
                        if (entry?.type === 'childList'){
                            const pushRemovedNode = (node: Node) => {
                                const key = GetElementScopeId(InferComponent(<HTMLElement>node)?.GetRoot() || null);
                                if (key){
                                    getInfo(key).removed.push(node);
                                }
                                else{//Try children
                                    Array.from(node.childNodes).filter(child => !child.contains(node)).forEach(pushRemovedNode);
                                }
                            };
                            
                            entry.removedNodes.forEach(pushRemovedNode);

                            const key = ((entry.target instanceof HTMLElement) ? GetElementScopeId(InferComponent(entry.target)?.GetRoot() || null) : '');
                            key && getInfo(key).added.push(...Array.from(entry.addedNodes));
                        }
                        else if (entry?.type === 'attributes' && entry.attributeName){
                            const key = ((entry.target instanceof HTMLElement) ? GetElementScopeId(InferComponent(entry.target)?.GetRoot() || null) : '');
                            key && getInfo(key).attributes.push({
                                name: entry.attributeName,
                                target: entry.target,
                            });
                        }
                    });

                    if (Object.keys(mutations).length == 0){
                        return;
                    }

                    Object.entries(this.handlers_).forEach(([id, info]) => {
                        const key = ((info.target instanceof HTMLElement) ? GetElementScopeId(info.target) : '');
                        if (!key || !(key in mutations)){
                            return;
                        }

                        const getList = <T>(type: IMutationType, info: IMutationObserverHandlerInfo, list: T) => {
                            return ((!info.whitelist || info.whitelist.includes(type)) ? list : undefined);
                        };
                        
                        const added = getList('add', info, mutations[key].added), removed = getList('remove', info, mutations[key].removed);
                        const attributes = getList('attribute', info, mutations[key].attributes);

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
        const id = GenerateUniqueId(this.uniqueMarkers_);
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
