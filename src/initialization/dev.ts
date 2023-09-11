import { AutoBootstrap } from "../bootstrap/auto";
import { GetGlobal } from "../global/get";
import { AttributeInterpolator, TextContentInterpolator } from "../global/interpolation";

export function InitializeDev(bootstrap = true){
    bootstrap && AutoBootstrap();

    GetGlobal().AddAttributeProcessor(AttributeInterpolator);
    GetGlobal().AddTextContentProcessor(TextContentInterpolator);
}
