import { IEvaluateOptions } from "../types/evaluate-options";
import { GenerateFunctionFromString } from "./generate-function";

export function EvaluateLater(options: IEvaluateOptions){
    return GenerateFunctionFromString(options);
}
