import { GetGlobal } from "../../global/get";
import { JournalTry } from "../../journal/try";
import { CanvasRefreshEvent } from "../../types/canvas";
import { CanvasElement } from "./element";
export class CanvasSurface extends CanvasElement {
    constructor() {
        var _a;
        super();
        this.withMouse_ = null;
        this.rendered_ = false;
        this.queued_ = false;
        this.attachShadow({
            mode: 'open',
        });
        this.canvas_ = document.createElement('canvas');
        this.SetSize_();
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.append(this.canvas_);
        this.addEventListener(CanvasRefreshEvent, () => this.Refresh());
        this.ctx_ = this.canvas_.getContext('2d');
        let removeMouse = () => {
            if (this.withMouse_) {
                this.withMouse_.dispatchEvent(new CustomEvent('mouseleave'));
                this.withMouse_ = null;
            }
        };
        this.canvas_.addEventListener('mouseleave', removeMouse);
        this.canvas_.addEventListener('mousemove', (e) => {
            if (!this.ctx_) {
                return;
            }
            let filtered = Array.from(this.children).filter(child => (typeof child['FindElementWithPoint'] === 'function'));
            let found = (filtered.find(child => child['FindElementWithPoint']({ x: e.offsetX, y: e.offsetY }, this.ctx_)) || null);
            if (found !== this.withMouse_) {
                removeMouse();
            }
            if (found) {
                if (found !== this.withMouse_) {
                    (this.withMouse_ = found).dispatchEvent(new CustomEvent('mouseenter', { bubbles: true }));
                }
                found.dispatchEvent(new CustomEvent('mousemove', { bubbles: true }));
            }
        });
        this.canvas_.addEventListener('mousedown', () => {
            if (this.withMouse_) {
                this.withMouse_.dispatchEvent(new CustomEvent('mousedown', { bubbles: true }));
            }
        });
        this.canvas_.addEventListener('mouseup', () => {
            if (this.withMouse_) {
                this.withMouse_.dispatchEvent(new CustomEvent('mouseup', { bubbles: true }));
            }
        });
        this.canvas_.addEventListener('click', () => {
            if (this.withMouse_) {
                this.withMouse_.dispatchEvent(new CustomEvent('click', { bubbles: true }));
            }
        });
        this.canvas_.addEventListener('dblclick', () => {
            if (this.withMouse_) {
                this.withMouse_.dispatchEvent(new CustomEvent('dblclick', { bubbles: true }));
            }
        });
    }
    static get observedAttributes() {
        return ['width', 'height', 'size'];
    }
    Render() {
        if (this.queued_ || !this.canvas_) {
            return;
        }
        this.queued_ = true;
        queueMicrotask(() => {
            this.queued_ = false;
            if (!this.ctx_) {
                return;
            }
            if (this.rendered_) { //Clear canvas
                let size = this.GetPair_('width', 'height', 'size');
                this.ctx_.clearRect(0, 0, parseInt(size.width), parseInt(size.height));
            }
            this.rendered_ = true;
            Array.from(this.children).filter(child => (typeof child['Paint'] === 'function')).forEach(child => JournalTry(() => child['Paint'](this.ctx_), 'Canvas.Render'));
        });
    }
    Refresh() {
        if (this.rendered_) {
            this.Render();
        }
    }
    widthChanged() {
        this.ForwardAttribute_('width', this.canvas_);
    }
    heightChanged() {
        this.ForwardAttribute_('height', this.canvas_);
    }
    sizeChanged() {
        this.SetSize_();
    }
    SetSize_() {
        let size = this.GetPair_('width', 'height', 'size');
        this.canvas_.setAttribute('width', size.width);
        this.canvas_.setAttribute('height', size.height);
    }
}
export function CanvasSurfaceCompact() {
    customElements.define(GetGlobal().GetConfig().GetDirectiveName('canvas'), CanvasSurface);
}
