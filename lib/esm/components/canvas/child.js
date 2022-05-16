import { CanvasShape } from "./shape";
export class CanvasChild extends CanvasShape {
    constructor(state) {
        super(state || CanvasChild.DefaultState());
    }
    Paint_(ctx) {
        if (typeof this['paint'] === 'function') {
            this['paint'](ctx);
        }
    }
}
