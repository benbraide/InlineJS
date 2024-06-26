import { DirectiveManager } from "../directive/manager";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { IComponent } from "../types/component";
import { IDirectiveManager } from "../types/directive";
import { IElementScope, TreeChangeCallbackType } from "../types/element-scope";
import { ChangesMonitor } from "./changes-monitor";
import { PeekCurrentScope } from "./current-scope";
import { ElementScopeKey } from "./element-scope-id";
import { UnbindOutsideEvent } from "./event";
import { FindComponentById } from "./find";

interface AttributeChangeCallbackInfo{
    callback: (name?: string) => void;
    whitelist: Array<string>;
}

export class ElementScope extends ChangesMonitor implements IElementScope{
    private isInitialized_ = false;
    private key_ = '';

    private locals_: Record<string, any> = {};
    private data_: Record<string, any> = {};

    private queuedAttributeChanges_: Array<string> | null = null;

    private managers_ = {
        directive: <IDirectiveManager | null>null,
    };

    private callbacks_ = {
        post: new Array<() => void>(),
        postAttributes: new Array<() => void>(),
        uninit: new Array<() => void>(),
        treeChange: new Array<TreeChangeCallbackType>(),
        attributeChange: new Array<AttributeChangeCallbackInfo>(),
    };

    private state_ = {
        isMarked: false,
        isDestroyed: false,
    };
    
    public constructor(private componentId_: string, private id_: string, private element_: HTMLElement, private isRoot_: boolean){
        super();
    }

    public SetInitialized(){
        this.isInitialized_ = true;
    }
    
    public IsInitialized(){
        return this.isInitialized_;
    }
    
    public GetComponentId(){
        return this.componentId_;
    }

    public GetId(){
        return this.id_;
    }

    public SetKey(key: string){
        this.NotifyListeners_('key', (this.key_ = key));
    }

    public GetKey(){
        return this.key_;
    }
    
    public GetElement(): HTMLElement{
        return this.element_;
    }

    public IsRoot(){
        return this.isRoot_;
    }

    public SetLocal(key: string, value: any){
        if (!this.state_.isMarked){
            this.locals_[key] = value;
            this.NotifyListeners_('locals', this.locals_);
        }
    }

    public DeleteLocal(key: string){
        delete this.locals_[key];
        this.NotifyListeners_('locals', this.locals_);
    }

    public HasLocal(key: string){
        return (key in this.locals_);
    }

    public GetLocal(key: string){
        return ((key in this.locals_) ? this.locals_[key] : GetGlobal().CreateNothing());
    }

    public GetLocals(){
        return this.locals_;
    }

    public SetData(key: string, value: any){
        if (!this.state_.isMarked){
            this.data_[key] = value;
            this.NotifyListeners_('data', this.data_);
        }
    }

    public GetData(key: string){
        return ((key in this.data_) ? this.data_[key] : GetGlobal().CreateNothing());
    }

    public AddPostProcessCallback(callback: () => void){
        if (!this.state_.isMarked){
            this.callbacks_.post.push(callback);
            this.NotifyListeners_('post-process-callbacks', this.callbacks_.post);
        }
    }

    public ExecutePostProcessCallbacks(){
        (this.callbacks_.post || []).splice(0).forEach(callback => JournalTry(callback, 'ElementScope.ExecutePostProcessCallbacks'));
    }

    public AddPostAttributesProcessCallback(callback: () => void){
        if (!this.state_.isMarked){
            this.callbacks_.postAttributes.push(callback);
            this.NotifyListeners_('post-attributes-process-callbacks', this.callbacks_.postAttributes);
        }
    }

    public ExecutePostAttributesProcessCallbacks(){
        (this.callbacks_.postAttributes || []).splice(0).forEach(callback => JournalTry(callback, 'ElementScope.ExecutePostAttributesProcessCallbacks'));
    }

    public AddUninitCallback(callback: () => void){
        if (!this.state_.isMarked){
            this.callbacks_.uninit.push(callback);
            this.NotifyListeners_('uninit-callbacks', this.callbacks_.uninit);
        }
    }

    public RemoveUninitCallback(callback: () => void){
        this.callbacks_.uninit = this.callbacks_.uninit.filter(c => (c !== callback));
        this.NotifyListeners_('uninit-callbacks', this.callbacks_.uninit);
    }

    public AddTreeChangeCallback(callback: TreeChangeCallbackType){
        this.callbacks_.treeChange.push(callback);
        this.NotifyListeners_('tree-change-callbacks', this.callbacks_.treeChange);
    }

    public RemoveTreeChangeCallback(callback: TreeChangeCallbackType){
        this.callbacks_.treeChange = this.callbacks_.treeChange.filter(c => (c !== callback));
        this.NotifyListeners_('tree-change-callbacks', this.callbacks_.treeChange);
    }
    
    public ExecuteTreeChangeCallbacks(added: Array<Node>, removed: Array<Node>){
        this.callbacks_.treeChange.forEach(callback => JournalTry(() => callback({ added, removed })));
    }

    public AddAttributeChangeCallback(callback: (name?: string) => void, whitelist?: string | Array<string>){
        if (this.state_.isMarked){
            return;
        }

        const existing = this.callbacks_.attributeChange.find(info => (info.callback === callback));
        if (!existing){
            this.callbacks_.attributeChange.push({
                callback: callback,
                whitelist: ((typeof whitelist === 'string') ? [whitelist] : (whitelist || [])),
            });
        }
        else{//Add whitelist to existing
            existing.whitelist.push(...(whitelist || []));
        }

        this.NotifyListeners_('attribute-change-callbacks', this.callbacks_.attributeChange);
    }

    public RemoveAttributeChangeCallback(callback: (name?: string) => void, whitelist?: string | Array<string>){
        const index = this.callbacks_.attributeChange.findIndex(info => (info.callback === callback));
        if (index == -1){
            return;
        }

        const computedWhitelist = ((typeof whitelist === 'string') ? [whitelist] : (whitelist || []));
        if (computedWhitelist.length != 0 && this.callbacks_.attributeChange[index].whitelist.length != 0){
            computedWhitelist.forEach((item) => {//Filter specified whitelist from existing
                this.callbacks_.attributeChange[index].whitelist = this.callbacks_.attributeChange[index].whitelist.filter(eItem => (eItem !== item));
            });
        }
        else{//Clear whitelist
            this.callbacks_.attributeChange[index].whitelist.splice(0);
        }

        if (this.callbacks_.attributeChange[index].whitelist.length == 0){
            this.callbacks_.attributeChange.splice(index, 1);
        }

        this.NotifyListeners_('attribute-change-callbacks', this.callbacks_.attributeChange);
    }

    public ExecuteAttributeChangeCallbacks(name: string){
        if (!this.queuedAttributeChanges_){
            this.queuedAttributeChanges_ = [name];
            queueMicrotask(() => {
                if (!this.queuedAttributeChanges_){
                    return;
                }
                
                const queue = this.queuedAttributeChanges_;
                this.queuedAttributeChanges_ = null;

                queue.forEach((name) => {
                    (this.callbacks_.attributeChange || []).filter(info => ((info.whitelist || []).length == 0 || info.whitelist.includes(name)))
                        .forEach(info => JournalTry(() => info.callback(name)));
                });
            });
        }
        else{
            !this.queuedAttributeChanges_.includes(name) && this.queuedAttributeChanges_.push(name);
        }
    }

    public Destroy(markOnly?: boolean){
        if (this.state_.isDestroyed){
            return;
        }
        
        this.state_.isMarked = true;
        if (!(this.element_ instanceof HTMLTemplateElement)){
            const component = FindComponentById(this.componentId_);
            if (component){
                this.DestroyChildren_(component, this.element_, (markOnly || false));
            }
        }
        
        if (markOnly){
            return;
        }

        this.callbacks_.uninit.splice(0).forEach((callback) => {
            try{
                callback();
            }
            catch {}
        });

        this.callbacks_.post.splice(0);
        this.callbacks_.treeChange.splice(0);
        this.callbacks_.attributeChange.splice(0);

        this.data_ = {};
        this.locals_ = {};
        this.state_.isDestroyed = true;

        UnbindOutsideEvent(this.element_);
        GetGlobal().GetMutationObserver().Unobserve(this.element_);

        const component = FindComponentById(this.componentId_);
        component?.RemoveElementScope(this.id_);//Remove from component

        delete this.element_[ElementScopeKey];//Remove id value on element
        if (this.isRoot_){//Remove component -- wait for changes to finalize
            const componentId = this.componentId_;
            component?.GetBackend().changes.AddNextTickHandler(() => GetGlobal().RemoveComponent(componentId));
        }
    }

    public IsMarked(){
        return this.state_.isMarked;
    }

    public IsDestroyed(){
        return this.state_.isDestroyed;
    }

    public GetDirectiveManager(){
        return (this.managers_.directive = (this.managers_.directive || new DirectiveManager()));
    }

    private DestroyChildren_(component: IComponent, target: HTMLElement, markOnly: boolean){
        Array.from(target.children).filter(child => !child.contains(target)).forEach((child) => {
            const childScope = component.FindElementScope(<HTMLElement>child);
            if (childScope){//Destroy element scope
                childScope.Destroy(markOnly);
            }
            else{//No element scope -- destroy children
                this.DestroyChildren_(component, <HTMLElement>child, markOnly);
            }
        });
    }
}
