import { DirectiveExpansionRuleType } from "../types/directive";
export declare function CreateDirectiveExpansionRule(rule: RegExp | string, expandWith: string): DirectiveExpansionRuleType;
export declare function AddDirectiveExpansionRule(rule: DirectiveExpansionRuleType): string;
export declare function RemoveDirectiveExpansionRule(id: string): void;
export declare function ApplyDirectiveExpansionRules(name: string): string;
