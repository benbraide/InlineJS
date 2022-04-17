import { DirectiveManager } from "../directives/manager";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { IComponent } from "../types/component";
import { IDirectiveManager } from "../types/directives";
import { IElementScope } from "../types/element-scope";
import { Nothing } from "../values/nothing";
import { PeekCurrentScope } from "./current-scope";
import { ElementScopeKey } from "./element-scope-id";
import { UnbindOutsideEvent } from "./event";
import { FindComponentById } from "./find";

interface AttributeChangeCallbackInfo{
    callback: (name?: string) => void;
    whitelist: Array<string>;
}

export class ElementScope implements IElementScope{
    private scopeId_ = '';
    private key_ = '';
    
    private locals_: Record<string, any> = {};
    private data_: Record<string, any> = {};

    private managers_ = {
        directive: <IDirectiveManager | null>null,
    };

    private callbacks_ = {
        post: new Array<() => void>(),
        uninit: new Array<() => void>(),
        attributeChange: new Array<AttributeChangeCallbackInfo>(),
    };

    private state_ = {
        isMarked: false,
        isDestroyed: false,
    };
    
    public constructor(private componentId_: string, private id_: string, private element_: HTMLElement, private isRoot_: boolean){
        this.scopeId_ = (PeekCurrentScope(this.componentId_) || '');
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

    public SetKey(key: string){
        this.key_ = key;
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
        }
    }

    public DeleteLocal(key: string){
        delete this.locals_[key];
    }

    public GetLocal(key: string){
        return ((key in this.locals_) ? this.locals_[key] : new Nothing);
    }

    public GetLocals(){
        return this.locals_;
    }

    public SetData(key: string, value: any){
        if (!this.state_.isMarked){
            this.data_[key] = value;
        }
    }

    public GetData(key: string){
        return ((key in this.data_) ? this.data_[key] : new Nothing);
    }

    public AddPostProcessCallback(callback: () => void){
        if (!this.state_.isMarked){
            this.callbacks_.post.push(callback);
        }
    }

    public ExecutePostProcessCallbacks(){
        (this.callbacks_.post || []).forEach(callback => JournalTry(callback, 'ElementScope.ExecutePostProcessCallbacks'));
    }

    public AddUninitCallback(callback: () => void){
        if (!this.state_.isMarked){
            this.callbacks_.uninit.push(callback);
        }
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
        if (!(this.element_ instanceof HTMLTemplateElement) && this.element_.tagName.toLowerCase() !== 'svg'){
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
        Array.from(target.children).forEach((child) => {
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
