import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
function CreateScreenProxy() {
    const getCollectionConcept = () => GetGlobal().GetConcept('screen');
    let methods = {
        stopListening: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.StopListening(); },
        scroll: (params) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Scroll(params); },
        scrollTop: (animate) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.ScrollTop(animate); },
        scrollRight: (animate) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.ScrollRight(animate); },
        scrollBottom: (animate) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.ScrollBottom(animate); },
        scrollLeft: (animate) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.ScrollLeft(animate); },
    };
    let properties = {
        scrollOffset: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetScrollOffset(); },
        scrollPercentage: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetScrollPercentage(); },
        scrollTrend: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetScrollTrend(); },
        scrollStreak: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetScrollStreak(); },
        size: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetSize(); },
        sizeMarks: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetSizeMarks(); },
        breakpoint: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetBreakpoint(); },
        checkpoint: () => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetCheckpoint(); },
    };
    return CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && methods.hasOwnProperty(prop)) {
                return methods[prop];
            }
            if (prop && properties.hasOwnProperty(prop)) {
                return properties[prop]();
            }
        },
        lookup: [...Object.keys(methods), ...Object.keys(properties)],
    }));
}
const ScreenProxy = CreateScreenProxy();
export const ScreenMagicHandler = CreateMagicHandlerCallback('screen', () => ScreenProxy);
export function ScreenMagicHandlerCompact() {
    AddMagicHandler(ScreenMagicHandler);
}
