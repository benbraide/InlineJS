import { Future } from '../values/future';
import { Loop } from '../values/loop';
import { Nothing } from '../values/nothing';
import { Stack } from '../stack';
import { InitializeGlobalScope } from '../utilities/get-global-scope';
export function InitializeValues() {
    InitializeGlobalScope('values', {
        future: Future,
        loop: Loop,
        nothing: Nothing,
        stack: Stack,
    });
}
