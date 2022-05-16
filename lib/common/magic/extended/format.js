"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatMagicHandlerCompact = exports.FormatMagicHandler = void 0;
const find_1 = require("../../component/find");
const stream_data_1 = require("../../evaluator/stream-data");
const get_1 = require("../../global/get");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
const create_1 = require("../../proxy/create");
const jit_1 = require("../../proxy/jit");
const is_object_1 = require("../../utilities/is-object");
const to_string_1 = require("../../utilities/to-string");
exports.FormatMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('format', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = (0, jit_1.InitJITProxy)('format', (component || (0, find_1.FindComponentById)(componentId)), contextElement);
    if (!elementKey || proxy) { //Invalid context element OR proxy already exists
        return proxy;
    }
    let affix = (data, value, callback) => {
        return (0, stream_data_1.StreamData)(data, (data) => {
            return (0, stream_data_1.StreamData)(value, value => callback(data, value));
        });
    };
    let queueCheckpoint = 0, formatters = {
        nextTick: (data) => {
            let checkpoint = ++queueCheckpoint;
            return new Promise((resolve) => {
                var _a;
                return (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(() => {
                    if (data instanceof Promise) {
                        data.then((value) => resolve((checkpoint === queueCheckpoint) ? value : (0, get_1.GetGlobal)().CreateNothing()));
                    }
                    else { //Resolve
                        resolve((checkpoint === queueCheckpoint) ? data : (0, get_1.GetGlobal)().CreateNothing());
                    }
                });
            });
        },
        comma: (data) => (0, stream_data_1.StreamData)(data, (data) => {
            let [beforePoint, afterPoint = ''] = (0, to_string_1.ToString)(data).split('.');
            beforePoint = beforePoint.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return (afterPoint ? `${beforePoint}.${afterPoint}` : beforePoint);
        }),
        prefix: (data, value) => affix(data, value, (data, value) => (value + data)),
        suffix: (data, value) => affix(data, value, (data, value) => (data + value)),
        affix: (data, prefix, suffix) => affix(data, prefix, (data, value) => affix((value + data), suffix, (data, value) => (data + value))),
        round: (data, dp) => (0, stream_data_1.StreamData)(data, (data) => {
            let parsed = parseFloat((0, to_string_1.ToString)(data));
            return (((parsed || parsed === 0) ? (Math.round(parsed * 100) / 100).toFixed(dp || 0).toString() : parsed));
        }),
        map: (data, keys) => (0, stream_data_1.StreamData)(data, (data) => {
            if (Array.isArray(data)) {
                return (Array.isArray(keys) ? data.filter((v, index) => keys.includes(index)) : data.at((typeof keys === 'string') ? parseInt(keys) : keys));
            }
            if ((0, is_object_1.IsObject)(data)) {
                if (!Array.isArray(keys)) {
                    return data[keys.toString()];
                }
                let mapped = {};
                Object.entries(data).forEach(([key, value]) => {
                    if (keys.includes(key)) {
                        mapped[key] = value;
                    }
                });
                return mapped;
            }
            return data;
        }),
    };
    return (scope[elementKey] = (0, create_1.CreateReadonlyProxy)(formatters));
});
function FormatMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.FormatMagicHandler);
}
exports.FormatMagicHandlerCompact = FormatMagicHandlerCompact;
