import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { WaitWhile } from "../../../evaluator/wait-while";
import { ToString } from "../../../utilities/to-string";
import { LazyCheck } from "../../lazy";

export const TextDirectiveHandler = CreateDirectiveHandlerCallback('text', ({ contextElement, ...rest }) => {
    let checkpoint = 0;
    LazyCheck({ contextElement, ...rest,
        callback: (value) => {
            let myCheckpoint = ++checkpoint;
            WaitWhile(value, (value) => {
                if (myCheckpoint == checkpoint){
                    contextElement.textContent = ToString(value);
                }
            });
        },
    });
});

export function TextDirectiveHandlerCompact(){
    AddDirectiveHandler(TextDirectiveHandler);
}
