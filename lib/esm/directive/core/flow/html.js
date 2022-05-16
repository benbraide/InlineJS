var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { InsertHtml } from "../../../component/insert-html";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { StreamData } from "../../../evaluator/stream-data";
import { LazyCheck } from "../../lazy";
export const HtmlDirectiveHandler = CreateDirectiveHandlerCallback('html', (_a) => {
    var { componentId, contextElement } = _a, rest = __rest(_a, ["componentId", "contextElement"]);
    let checkpoint = 0;
    LazyCheck(Object.assign(Object.assign({ componentId, contextElement }, rest), { callback: (value) => {
            let myCheckpoint = ++checkpoint;
            StreamData(value, (value) => {
                if (myCheckpoint == checkpoint) {
                    InsertHtml({
                        element: contextElement,
                        html: value,
                        component: componentId,
                        processDirectives: true,
                    });
                }
            });
        } }));
});
export function HtmlDirectiveHandlerCompact() {
    AddDirectiveHandler(HtmlDirectiveHandler);
}
