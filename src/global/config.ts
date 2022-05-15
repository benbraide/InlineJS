import { IConfig, IConfigOptions, ReactiveStateType, DirectiveNameBuilderType } from "../types/config";

export class Config implements IConfig{
    private appName_: string;
    private reactiveState_: ReactiveStateType;
    
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
        digits: Array.from({ length: 10 }).map((i, index) => index.toString()),
    };

    private booleanAttributes_ = new Array<string>(
        'allowfullscreen', 'allowpaymentrequest', 'async', 'autofocus', 'autoplay', 'checked', 'controls',
        'default', 'defer', 'disabled', 'formnovalidate', 'hidden', 'ismap', 'itemscope', 'loop', 'multiple', 'muted',
        'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'selected',
    );
    
    public constructor({ appName = '', reactiveState = 'unoptimized', directivePrefix = 'x', directiveRegex, directiveNameBuilder }: IConfigOptions = {}){
        this.appName_ = appName;
        this.reactiveState_ = reactiveState;
        this.directiveRegex_ = (directiveRegex || new RegExp(`^(data-)?${directivePrefix || 'x'}-(.+)$`));
        this.directiveNameBuilder_ = (directiveNameBuilder || ((name: string, addDataPrefix = false) => {
            return (addDataPrefix ? `data-${directivePrefix || 'x'}-${name}` : `${directivePrefix || 'x'}-${name}`);
        }));
    }
    
    public GetAppName(){
        return this.appName_;
    }
    
    public GetDirectiveRegex(){
        return this.directiveRegex_;
    }

    public GetDirectiveName(name: string, addDataPrefix?: boolean){
        return this.directiveNameBuilder_(name, addDataPrefix);
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
