import { GetGlobal } from "../../global/get";
import { CanvasRefreshEvent, ICanvasArcState, ICanvasElement, ICanvasPosition } from "../../types/canvas";
import { CanvasBlockElement } from "./element";

export class CanvasRoundRect extends CanvasBlockElement<ICanvasArcState>{
    private path_: HTMLElement;

    private topLeftArc_: HTMLElement;
    private topRightArc_: HTMLElement;

    private bottomRightArc_: HTMLElement;
    private bottomLeftArc_: HTMLElement;
    
    public static get observedAttributes() {
        return ['x', 'y', 'position', 'width', 'height', 'size', 'radius', 'mode', 'color'];
    }

    public static DefaultState(): ICanvasArcState{
        return {
            hidden: true,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
            mode: 'fill',
            color: '',
            radius: 0,
        };
    }

    public constructor(){
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

        this.shadowRoot?.append(this.path_);
        this.ResolveState_();

        this.path_.addEventListener(CanvasRefreshEvent, () => {
            this.parentElement?.dispatchEvent(new CustomEvent(CanvasRefreshEvent, {
                bubbles: true,
            }));
        });
    }

    public FindElementWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasElement | null{
        return (this.path_ as any)['FindElementWithPoint'](point, ctx);
    }

    public Paint(ctx: CanvasRenderingContext2D){
        if ((!this.state_ || !this.state_['hidden']) && typeof this.path_['Paint'] === 'function'){
            this.path_['Paint'](ctx);
        }
    }

    protected radiusChanged(){
        this.UpdateState_('radius', (parseInt(this.getAttribute('radius') || '') || 0));
    }

    protected UpdateState_(key: string, value: any){
        if (!this.state_ || !super.UpdateState_(key, value)){//No changes
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

export function CanvasRoundRectCompact(){
    customElements.define(GetGlobal().GetConfig().GetDirectiveName('canvas-round-rect'), CanvasRoundRect);
}
