"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetRelativeOffset = exports.InsertControlClone = void 0;
const find_1 = require("../../../component/find");
const error_1 = require("../../../journal/error");
const process_1 = require("../../process");
const RelativeOffsetKey = 'cntrl_rel_off';
function InsertControlClone({ componentId, component, contextElement, parent, clone, relativeType, relative, copyLocals, processDirectives }) {
    var _a;
    let resolvedComponent = (component || (0, find_1.FindComponentById)(componentId));
    if (!resolvedComponent || !parent) {
        (0, error_1.JournalError)('Failed to resolve component.', 'InlineJS.InsertClone', contextElement);
        return;
    }
    let resolvedRelative = null, skipRelatives = (el) => {
        var _a;
        let offset = (((_a = resolvedComponent.FindElementScope(el)) === null || _a === void 0 ? void 0 : _a.GetData(RelativeOffsetKey)) || 0);
        if (typeof offset !== 'number' || offset <= 0) {
            return el;
        }
        for (let i = 0; i < offset && el; ++i) {
            el = el.nextElementSibling;
        }
        return skipRelatives(el);
    };
    if (relativeType === 'after') {
        resolvedRelative = skipRelatives((relative || contextElement).nextElementSibling);
    }
    else if (relativeType === 'before') {
        resolvedRelative = (relative || contextElement);
    }
    if (resolvedRelative) {
        parent.insertBefore(clone, resolvedRelative);
    }
    else {
        parent.appendChild(clone);
    }
    if (copyLocals !== false) { //Copy locals
        let elementScope = resolvedComponent.CreateElementScope(clone);
        Object.entries(((_a = resolvedComponent.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.GetLocals()) || {}).forEach(([key, value]) => elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(key, value));
    }
    if (processDirectives !== false) {
        (0, process_1.ProcessDirectives)({
            component: componentId,
            element: clone,
            options: {
                checkDocument: false,
                checkTemplate: true,
            },
        });
    }
}
exports.InsertControlClone = InsertControlClone;
function SetRelativeOffset(component, element, offset) {
    var _a, _b;
    (_b = (_a = ((typeof component === 'string') ? (0, find_1.FindComponentById)(component) : component)) === null || _a === void 0 ? void 0 : _a.FindElementScope(element)) === null || _b === void 0 ? void 0 : _b.SetData(RelativeOffsetKey, offset);
}
exports.SetRelativeOffset = SetRelativeOffset;
