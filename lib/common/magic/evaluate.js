"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluateMagicProperty = void 0;
const find_1 = require("../component/find");
const infer_1 = require("../component/infer");
const get_1 = require("../global/get");
const error_1 = require("../journal/error");
const try_1 = require("../journal/try");
function EvaluateMagicProperty(component, contextElement, name, prefix = '', checkExternal = true) {
    let resolvedComponent = ((typeof component === 'string') ? (0, find_1.FindComponentById)(component) : component);
    if (!resolvedComponent) {
        (0, error_1.JournalError)(`Failed to find component for '$${name}'`, 'InlineJS.EvaluateMagicProperty', contextElement);
        return (0, get_1.GetGlobal)().CreateNothing();
    }
    let handler = (0, get_1.GetGlobal)().GetMagicManager().FindHandler((prefix && name.startsWith(prefix)) ? name.substring(prefix.length) : name, { contextElement,
        componentId: resolvedComponent.GetId(),
        component: resolvedComponent,
    }); //Find handler and report access
    if (!handler) {
        if (checkExternal && prefix && name.startsWith(`${prefix}${prefix}`)) { //External access
            let componentId = resolvedComponent.GetId();
            return (target) => {
                let component = ((0, infer_1.InferComponent)(target) || (0, find_1.FindComponentById)(componentId));
                if (!component) {
                    return null;
                }
                let elementScope = component.FindElementScope(target), local = (elementScope && elementScope.GetLocal(name.substring(prefix.length)));
                if (elementScope && !(0, get_1.GetGlobal)().IsNothing(local)) { //Prioritize local value
                    return local;
                }
                return EvaluateMagicProperty(component.GetId(), target, name, `${prefix}${prefix}`, false);
            };
        }
        return (0, get_1.GetGlobal)().CreateNothing();
    }
    return (0, try_1.JournalTry)(() => {
        return handler({
            componentId: resolvedComponent.GetId(),
            component: resolvedComponent,
            contextElement: contextElement,
        });
    }, 'InlineJS.EvaluateMagicProperty', contextElement);
}
exports.EvaluateMagicProperty = EvaluateMagicProperty;
