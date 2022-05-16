"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenMagicHandlerCompact = exports.ScreenMagicHandler = void 0;
const get_1 = require("../../global/get");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
const create_1 = require("../../proxy/create");
function CreateScreenProxy() {
    const getCollectionConcept = () => (0, get_1.GetGlobal)().GetConcept('screen');
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
    return (0, create_1.CreateInplaceProxy)((0, create_1.BuildGetterProxyOptions)({
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
exports.ScreenMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('screen', () => ScreenProxy);
function ScreenMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.ScreenMagicHandler);
}
exports.ScreenMagicHandlerCompact = ScreenMagicHandlerCompact;
