import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { IScreenScrollParams } from "../../types/screen";

function CreateScreenProxy(){
    let methods = {
        stopListening: () => GetGlobal().GetScreenConcept()?.StopListening(),
        scroll: (params: IScreenScrollParams) => GetGlobal().GetScreenConcept()?.Scroll(params),
        scrollTop: (animate?: boolean) => GetGlobal().GetScreenConcept()?.ScrollTop(animate),
        scrollRight: (animate?: boolean) => GetGlobal().GetScreenConcept()?.ScrollRight(animate),
        scrollBottom: (animate?: boolean) => GetGlobal().GetScreenConcept()?.ScrollBottom(animate),
        scrollLeft: (animate?: boolean) => GetGlobal().GetScreenConcept()?.ScrollLeft(animate),
    };

    let properties = {
        scrollOffset: () => GetGlobal().GetScreenConcept()?.GetScrollOffset(),
        scrollPercentage: () => GetGlobal().GetScreenConcept()?.GetScrollPercentage(),
        scrollTrend: () => GetGlobal().GetScreenConcept()?.GetScrollTrend(),
        scrollStreak: () => GetGlobal().GetScreenConcept()?.GetScrollStreak(),
        size: () => GetGlobal().GetScreenConcept()?.GetSize(),
        sizeMarks: () => GetGlobal().GetScreenConcept()?.GetSizeMarks(),
        breakpoint: () => GetGlobal().GetScreenConcept()?.GetBreakpoint(),
        checkpoint: () => GetGlobal().GetScreenConcept()?.GetCheckpoint(),
    };

    return CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && methods.hasOwnProperty(prop)){
                return methods[prop];
            }

            if (prop && properties.hasOwnProperty(prop)){
                return properties[prop]();
            }
        },
        lookup: [...Object.keys(methods), ...Object.keys(properties)],
    }));
}

const ScreenProxy = CreateScreenProxy();

export const ScreenMagicHandler = CreateMagicHandlerCallback('screen', () => ScreenProxy);

export function ScreenMagicHandlerCompact(){
    AddMagicHandler(ScreenMagicHandler);
}
