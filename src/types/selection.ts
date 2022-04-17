export interface ISelectionScope{
    callback?: (state: boolean) => void;
    state: boolean;
}

export interface ISelectionStackEntry{
    scope?: ISelectionScope;
    set: boolean;
}
