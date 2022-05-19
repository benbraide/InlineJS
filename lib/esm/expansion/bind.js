import { GetGlobal } from "../global/get";
export function BindDirectiveExpansionRule(name) {
    return (name.startsWith(':') ? (GetGlobal().GetConfig().GetDirectiveName('bind') + name) : null);
}
