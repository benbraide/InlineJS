import { CanvasSurfaceCompact } from './components/canvas/surface';
import { CanvasRectCompact } from './components/canvas/rect';
import { CanvasRoundRectCompact } from './components/canvas/round-rect';
import { CanvasPathCompact } from './components/canvas/path';
import { CanvasLineCompact } from './components/canvas/line';
import { CanvasArcCompact } from './components/canvas/arc';
import { CanvasCircleCompact } from './components/canvas/circle';
import { WaitForGlobal } from './global/get';

WaitForGlobal().then(() => {
    CanvasSurfaceCompact();
    CanvasRectCompact();
    CanvasRoundRectCompact();
    CanvasPathCompact();
    CanvasLineCompact();
    CanvasArcCompact();
    CanvasCircleCompact();
});
