import { IsEqual } from "../../utilities/is-equal";
export class CanvasElement extends HTMLElement {
    constructor(state_) {
        super();
        this.state_ = state_;
    }
    static DefaultCoreState() {
        return {
            hidden: true,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
        };
    }
    attributeChangedCallback(name, newValue, oldValue) {
        if (typeof this[`${name}Changed`] === 'function') {
            this[`${name}Changed`](newValue, oldValue);
        }
    }
    IsParent() {
        return false;
    }
    ContainsPoint(point, ctx) {
        return false;
    }
    FindElementWithPoint(point, ctx) {
        return (this.ContainsPoint(point, ctx) ? this : null);
    }
    GetPosition() {
        return ((this.state_ && this.state_.position) ? this.state_.position : { x: 0, y: 0 });
    }
    OffsetPosition(position) {
        return position;
    }
    Paint(ctx) { }
    UpdateState_(key, value) {
        if (!this.state_ || (this.state_ && !this.state_.hasOwnProperty(key)) || IsEqual(this.state_[key], value)) {
            return false;
        }
        this.state_[key] = value;
        return true;
    }
    SetPair_(first, second, both, separator = ' ') {
        let pair = this.GetPair_(first, second, both, separator);
        this.UpdateState_(both, {
            [first]: parseInt(pair[first]),
            [second]: parseInt(pair[second]),
        });
    }
    GetPair_(first, second, both, separator = ' ') {
        let bothValue = (both && this.getAttribute(both));
        if (bothValue) {
            let [firstValue, secondValue] = bothValue.split(separator);
            return { [first]: firstValue, [second]: (secondValue || firstValue) };
        }
        return { [first]: (this.getAttribute(first) || ''), [second]: (this.getAttribute(second) || '') };
    }
    ForwardAttribute_(names, target) {
        (Array.isArray(names) ? names : [names]).forEach((name) => {
            if (this.hasAttribute(name)) {
                target.setAttribute(name, (this.getAttribute(name) || ''));
            }
            else {
                target.removeAttribute(name);
            }
        });
    }
}
export class CanvasBlockElement extends CanvasElement {
    constructor(state, resolveState = true) {
        super(state);
        if (resolveState) {
            this.ResolveState_();
        }
    }
    ContainsPoint(point, ctx) {
        if (!this.state_ || !('position' in this.state_) || !('size' in this.state_)) {
            return false;
        }
        let position = this.state_['position'], size = this.state_['size'];
        if (this.parentElement && 'OffsetPosition' in this.parentElement) {
            position = this.parentElement['OffsetPosition'](position);
        }
        return (point.x >= position.x && point.y >= position.y && point.x < (position.x + size.width) && point.y < (position.y + size.height));
    }
    hiddenChanged() {
        this.UpdateState_('hidden', this.hasAttribute('hidden'));
    }
    colorChanged() {
        this.UpdateState_('color', (this.getAttribute('color') || ''));
    }
    xChanged() {
        this.SetPosition_();
    }
    yChanged() {
        this.SetPosition_();
    }
    positionChanged() {
        this.SetPosition_();
    }
    SetPosition_() {
        this.SetPair_('x', 'y', 'position');
    }
    widthChanged() {
        this.SetSize_();
    }
    heightChanged() {
        this.SetSize_();
    }
    sizeChanged() {
        this.SetSize_();
    }
    SetSize_() {
        this.SetPair_('width', 'height', 'size');
    }
    ResolveState_() {
        if (this.state_) {
            Object.keys(this.state_).forEach((key) => {
                if (typeof this.state_[key] === 'boolean') {
                    this.state_[key] = this.hasAttribute(key);
                }
                else if (typeof this.state_[key] === 'number') {
                    this.state_[key] = (parseInt(this.getAttribute(key) || '0') || 0);
                }
                else if (typeof this.state_[key] === 'string') {
                    this.state_[key] = (this.getAttribute(key) || '');
                }
            });
            this.SetPosition_();
            this.SetSize_();
        }
    }
}
