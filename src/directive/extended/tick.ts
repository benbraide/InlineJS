import { FindComponentById } from "../../component/find";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { AddChanges } from "../../proxy/add-changes";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { CreateLoop, ILoopCallbackInfo } from "../../utilities/loop";
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

    let getDelay = () => ((options.delay <= 0) ? 1000 : options.delay);
    if (options.duration > 0){//Compute steps
        options.steps = Math.ceil(options.duration / getDelay());
    }

    let resolvedComponent = (component || FindComponentById(componentId)), id = resolvedComponent?.GenerateUniqueId('tick_proxy_'), state = {
        steps: 0,
        running: !options.stopped,
        checkpoint: 0,
    };

    let canRun = () => (state.steps < options.steps || options.steps == -1), step = (checkpoint: number, { abort }: ILoopCallbackInfo) => {
        let component = FindComponentById(componentId);
        if (!component || !state.running || checkpoint != state.checkpoint){
            if (abort){
                abort();
            }
            return;
        }

        updateState('steps', (state.steps + 1));
        if (!canRun()){
            updateState('running', false);
            if (abort){
                abort();
            }
        }

        evaluate();
    };

    let run = () => {
        CreateLoop(0, getDelay()).While(step.bind(null, ++state.checkpoint));
        evaluate();
    };

    let updateState = (key: string, value: number | boolean, shouldEvaluate = false) => {
        if (state[key] !== value){
            let component = FindComponentById(componentId);
            if (component){//Alert change
                AddChanges('set', `${id}.${key}`, key, component.GetBackend().changes);
            }
            
            state[key] = value;
            if (shouldEvaluate){
                evaluate();
            }
        }
    };

    let methods = {
        run: () => {
            if (!state.running && canRun()){
                updateState('running', true);
                run();
            }
        },
        pause: () => {
            if (state.running){
                ++state.checkpoint;
                updateState('running', false);
            }
        },
        stop: () => {
            if (state.running){
                ++state.checkpoint;
                updateState('steps', 0);
                updateState('running', false, true);
            }
            else if (state.steps > 0){
                updateState('steps', 0, true);
            }
        },
        reset: () => {
            updateState('steps', 0);
            updateState('running', true);
            run();
        },
    };

    let elementScope = resolvedComponent?.FindElementScope(contextElement);
    elementScope?.AddUninitCallback(() => {
        ++state.checkpoint;
        state.steps = 0;
    });

    let local = CreateInplaceProxy(BuildGetterProxyOptions({ getter: (prop) => {
        if (prop && methods.hasOwnProperty(prop)){
            return methods[prop];
        }
        
        if (prop === 'steps' || prop === 'running'){
            FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
            return state[prop];
        }
    }, lookup: [...Object.keys(methods), 'steps', 'running'] }));

    elementScope?.SetLocal('$tick', local);
    if (state.running){
        run();
    }
    else{
        evaluate();
    }
});

export function TickDirectiveHandlerCompact(){
    AddDirectiveHandler(TickDirectiveHandler);
}
