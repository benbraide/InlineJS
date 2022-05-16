"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasPathCompact = exports.CanvasPath = void 0;
const get_1 = require("../../global/get");
const parent_1 = require("./parent");
class CanvasPath extends parent_1.CanvasParent {
    constructor() {
        super();
        this.buffer_ = null;
    }
    ContainsPoint(point, ctx) {
        if (!this.buffer_) { //Create path
            this.buffer_ = new Path2D();
            this.PaintWith_(this.buffer_, () => {
                this.buffer_.closePath();
                return true;
            });
        }
        return ctx.isPointInPath(this.buffer_, point.x, point.y);
    }
    FindElementWithPoint(point, ctx) {
        return (this.ContainsPoint(point, ctx) ? this : null);
    }
    paint(ctx) {
        let doPaint = () => {
            if ((this.state_ && this.state_.mode === 'stroke') && 'stroke' in ctx) {
                ctx.strokeStyle = (this.state_.color || 'black');
                ctx.stroke(this.buffer_);
            }
            else if ('fill' in ctx) {
                ctx.fillStyle = (this.state_.color || 'black');
                ctx.fill(this.buffer_);
            }
            if ('addPath' in ctx) {
                ctx.addPath(this.buffer_);
            }
        };
        if (this.buffer_ && 'stroke' in ctx && 'fill' in ctx) {
            return doPaint();
        }
        this.buffer_ = new Path2D();
        this.PaintWith_(this.buffer_, () => {
            this.buffer_.closePath();
            doPaint();
            return true;
        });
    }
    UpdateState_(key, value) {
        if (super.UpdateState_(key, value)) {
            this.buffer_ = null;
            return true;
        }
        return false;
    }
}
exports.CanvasPath = CanvasPath;
function CanvasPathCompact() {
    customElements.define((0, get_1.GetGlobal)().GetConfig().GetDirectiveName('canvas-path'), CanvasPath);
}
exports.CanvasPathCompact = CanvasPathCompact;
