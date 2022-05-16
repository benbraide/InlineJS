import { GetGlobal } from "../../global/get";
import { CanvasRefreshEvent } from "../../types/canvas";
import { CanvasBlockElement } from "./element";
export class CanvasRoundRect extends CanvasBlockElement {
    constructor() {
        var _a;
        super(CanvasRoundRect.DefaultState(), false);
        this.attachShadow({
            mode: 'open',
        });
        this.path_ = document.createElement('x-canvas-path');
        this.topLeftArc_ = document.createElement('x-canvas-arc');
        this.topRightArc_ = document.createElement('x-canvas-arc');
        this.bottomLeftArc_ = document.createElement('x-canvas-arc');
        this.bottomRightArc_ = document.createElement('x-canvas-arc');
        this.path_.append(this.topLeftArc_);
        this.path_.append(this.topRightArc_);
        this.path_.append(this.bottomRightArc_);
        this.path_.append(this.bottomLeftArc_);
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.append(this.path_);
        this.ResolveState_();
        this.path_.addEventListener(CanvasRefreshEvent, () => {
            var _a;
            (_a = this.parentElement) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new CustomEvent(CanvasRefreshEvent, {
                bubbles: true,
            }));
        });
    }
    static get observedAttributes() {
        return ['x', 'y', 'position', 'width', 'height', 'size', 'radius', 'mode', 'color'];
    }
    static DefaultState() {
        return {
            hidden: true,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
            mode: 'fill',
            color: '',
            radius: 0,
        };
    }
    FindElementWithPoint(point, ctx) {
        return this.path_['FindElementWithPoint'](point, ctx);
    }
    Paint(ctx) {
        if ((!this.state_ || !this.state_['hidden']) && typeof this.path_['Paint'] === 'function') {
            this.path_['Paint'](ctx);
        }
    }
    radiusChanged() {
        this.UpdateState_('radius', (parseInt(this.getAttribute('radius') || '') || 0));
    }
    UpdateState_(key, value) {
        if (!this.state_ || !super.UpdateState_(key, value)) { //No changes
            return false;
        }
        this.path_.setAttribute('position', `${this.state_.position.x} ${(this.state_.position.y + this.state_.radius)}`);
        this.path_.setAttribute('mode', this.state_.mode);
        this.path_.setAttribute('color', this.state_.color);
        this.topLeftArc_.setAttribute('position', `0 ${this.state_.size.height}`);
        this.topLeftArc_.setAttribute('size', `${this.state_.radius} 0`);
        this.topLeftArc_.setAttribute('radius', this.state_.radius.toString());
        this.topRightArc_.setAttribute('position', `${this.state_.size.width} ${this.state_.size.height}`);
        this.topRightArc_.setAttribute('size', `0 ${-this.state_.radius}`);
        this.topRightArc_.setAttribute('radius', this.state_.radius.toString());
        this.bottomRightArc_.setAttribute('position', `${this.state_.size.width} 0`);
        this.bottomRightArc_.setAttribute('size', `${-this.state_.radius} 0`);
        this.bottomRightArc_.setAttribute('radius', this.state_.radius.toString());
        this.bottomLeftArc_.setAttribute('position', '0 0');
        this.bottomLeftArc_.setAttribute('size', `0 ${this.state_.radius}`);
        this.bottomLeftArc_.setAttribute('radius', this.state_.radius.toString());
        return true;
    }
}
export function CanvasRoundRectCompact() {
    customElements.define(GetGlobal().GetConfig().GetDirectiveName('canvas-round-rect'), CanvasRoundRect);
}
