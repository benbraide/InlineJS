"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasShape = void 0;
const canvas_1 = require("../../types/canvas");
const element_1 = require("./element");
class CanvasShape extends element_1.CanvasBlockElement {
    static DefaultState() {
        return {
            hidden: true,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
            mode: 'fill',
            color: '',
        };
    }
    constructor(state) {
        super(state);
    }
    Paint(ctx) {
        if (!this.state_ || !this.state_['hidden']) {
            this.Paint_(ctx);
        }
    }
    Paint_(ctx) {
        if (typeof this['paint'] === 'function') {
            if (this.state_ && this.state_.mode === 'stroke' && 'strokeStyle' in ctx) {
                ctx.strokeStyle = (this.state_.color || 'black');
            }
            else if ('fillStyle' in ctx) {
                ctx.fillStyle = (this.state_.color || 'black');
            }
            this['paint'](ctx);
        }
    }
    UpdateState_(key, value) {
        if (!super.UpdateState_(key, value)) { //No changes
            return false;
        }
        this.dispatchEvent(new CustomEvent(canvas_1.CanvasRefreshEvent, {
            bubbles: true,
        }));
        return true;
    }
}
exports.CanvasShape = CanvasShape;
