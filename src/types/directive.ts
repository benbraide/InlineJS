export interface IDirectiveView{
    original: string;
    expanded: string;
}

export interface IDirectiveName{
    value: string;
    joined: string;
    parts: Array<string>;
}

export interface IDirectiveArg{
    key: string;
    options: Array<string>;
}

export interface IDirectiveMeta{
    view: IDirectiveView;
    name: IDirectiveName;
    arg: IDirectiveArg;
}

export interface IDirective{
    meta: IDirectiveMeta;
    value: string;
}

export interface IFlatDirective{
    originalView: string;
    expandedView: string;
    nameValue: string;
    nameJoined: string;
    nameParts: Array<string>;
    argKey: string;
    argOptions: Array<string>;
    expression: string;
}
