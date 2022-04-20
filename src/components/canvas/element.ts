import { ICanvasCoreState, ICanvasElement, ICanvasPosition, ICanvasShapeState, ICanvasSize } from "../../types/canvas";
import { IsEqual } from "../../utilities/is-equal";

export class CanvasElement<T = any> extends HTMLElement implements ICanvasElement{
    public static DefaultCoreState(): ICanvasCoreState{
        return {
            hidden: true,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 },
        };
    }
    
    public constructor(protected state_?: T){
        super();
    }

    public attributeChangedCallback(name: string, newValue: string, oldValue: string){
        if (typeof this[`${name}Changed`] === 'function'){
            this[`${name}Changed`](newValue, oldValue);
        }
    }

    public IsParent(){
        return false;
    }

    public ContainsPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): boolean{
        return false;
    }

    public FindElementWithPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): ICanvasElement | null{
        return (this.ContainsPoint(point, ctx) ? this : null);
    }

    public GetPosition(): ICanvasPosition{
        return ((this.state_ && (<unknown>this.state_ as ICanvasCoreState).position) ? (<unknown>this.state_ as ICanvasCoreState).position : { x: 0, y: 0 });
    }

    public OffsetPosition(position: ICanvasPosition): ICanvasPosition{
        return position;
    }

    public Paint(ctx: CanvasRenderingContext2D | Path2D){}

    protected UpdateState_(key: string, value: any){
        if (!this.state_ || (this.state_ && !(this.state_ as any).hasOwnProperty(key)) || IsEqual(this.state_[key], value)){
            return false;
        }

        this.state_[key] = value;
        return true;
    }

    protected SetPair_(first: string, second: string, both: string, separator = ' '){
        let pair = this.GetPair_(first, second, both, separator);
        this.UpdateState_(both, {
            [first]: parseInt(pair[first]),
            [second]: parseInt(pair[second]),
        });
    }
    
    protected GetPair_(first: string, second: string, both?: string, separator = ' '){
        let bothValue = (both && this.getAttribute(both));
        if (bothValue){
            let [firstValue, secondValue] = bothValue.split(separator);
            return { [first]: firstValue, [second]: (secondValue || firstValue) };
        }
        return { [first]: (this.getAttribute(first) || ''), [second]: (this.getAttribute(second) || '') };
    }

    protected ForwardAttribute_(names: string | Array<string>, target: HTMLElement){
        (Array.isArray(names) ? names : [names]).forEach((name) => {
            if (this.hasAttribute(name)){
                target.setAttribute(name, (this.getAttribute(name) || ''));
            }
            else{
                target.removeAttribute(name);
            }
        });
    }
}

export class CanvasBlockElement<T = ICanvasShapeState> extends CanvasElement<T>{
    public constructor(state?: T, resolveState = true){
        super(state);
        if (resolveState){
            this.ResolveState_();
        }
    }

    public ContainsPoint(point: ICanvasPosition, ctx: CanvasRenderingContext2D): boolean{
        if (!this.state_ || !('position' in this.state_) || !('size' in this.state_)){
            return false;
        }

        let position: ICanvasPosition = this.state_['position'], size: ICanvasSize = this.state_['size'];
        if (this.parentElement && 'OffsetPosition' in this.parentElement){
            position = (this.parentElement as any)['OffsetPosition'](position);
        }
        
        return (point.x >= position.x && point.y >= position.y && point.x < (position.x + size.width) && point.y < (position.y + size.height));
    }

    protected hiddenChanged(){
        this.UpdateState_('hidden', this.hasAttribute('hidden'));
    }

    protected colorChanged(){
        this.UpdateState_('color', (this.getAttribute('color') || ''));
    }
    
    protected xChanged(){
        this.SetPosition_();
    }

    protected yChanged(){
        this.SetPosition_();
    }

    protected positionChanged(){
        this.SetPosition_();
    }

    protected SetPosition_(){
        this.SetPair_('x', 'y', 'position');
    }

    protected widthChanged(){
        this.SetSize_();
    }

    protected heightChanged(){
        this.SetSize_();
    }

    protected sizeChanged(){
        this.SetSize_();
    }

    protected SetSize_(){
        this.SetPair_('width', 'height', 'size');
    }
    
    protected ResolveState_(){
        if (this.state_){
            Object.keys(this.state_).forEach((key) => {
                if (typeof this.state_![key] === 'boolean'){
                    this.state_![key] = this.hasAttribute(key);
                }
                else if (typeof this.state_![key] === 'number'){
                    this.state_![key] = (parseInt(this.getAttribute(key) || '0') || 0);
                }
                else if (typeof this.state_![key] === 'string'){
                    this.state_![key] = (this.getAttribute(key) || '');
                }
            });

            this.SetPosition_();
            this.SetSize_();
        }
    }
}
