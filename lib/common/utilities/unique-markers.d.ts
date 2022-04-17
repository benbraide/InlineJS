import { IUniqueMarkers } from "../types/unique-markers";
export declare function GetDefaultUniqueMarkers(): IUniqueMarkers;
export declare function IncrementUniqueMarkers(markers: IUniqueMarkers, level?: keyof IUniqueMarkers, upperLevel?: keyof IUniqueMarkers): void;
export declare function JoinUniqueMarkers(markers: IUniqueMarkers): string;
export declare function GenerateUniqueId(markers: IUniqueMarkers, scope?: string, prefix?: string, suffix?: string): string;
