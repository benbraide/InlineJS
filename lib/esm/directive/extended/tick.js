import { FindComponentById } from "../../component/find";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { AddChanges } from "../../proxy/add-changes";
import { BuildProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { CreateLoop } from "../../utilities/loop";
import { ResolveOptions } from "../options";
export const TickDirectiveHandler = CreateDirectiveHandlerCallback('tick', ({ component, componentId, contextElement, expression, argOptions }) => {
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), options = ResolveOptions({
        options: {
            delay: 1000,
            duration: 0,
            steps: -1,
            stopped: false,
        },
        list: argOptions,
        defaultNumber: -1,
    });
    let getDelay = () => ((options.delay < 0) ? 1000 : options.delay), checkDuration = () => {
        if (options.duration > 0) { //Compute steps
            options.steps = Math.ceil(options.duration / getDelay());
        }
    };
    checkDuration();
    let resolvedComponent = (component || FindComponentById(componentId)), id = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.GenerateUniqueId('tick_proxy_'), state = {
        steps: 0,
        running: !options.stopped,
        checkpoint: 0,
    };
    let canRun = () => (state.steps < options.steps || options.steps == -1), step = (checkpoint, { abort }) => {
        let component = FindComponentById(componentId);
        if (!component || !state.running || checkpoint != state.checkpoint) {
            if (abort) {
                abort();
            }
            return;
        }
        updateState('steps', (state.steps + 1));
        if (!canRun()) {
            updateState('running', false);
            if (abort) {
                abort();
            }
        }
        evaluate();
    };
    let run = () => {
        CreateLoop(0, getDelay()).While(step.bind(null, ++state.checkpoint));
        evaluate();
    };
    let updateState = (key, value, shouldEvaluate = false) => {
        if (state[key] !== value) {
            let component = FindComponentById(componentId);
            if (component) { //Alert change
                AddChanges('set', `${id}.${key}`, key, component.GetBackend().changes);
            }
            state[key] = value;
            if (shouldEvaluate) {
                evaluate();
            }
        }
    };
    let methods = {
        run: () => {
            if (!state.running && canRun()) {
                updateState('running', true);
                run();
            }
        },
        pause: () => {
            if (state.running) {
                ++state.checkpoint;
                updateState('running', false);
            }
        },
        stop: () => {
            if (state.running) {
                ++state.checkpoint;
                updateState('steps', 0);
                updateState('running', false, true);
            }
            else if (state.steps > 0) {
                updateState('steps', 0, true);
            }
        },
        reset: () => {
            updateState('steps', 0);
            updateState('running', true);
            run();
        },
    };
    let elementScope = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindElementScope(contextElement);
    elementScope === null || elementScope === void 0 ? void 0 : elementScope.AddUninitCallback(() => {
        ++state.checkpoint;
        state.steps = 0;
    });
    let local = CreateInplaceProxy(BuildProxyOptions({ getter: (prop) => {
            var _a;
            if (prop && methods.hasOwnProperty(prop)) {
                return methods[prop];
            }
            if (prop === 'steps' || prop === 'running') {
                (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return state[prop];
            }
            if (prop && options.hasOwnProperty(prop)) {
                return options[prop];
            }
        }, setter: (prop, value) => {
            if (prop === 'duration') {
                options.duration = ((typeof value === 'number') ? value : 0);
                checkDuration();
            }
            else if (prop === 'delay') {
                options.delay = ((typeof value === 'number') ? value : 0);
            }
            else if (prop === 'steps') {
                options.steps = ((typeof value === 'number') ? value : 0);
            }
            return true;
        }, lookup: [...Object.keys(methods), 'steps', 'running', ...Object.keys(options)] }));
    elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$tick', local);
    if (state.running) {
        run();
    }
    else {
        evaluate();
    }
});
export function TickDirectiveHandlerCompact() {
    AddDirectiveHandler(TickDirectiveHandler);
}
