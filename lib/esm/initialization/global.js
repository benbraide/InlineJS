import { BootstrapAndAttach } from "../bootstrap/attach";
import { CreateGlobal } from "../global/create";
import { GetGlobal, WaitForGlobal } from "../global/get";
import { GetElementContent, Interpolate, InterpolateText, ReplaceText } from "../global/interpolator";
import { InitializeGlobalScope } from "../utilities/get-global-scope";
export function InitializeGlobal() {
    InitializeGlobalScope('global', {
        bootstrap: BootstrapAndAttach,
        waitForGlobal: WaitForGlobal,
        get: GetGlobal,
        create: CreateGlobal,
        getElementContent: GetElementContent,
        replaceText: ReplaceText,
        interpolateText: InterpolateText,
        interpolate: Interpolate,
    });
}
