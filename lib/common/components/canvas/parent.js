"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasParent = void 0;
const try_1 = require("../../journal/try");
const shape_1 = require("./shape");
class CanvasParent extends shape_1.CanvasShape {
    static get observedAttributes() {
        return ['x', 'y', 'position', 'mode', 'color'];
    }
    constructor(state) {
        super(state || CanvasParent.DefaultState());
    }
    IsParent() {
        return true;
    }
    FindElementWithPoint(point, ctx) {
        let filtered = Array.from(this.children).filter(child => (typeof child['FindElementWithPoint'] === 'function'));
        let found = filtered.find(child => child['FindElementWithPoint'](point, ctx));
        return (found ? found : null);
    }
    OffsetPosition(position) {
        let myPosition = this.GetPosition();
        if (this.parentElement && 'OffsetPosition' in this.parentElement) {
            myPosition = this.parentElement['OffsetPosition'](myPosition);
        }
        return { x: (position.x + myPosition.x), y: (position.y + myPosition.y) };
    }
    paint(ctx) {
        return this.PaintWith_(ctx);
    }
    PaintWith_(ctx, callback) {
        let myPosition = this.GetPosition();
        if (this.parentElement && 'OffsetPosition' in this.parentElement) {
            myPosition = this.parentElement['OffsetPosition'](myPosition);
        }
        ctx.moveTo(myPosition.x, myPosition.y);
        Array.from(this.children).filter(child => (typeof child['Paint'] === 'function')).forEach(child => (0, try_1.JournalTry)(() => child['Paint'](ctx), 'CanvasParent.Paint'));
        if (callback && callback()) {
            return;
        }
        if (this.state_.mode === 'stroke' && 'stroke' in ctx) {
            ctx.stroke();
        }
        else if ('fill' in ctx) { //Fill
            ctx.fill();
        }
    }
}
exports.CanvasParent = CanvasParent;
