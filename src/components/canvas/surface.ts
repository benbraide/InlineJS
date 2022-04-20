import { GetOrCreateGlobal } from "../../global/create";
import { JournalTry } from "../../journal/try";
import { CanvasRefreshEvent } from "../../types/canvas";
import { CanvasElement } from "./element";

export class CanvasSurface extends CanvasElement{
    private ctx_: CanvasRenderingContext2D | null;
    
    private canvas_: HTMLCanvasElement;
    private withMouse_: Element | null = null;

    private rendered_ = false;
    private queued_ = false;

    public static get observedAttributes(){
        return ['width', 'height', 'size'];
    }
    
    public constructor(){
        super();

        this.attachShadow({
            mode: 'open',
        });

        this.canvas_ = document.createElement('canvas');
        this.SetSize_();

        this.shadowRoot?.append(this.canvas_);
        this.addEventListener(CanvasRefreshEvent, () => this.Refresh());
        this.ctx_ = this.canvas_.getContext('2d');

        let removeMouse = () => {
            if (this.withMouse_){
                this.withMouse_.dispatchEvent(new CustomEvent('mouseleave'));
                this.withMouse_ = null;
            }
        };

        this.canvas_.addEventListener('mouseleave', removeMouse);
        this.canvas_.addEventListener('mousemove', (e) => {
            if (!this.ctx_){
                return;
            }
            
            let filtered = Array.from(this.children).filter(child => (typeof child['FindElementWithPoint'] === 'function'));
            let found = (filtered.find(child => (child as any)['FindElementWithPoint']({ x: e.offsetX, y: e.offsetY }, this.ctx_)) || null);

            if (found !== this.withMouse_){
                removeMouse();
            }
            
            if (found){
                if (found !== this.withMouse_){
                    (this.withMouse_ = found).dispatchEvent(new CustomEvent('mouseenter', { bubbles: true }));
                }
                found.dispatchEvent(new CustomEvent('mousemove', { bubbles: true }));
            }
        });

        this.canvas_.addEventListener('mousedown', () => {
            if (this.withMouse_){
                this.withMouse_.dispatchEvent(new CustomEvent('mousedown', { bubbles: true }));
            }
        });

        this.canvas_.addEventListener('mouseup', () => {
            if (this.withMouse_){
                this.withMouse_.dispatchEvent(new CustomEvent('mouseup', { bubbles: true }));
            }
        });

        this.canvas_.addEventListener('click', () => {
            if (this.withMouse_){
                this.withMouse_.dispatchEvent(new CustomEvent('click', { bubbles: true }));
            }
        });

        this.canvas_.addEventListener('dblclick', () => {
            if (this.withMouse_){
                this.withMouse_.dispatchEvent(new CustomEvent('dblclick', { bubbles: true }));
            }
        });
    }

    public Render(){
        if (this.queued_ || !this.canvas_){
            return;
        }

        this.queued_ = true;
        queueMicrotask(() => {
            this.queued_ = false;
            
            if (!this.ctx_){
                return;
            }
            
            if (this.rendered_){//Clear canvas
                let size = this.GetPair_('width', 'height', 'size');
                this.ctx_.clearRect(0, 0, parseInt(size.width), parseInt(size.height));
            }
            
            this.rendered_ = true;

            Array.from(this.children).filter(child => (typeof child['Paint'] === 'function')).forEach(child => JournalTry(() => child['Paint'](this.ctx_), 'Canvas.Render'));
        });
    }

    public Refresh(){
        if (this.rendered_){
            this.Render();
        }
    }

    protected widthChanged(){
        this.ForwardAttribute_('width', this.canvas_);
    }

    protected heightChanged(){
        this.ForwardAttribute_('height', this.canvas_);
    }

    protected sizeChanged(){
        this.SetSize_();
    }

    private SetSize_(){
        let size = this.GetPair_('width', 'height', 'size');
        this.canvas_.setAttribute('width', size.width);
        this.canvas_.setAttribute('height', size.height);
    }
}

export function CanvasSurfaceCompact(){
    customElements.define(GetOrCreateGlobal().GetConfig().GetDirectiveName('canvas'), CanvasSurface);
}
