import { IConfig, IConfigOptions, ReactiveStateType, DirectiveNameBuilderType } from "../types/config";

export class Config implements IConfig{
    private appName_: string;
    private reactiveState_: ReactiveStateType;

    private directivePrefix_: string;
    private elementPrefix_: string;
    
    private directiveRegex_: RegExp;
    private directiveNameBuilder_: DirectiveNameBuilderType;

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
    
    public constructor({ appName = '', reactiveState = 'unoptimized', directivePrefix = 'x', elementPrefix, directiveRegex, directiveNameBuilder }: IConfigOptions = {}){
        this.appName_ = appName;
        this.reactiveState_ = reactiveState;

        this.directivePrefix_ = directivePrefix;
        this.elementPrefix_ = (elementPrefix || directivePrefix);
        
        this.directiveRegex_ = (directiveRegex || new RegExp(`^(data-)?${directivePrefix || 'x'}-(.+)$`));
        this.directiveNameBuilder_ = (directiveNameBuilder || ((name: string, addDataPrefix = false) => {
            return (addDataPrefix ? `data-${this.directivePrefix_ || 'x'}-${name}` : `${this.directivePrefix_ || 'x'}-${name}`);
        }));
    }
    
    public GetAppName(){
        return this.appName_;
    }

    public SetDirectivePrefix(value: string){
        this.directivePrefix_ = value;
        this.directiveRegex_ = new RegExp(`^(data-)?${value || 'x'}-(.+)$`);
    }

    public GetDirectivePrefix(){
        return this.directivePrefix_;
    }

    public SetElementPrefix(value: string){
        this.elementPrefix_ = value;
    }

    public GetElementPrefix(){
        return this.elementPrefix_;
    }
    
    public GetDirectiveRegex(){
        return this.directiveRegex_;
    }

    public GetDirectiveName(name: string, addDataPrefix?: boolean){
        return this.directiveNameBuilder_(name, addDataPrefix);
    }

    public GetElementName(name: string){
        return `${this.elementPrefix_ || this.directivePrefix_ || 'x'}-${name}`;
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
        this.reactiveState_ = state;
    }

    public GetReactiveState(){
        return this.reactiveState_;
    }
}
