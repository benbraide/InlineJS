import { DirectiveManager } from "../directive/manager";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { IComponent } from "../types/component";
import { IDirectiveManager } from "../types/directive";
import { IElementScope, TreeChangeCallbackType, ChangesMonitorType } from "../types/element-scope";
import { PeekCurrentScope } from "./current-scope";
import { ElementScopeKey } from "./element-scope-id";
import { UnbindOutsideEvent } from "./event";
import { FindComponentById } from "./find";

interface AttributeChangeCallbackInfo{
    callback: (name?: string) => void;
    whitelist: Array<string>;
}

export class ElementScope implements IElementScope{
    private isInitialized_ = false;
    
    private scopeId_ = '';
    private key_ = '';

    private changesMonitorList_ = new Array<ChangesMonitorType>();
    
    private locals_: Record<string, any> = {};
    private data_: Record<string, any> = {};

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
        this.scopeId_ = (PeekCurrentScope(this.componentId_) || '');
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

    public GetScopeId(){
        return this.scopeId_;
    }

    public GetId(){
        return this.id_;
    }

    public AddChangesMonitor(monitor: ChangesMonitorType){
        this.changesMonitorList_.push(monitor);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'changes-monitor',
            object: () => { return { ...this.changesMonitorList_ } },
        })));
    }

    public RemoveChangesMonitor(monitor: ChangesMonitorType){
        let len = this.changesMonitorList_.length;
        this.changesMonitorList_ = this.changesMonitorList_.filter(m => (m !== monitor));
        (len != this.changesMonitorList_.length) && this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'changes-monitor',
            object: () => { return { ...this.changesMonitorList_ } },
        })));
    }

    public SetKey(key: string){
        this.key_ = key;
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'key',
            object: () => key,
        })));
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
            this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                target: 'locals',
                object: () => { return { ...this.locals_ } },
            })));
        }
    }

    public DeleteLocal(key: string){
        delete this.locals_[key];
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'locals',
            object: () => { return { ...this.locals_ } },
        })));
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
            this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                target: 'data',
                object: () => { return { ...this.data_ } },
            })));
        }
    }

    public GetData(key: string){
        return ((key in this.data_) ? this.data_[key] : GetGlobal().CreateNothing());
    }

    public AddPostProcessCallback(callback: () => void){
        if (!this.state_.isMarked){
            this.callbacks_.post.push(callback);
            this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                target: 'post-process-callbacks',
                object: () => { return [ ...this.callbacks_.post ] },
            })));
        }
    }

    public ExecutePostProcessCallbacks(){
        (this.callbacks_.post || []).splice(0).forEach(callback => JournalTry(callback, 'ElementScope.ExecutePostProcessCallbacks'));
    }

    public AddPostAttributesProcessCallback(callback: () => void){
        if (!this.state_.isMarked){
            this.callbacks_.postAttributes.push(callback);
            this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                target: 'post-attributes-process-callbacks',
                object: () => { return [ ...this.callbacks_.postAttributes ] },
            })));
        }
    }

    public ExecutePostAttributesProcessCallbacks(){
        (this.callbacks_.postAttributes || []).splice(0).forEach(callback => JournalTry(callback, 'ElementScope.ExecutePostAttributesProcessCallbacks'));
    }

    public AddUninitCallback(callback: () => void){
        if (!this.state_.isMarked){
            this.callbacks_.uninit.push(callback);
            this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                target: 'uninit-callbacks',
                object: () => { return [ ...this.callbacks_.uninit ] },
            })));
        }
    }

    public RemoveUninitCallback(callback: () => void){
        this.callbacks_.uninit = this.callbacks_.uninit.filter(c => (c !== callback));
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'uninit-callbacks',
            object: () => { return [ ...this.callbacks_.uninit ] },
        })));
    }

    public AddTreeChangeCallback(callback: TreeChangeCallbackType){
        this.callbacks_.treeChange.push(callback);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'tree-change-callbacks',
            object: () => { return [ ...this.callbacks_.treeChange ] },
        })));
    }

    public RemoveTreeChangeCallback(callback: TreeChangeCallbackType){
        this.callbacks_.treeChange = this.callbacks_.treeChange.filter(c => (c !== callback));
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'tree-change-callbacks',
            object: () => { return [ ...this.callbacks_.treeChange ] },
        })));
    }
    
    public ExecuteTreeChangeCallbacks(added: Array<Node>, removed: Array<Node>){
        this.callbacks_.treeChange.forEach(callback => JournalTry(() => callback({ added, removed })));
    }

    public AddAttributeChangeCallback(callback: (name?: string) => void, whitelist?: string | Array<string>){
        if (this.state_.isMarked){
            return;
        }

        let existing = this.callbacks_.attributeChange.find(info => (info.callback === callback));
        if (!existing){
            this.callbacks_.attributeChange.push({
                callback: callback,
                whitelist: ((typeof whitelist === 'string') ? [whitelist] : (whitelist || [])),
            });
        }
        else{//Add whitelist to existing
            existing.whitelist.push(...(whitelist || []));
        }

        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'attribute-callbacks',
            object: () => { return [ ...this.callbacks_.attributeChange ] },
        })));
    }

    public RemoveAttributeChangeCallback(callback: (name?: string) => void, whitelist?: string | Array<string>){
        let index = this.callbacks_.attributeChange.findIndex(info => (info.callback === callback));
        if (index == -1){
            return;
        }

        let computedWhitelist = ((typeof whitelist === 'string') ? [whitelist] : (whitelist || []));
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

        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'attribute-callbacks',
            object: () => { return [ ...this.callbacks_.attributeChange ] },
        })));
    }

    public ExecuteAttributeChangeCallbacks(name: string){
        (this.callbacks_.attributeChange || []).filter(info => ((info.whitelist || []).length == 0 || info.whitelist.includes(name)))
            .forEach(info => JournalTry(() => info.callback(name)));
    }

    public Destroy(markOnly?: boolean){
        if (this.state_.isDestroyed){
            return;
        }
        
        this.state_.isMarked = true;
        if (!(this.element_ instanceof HTMLTemplateElement)){
            let component = FindComponentById(this.componentId_);
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

        let component = FindComponentById(this.componentId_);
        component?.RemoveElementScope(this.id_);//Remove from component

        delete this.element_[ElementScopeKey];//Remove id value on element
        if (this.isRoot_){//Remove component -- wait for changes to finalize
            let componentId = this.componentId_;
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
            let childScope = component.FindElementScope(<HTMLElement>child);
            if (childScope){//Destroy element scope
                childScope.Destroy(markOnly);
            }
            else{//No element scope -- destroy children
                this.DestroyChildren_(component, <HTMLElement>child, markOnly);
            }
        });
    }
}
