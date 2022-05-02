import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal } from '../global/create';
import { BootstrapAndAttach } from '../bootstrap/attach';

import { DataDirectiveHandlerCompact } from '../directive/core/data/data';
import { TextDirectiveHandlerCompact } from '../directive/core/flow/text';
import { OnDirectiveHandlerCompact } from '../directive/core/flow/on';

import { UnoptimizedMagicHandlerCompact } from '../magic/core/reactive/unoptimized';
import { StaticMagicHandlerCompact } from '../magic/core/reactive/static';
import { EffectDirectiveHandlerCompact } from '../directive/core/reactive/effect';
import { StaticDirectiveHandlerCompact } from '../directive/core/reactive/static';

describe('data binding', () => {
    it('should work with data', () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    });

    it('should execute functions returned from expressions', () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar', getFoo: () => foo, getFoo2(){ return this.foo }, nested: { baz: 'baz', getBaz(){ return this.baz } } }">
                <span x-text="getFoo"></span>
                <span x-text="getFoo2"></span>
                <span x-text="nested.getBaz"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('bar');
        expect(document.querySelectorAll('span')[2].textContent).equal('baz');
    });

    it('should be reactive', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
                <button x-on:click="foo = 'baz'"></button>
            </div>
        `;
        
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should be unoptimized by default', async () => {
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'} }">
                <span x-text="nested.foo"></span>
                <span x-text="nested"></span>
                <button x-on:click="nested.foo = 'baz'"></button>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('{"foo":"bar"}');

        userEvent.click(document.querySelectorAll('button')[0]);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('{"foo":"baz"}') });

        userEvent.click(document.querySelectorAll('button')[1]);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('unoptimized') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('{"foo":"unoptimized"}') });
    });

    it('should obey global reactive settings', async () => {
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'} }">
                <span x-text="nested.foo"></span>
                <span x-text="nested"></span>
                <button x-on:click="nested.foo = 'baz'"></button>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
        `;
        
        CreateGlobal().GetConfig().SetReactiveState('optimized');

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('{"foo":"bar"}');

        userEvent.click(document.querySelectorAll('button')[0]);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('{"foo":"baz"}') });

        userEvent.click(document.querySelectorAll('button')[1]);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('{"foo":"unoptimized"}') });
    });

    it('should obey per component reactive settings', async () => {
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'}, $config: {reactiveState: 'optimized'} }">
                <span x-text="nested.foo"></span>
                <span x-text="nested"></span>
                <button x-on:click="nested.foo = 'baz'"></button>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();
        
        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('{"foo":"bar"}');

        userEvent.click(document.querySelectorAll('button')[0]);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('{"foo":"baz"}') });

        userEvent.click(document.querySelectorAll('button')[1]);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('{"foo":"unoptimized"}') });
    });

    it('should obey \'$unoptimized\' global magic property', async () => {
        document.body.innerHTML = `
            <div x-data="{ nested: {foo: 'bar'}, $config: {reactiveState: 'optimized'} }">
                <span x-text="nested.foo"></span>
                <span x-text="$unoptimized(nested.foo)"></span>
                <button x-on:click="nested = {foo: 'unoptimized'}"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        UnoptimizedMagicHandlerCompact();
        
        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('bar');

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('bar') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('unoptimized') });
    });

    it('should obey \'$static\' global magic property', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
                <span x-text="$static(foo)"></span>
                <button x-on:click="foo = 'baz'"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        StaticMagicHandlerCompact();
        
        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('bar');

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('bar') });
    });

    it('should be reactive for \'x-effect\' directives', async () => {
        document.body.innerHTML = `
            <div x-data="{foo: 'bar'}">
                <template x-effect="computed = (foo + ' added')"></template>
                <span x-text="foo"></span>
                <span x-text="computed"></span>
                <button x-on:click="foo = 'baz'"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();
        EffectDirectiveHandlerCompact();
        
        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('bar added');

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('baz added') });
    });

    it('should not be reactive for \'x-static\' directives', async () => {
        document.body.innerHTML = `
            <div x-data="{foo: 'bar'}">
                <template x-static="computed = (foo + ' added')"></template>
                <span x-text="foo"></span>
                <span x-text="computed"></span>
                <button x-on:click="foo = 'baz'"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();
        StaticDirectiveHandlerCompact();
        
        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');
        expect(document.querySelectorAll('span')[1].textContent).equal('bar added');

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('bar added') });
    });
});
