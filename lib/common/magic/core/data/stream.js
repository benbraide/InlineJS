"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamMagicHandlerCompact = exports.StreamMagicHandler = void 0;
const stream_data_1 = require("../../../evaluator/stream-data");
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
exports.StreamMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('stream', () => {
    return (value, callback) => (0, stream_data_1.StreamData)(value, callback);
});
function StreamMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.StreamMagicHandler);
}
exports.StreamMagicHandlerCompact = StreamMagicHandlerCompact;
