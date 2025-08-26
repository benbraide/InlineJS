import { BootstrapAndAttach } from "../bootstrap/attach";
import { ProcessDirectives } from "../directive/process";
import { CreateGlobal } from "../global/create";
import { GetGlobal, WaitForGlobal } from "../global/get";
import { Interpolate, InterpolateText, ReplaceText } from "../global/interpolator";
import { InitializeGlobalScope } from "../utilities/get-global-scope";

export function InitializeGlobal(){
    InitializeGlobalScope('global', {
        bootstrap: BootstrapAndAttach,
        waitForGlobal: WaitForGlobal,
        get: GetGlobal,
        create: CreateGlobal,
        replaceText: ReplaceText,
        interpolateText: InterpolateText,
        interpolate: Interpolate,
        processDirectives: ProcessDirectives,
    });
}
