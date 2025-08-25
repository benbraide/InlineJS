import { IConfig, IConfigOptions, ReactiveStateType } from "../types/config";
import { GetGlobalScope } from "../utilities/get-global-scope";
import { MergeObjects } from "../utilities/merge-objects";

export class Config implements IConfig{
    protected defaultOptions_: IConfigOptions = {
        reactiveState: 'unoptimized',
        directivePrefix: 'hx',
    };

    private keyMap_: Record<string, string | Array<string>> = {
        'return': 'enter',
        ctrl: 'control',
        esc: 'escape',
        space: ' ',
        menu: 'contextmenu',
        del: 'delete',
        ins: 'insert',
        plus: '+',
        minus: '-',
        star: '*',
        slash: '/',
        alpha: Array.from({ length: 26 }).map((i, index) => String.fromCharCode(index + 97)),
        digit: Array.from({ length: 10 }).map((i, index) => index.toString()),
    };

    private booleanAttributes_ = new Array<string>(
        'allowfullscreen', 'allowpaymentrequest', 'async', 'autofocus', 'autoplay', 'checked', 'controls',
        'default', 'defer', 'disabled', 'formnovalidate', 'hidden', 'ismap', 'itemscope', 'loop', 'multiple', 'muted',
        'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'selected',
    );
    
    public constructor(protected options_: IConfigOptions){
        this.options_ = MergeObjects({ ...GetGlobalScope('config', true) }, MergeObjects(this.options_, this.defaultOptions_));
        this.UpdateDirectiveRegex_();

        if (!this.options_.directiveNameBuilder){
            const options = this.options_, defaultOptions = this.defaultOptions_;
            options.directiveNameBuilder = ((name: string, addDataPrefix = false) => {
                const prefix = options.directivePrefix || defaultOptions.directivePrefix || 'hx';
                return (addDataPrefix ? `data-${prefix}-${name}` : `${prefix}-${name}`);
            });
        }
    }
    
    public GetAppName(){
        return this.options_.appName || '';
    }

    public SetDirectivePrefix(value: string){
        this.options_.directivePrefix = value;
        this.UpdateDirectiveRegex_();
    }

    public GetDirectivePrefix(){
        return this.options_.directivePrefix || this.defaultOptions_.directivePrefix || 'hx';
    }

    public SetElementPrefix(value: string){
        this.options_.elementPrefix = value;
    }

    public GetElementPrefix(){
        return this.options_.elementPrefix || this.GetDirectivePrefix();
    }
    
    public GetDirectiveRegex(){
        return this.options_.directiveRegex || this.UpdateDirectiveRegex_();
    }

    public GetDirectiveName(name: string, addDataPrefix?: boolean){
        return (this.options_.directiveNameBuilder ? this.options_.directiveNameBuilder(name, addDataPrefix) : name);
    }

    public GetElementName(name: string){
        return `${this.GetElementPrefix()}-${name}`;
    }

    public AddKeyEventMap(key: string, target: string){
        this.keyMap_[key] = target;
    }

    public RemoveKeyEventMap(key: string){
        delete this.keyMap_[key];
    }

    public MapKeyEvent(key: string){
        return ((key in this.keyMap_) ? this.keyMap_[key] : key);
    }

    public AddBooleanAttribute(name: string){
        this.booleanAttributes_.push(name);
    }

    public RemoveBooleanAttribute(name: string){
        this.booleanAttributes_ = this.booleanAttributes_.filter(attr => (attr !== name));
    }

    public IsBooleanAttribute(name: string){
        return this.booleanAttributes_.includes(name);
    }

    public SetReactiveState(state: ReactiveStateType){
        this.options_.reactiveState = state;
    }

    public GetReactiveState(){
        return this.options_.reactiveState || this.defaultOptions_.reactiveState || 'unoptimized';
    }

    public SetUseGlobalWindow(value: boolean){
        this.options_.useGlobalWindow = value;
    }

    public GetUseGlobalWindow(){
        return this.options_.useGlobalWindow || false;
    }

    protected UpdateDirectiveRegex_(){
        return (this.options_.directiveRegex = new RegExp(`^(data-)?${this.GetDirectivePrefix()}-(.+)$`));
    }

    public SetWrapScopedFunctions(value: boolean){
        this.options_.wrapScopedFunctions = value;
    }

    public GetWrapScopedFunctions(){
        return this.options_.wrapScopedFunctions || false;
    }
}
