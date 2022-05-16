import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { BuildProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { IsObject } from "../../utilities/is-object";
let OverlayState = {
    element: document.createElement('div'),
    zIndex: 999,
    showCount: 0,
    visible: false,
    overflow: false,
};
let OverlayStyles = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.63)',
    zIndex: '',
};
function ApplyOverlayStyles() {
    OverlayStyles.zIndex = OverlayState.zIndex.toString();
    Object.entries(OverlayStyles).forEach(([key, value]) => {
        if (key in OverlayState.element.style) {
            OverlayState.element.style[key] = value;
        }
    });
}
function RemoveOverlayStyles() {
    Object.keys(OverlayStyles).forEach((key) => {
        if (key in OverlayState.element.style) {
            OverlayState.element.style.removeProperty(key);
        }
    });
}
function UpdateOverlayVisibility() {
    OverlayState.showCount = ((OverlayState.showCount < 0) ? 0 : OverlayState.showCount);
    SetOverlayVisibility(OverlayState.showCount > 0);
}
function SetOverlayVisibility(visible) {
    if (visible != OverlayState.visible) {
        OverlayState.visible = visible;
        OverlayState.overflow = (document.body.clientHeight < document.body.scrollHeight);
        if (visible) {
            OverlayState.element.style.removeProperty('display');
        }
        else {
            OverlayState.element.style.display = 'none';
        }
        window.dispatchEvent(new CustomEvent('overlay.visibility', {
            detail: { visible },
        }));
        window.dispatchEvent(new CustomEvent(`overlay.${visible ? 'visible' : 'hidden'}`));
    }
}
function CreateOverlayProxy() {
    ApplyOverlayStyles();
    OverlayState.element.style.width = '0';
    document.body.appendChild(OverlayState.element);
    OverlayState.element.addEventListener('click', (e) => {
        window.dispatchEvent(new CustomEvent('overlay.click', {
            detail: { native: e, bubbled: (e.target !== OverlayState.element) },
        }));
    });
    let methods = {
        setStyle: (key, value) => {
            OverlayStyles[key] = value;
            ApplyOverlayStyles();
        },
        applyStyles: ApplyOverlayStyles,
        offsetShowCount: (offset) => {
            OverlayState.showCount += offset;
            UpdateOverlayVisibility();
        },
    };
    return CreateInplaceProxy(BuildProxyOptions({
        getter: (prop) => {
            if (prop && OverlayState.hasOwnProperty(prop)) {
                return OverlayState[prop];
            }
            if (prop && methods.hasOwnProperty(prop)) {
                return methods[prop];
            }
            if (prop === 'styles') {
                return OverlayStyles;
            }
        },
        setter: (prop, value) => {
            if (prop === 'zIndex') {
                OverlayState.zIndex = ((typeof value === 'number') ? value : (parseInt(value) || 0));
                OverlayStyles.zIndex = OverlayState.zIndex.toString();
                OverlayState.element.style.zIndex = OverlayStyles.zIndex;
            }
            else if (prop === 'showCount') {
                OverlayState.showCount = ((typeof value === 'number') ? value : (parseInt(value) || 0));
                UpdateOverlayVisibility();
            }
            else if (prop === 'styles' && IsObject(value)) {
                RemoveOverlayStyles();
                OverlayStyles = value;
                ApplyOverlayStyles();
            }
            return true;
        },
        lookup: [...Object.keys(OverlayState), ...Object.keys(methods), 'styles'],
    }));
}
const OverlayProxy = CreateOverlayProxy();
export const OverlayMagicHandler = CreateMagicHandlerCallback('overlay', () => OverlayProxy);
export function OverlayMagicHandlerCompact() {
    AddMagicHandler(OverlayMagicHandler);
}
