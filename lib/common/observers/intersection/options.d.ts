export interface IIntersectionOptions extends IntersectionObserverInit {
    spread?: boolean;
}
export declare function BuildIntersectionOptions(data: IIntersectionOptions): IntersectionObserverInit;
