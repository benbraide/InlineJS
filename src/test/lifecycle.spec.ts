import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal } from '../global/create';
import { BootstrapAndAttach } from '../bootstrap/attach';

import { DataDirectiveHandlerCompact } from '../directive/core/data/data';
import { TextDirectiveHandlerCompact } from '../directive/core/flow/text';
import { UninitDirectiveHandlerCompact } from '../directive/core/lifecycle/uninit';
import { PostDirectiveHandlerCompact } from '../directive/core/lifecycle/post';
import { OnDirectiveHandlerCompact } from '../directive/core/flow/on';
import { StaticDirectiveHandlerCompact } from '../directive/core/reactive/static';

describe('lifecycle', () => {
    it('should execute \'x-uninit\' on element removal', async () => {
        const runObservers = new Array<(changes: Array<any>) => void>();

        (global.MutationObserver as unknown) = class {
            constructor(callback: (changes: Array<any>) => void) {
                runObservers.push(callback);
            }

            observe() {}
        };
        
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
                <span x-uninit="foo = 'baz'"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        UninitDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');

        let span = document.querySelectorAll('span')[1];
        span.remove();
        
        runObservers.forEach(cb => cb([
            {
                target: document.body.firstElementChild,
                type: 'childList',
                addedNodes: [],
                removedNodes: [ span ],
            },
        ]));
        
        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });
    });

    it('should execute \'x-post\' after all other directives and offspring directives are evaluated', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }" x-post="foo = 'post'">
                <span x-text="foo" x-static="foo = 'bar'"></span>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        PostDirectiveHandlerCompact();
        StaticDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('post') });
    });

    it('should execute \'x-post\' after offspring x-post directives are evaluated', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }" x-post="foo = 'post'">
                <span x-text="foo" x-post="foo = 'bar'"></span>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        PostDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('post') });
    });

    it('should bind elements added to the DOM after initial attachment', async () => {
        const runObservers = new Array<(changes: Array<any>) => void>();

        (global.MutationObserver as unknown) = class {
            constructor(callback: (changes: Array<any>) => void) {
                runObservers.push(callback);
            }

            observe() {}
        };
        
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        StaticDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');

        let tmpl = document.createElement('template');
        tmpl.innerHTML = `
            <span x-static="foo = 'baz'"></span>
            <button x-on:click="foo = 'clicked'"></button>
        `;

        let newEls = Array.from(tmpl.content.children).map(child => child.cloneNode(true));
        newEls.forEach(el => document.body.firstElementChild!.appendChild(el));
        
        runObservers.forEach(cb => cb([
            {
                target: document.body.firstElementChild,
                type: 'childList',
                addedNodes: newEls,
                removedNodes: [],
            }
        ]));
        
        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });

        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('clicked') });
    });
});
