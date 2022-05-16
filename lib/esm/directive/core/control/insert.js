import { FindComponentById } from "../../../component/find";
import { JournalError } from "../../../journal/error";
import { ProcessDirectives } from "../../process";
const RelativeOffsetKey = 'cntrl_rel_off';
export function InsertControlClone({ componentId, component, contextElement, parent, clone, relativeType, relative, copyLocals, processDirectives }) {
    var _a;
    let resolvedComponent = (component || FindComponentById(componentId));
    if (!resolvedComponent || !parent) {
        JournalError('Failed to resolve component.', 'InlineJS.InsertClone', contextElement);
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
        ProcessDirectives({
            component: componentId,
            element: clone,
            options: {
                checkDocument: false,
                checkTemplate: true,
            },
        });
    }
}
export function SetRelativeOffset(component, element, offset) {
    var _a, _b;
    (_b = (_a = ((typeof component === 'string') ? FindComponentById(component) : component)) === null || _a === void 0 ? void 0 : _a.FindElementScope(element)) === null || _b === void 0 ? void 0 : _b.SetData(RelativeOffsetKey, offset);
}
