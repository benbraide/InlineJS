import { ISplitPath } from "../types/path";
export declare function TidyPath(path: string, convertAfterQuery?: boolean): string;
export declare function PathToRelative(path: string, origin: string, prefix?: string, convertAfterQuery?: boolean): string;
export declare function SplitPath(path: string, origin?: string, prefix?: string): ISplitPath;
export declare function JoinPath({ base, query }: ISplitPath, origin?: string, prefix?: string, prependOrigin?: boolean, convertAfterQuery?: boolean): string;
