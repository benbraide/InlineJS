"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextTick = void 0;
const next_cooldown_1 = require("./next-cooldown");
class NextTick extends next_cooldown_1.NextCooldown {
    constructor(componentId, callback, initialized = false) {
        super(componentId, callback, initialized);
    }
    ListenNext_(changes, callback) {
        changes === null || changes === void 0 ? void 0 : changes.AddNextTickHandler(callback);
    }
}
exports.NextTick = NextTick;
