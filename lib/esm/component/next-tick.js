import { NextCooldown } from "./next-cooldown";
export class NextTick extends NextCooldown {
    constructor(componentId, callback, initialized = false) {
        super(componentId, callback, initialized);
    }
    ListenNext_(changes, callback) {
        changes === null || changes === void 0 ? void 0 : changes.AddNextTickHandler(callback);
    }
}
