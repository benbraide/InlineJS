import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal } from '../global/create';
import { BootstrapAndAttach } from '../bootstrap/attach';

import { DataDirectiveHandlerCompact } from '../directive/core/data/data';
import { TextDirectiveHandlerCompact } from '../directive/core/flow/text';
import { OnDirectiveHandlerCompact } from '../directive/core/flow/on';
import { RefDirectiveHandlerCompact } from '../directive/core/data/ref';
import { RefsMagicHandlerCompact } from '../magic/core/data/refs';
import { NextTickMagicHandlerCompact } from '../magic/core/nexttick';
import { EachDirectiveHandlerCompact } from '../directive/core/control/each';

describe('$nextTick global magic property', () => {
    it('should execute attached callback', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-ref="span" x-text="foo"></span>
                <button x-on:click="foo = 'baz'; $nextTick(() => { $refs.span.textContent = 'bob' })"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        RefDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        RefsMagicHandlerCompact();
        NextTickMagicHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => expect(document.querySelector('span')!.textContent).equal('bob'));
    });

    it('should wait for x-each directive to finish rendering', async () => {
        document.body.innerHTML = `
            <div x-data="{ list: ['one', 'two'], check: 2 }">
                <template x-each="list">
                    <span x-text="$each.value"></span>
                </template>
                <p x-text="check"></p>
                <button x-on:click="list = ['one', 'two', 'three']; $nextTick(() => { check = document.querySelectorAll('span').length })"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        NextTickMagicHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('p')!.textContent).equal('2');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('p')!.textContent).equal('3') });
    });
});
