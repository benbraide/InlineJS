import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { IScreenConcept, IScreenScrollParams } from "../../types/screen";

function CreateScreenProxy(){
    const getCollectionConcept = () => GetGlobal().GetConcept<IScreenConcept>('screen');
    
    let methods = {
        stopListening: () => getCollectionConcept()?.StopListening(),
        scroll: (params: IScreenScrollParams) => getCollectionConcept()?.Scroll(params),
        scrollTop: (animate?: boolean) => getCollectionConcept()?.ScrollTop(animate),
        scrollRight: (animate?: boolean) => getCollectionConcept()?.ScrollRight(animate),
        scrollBottom: (animate?: boolean) => getCollectionConcept()?.ScrollBottom(animate),
        scrollLeft: (animate?: boolean) => getCollectionConcept()?.ScrollLeft(animate),
    };

    let properties = {
        scrollOffset: () => getCollectionConcept()?.GetScrollOffset(),
        scrollPercentage: () => getCollectionConcept()?.GetScrollPercentage(),
        scrollTrend: () => getCollectionConcept()?.GetScrollTrend(),
        scrollStreak: () => getCollectionConcept()?.GetScrollStreak(),
        size: () => getCollectionConcept()?.GetSize(),
        sizeMarks: () => getCollectionConcept()?.GetSizeMarks(),
        breakpoint: () => getCollectionConcept()?.GetBreakpoint(),
        checkpoint: () => getCollectionConcept()?.GetCheckpoint(),
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
