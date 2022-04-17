import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal } from '../global/create';
import { BootstrapAndAttach } from '../bootstrap/attach';

import { DataDirectiveHandlerCompact } from '../directive/core/data/data';
import { TextDirectiveHandlerCompact } from '../directive/core/flow/text';
import { OnDirectiveHandlerCompact } from '../directive/core/flow/on';
import { FormatMagicHandlerCompact } from '../magic/extended/format';

describe('x-text directive', () => {
    it('should set text content on init', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar', zoo: 'zar' }">
                <span x-text="foo"></span>
                <span x-text="zoo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('bar') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('zar') });
    });

    it('should be reactive', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <button x-on:click="foo = 'baz'"></button>
                <span x-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should work with async expressions', async () => {
        globalThis.asyncCall = () => {
            return new Promise<string>((resolve) => setTimeout(() => resolve('foo')));
        };
        
        document.body.innerHTML = `
            <div x-data>
                <span x-text="globalThis.asyncCall()"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('foo') });
    });

    it('should work with the \'$format\' global magic attribute', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
                <span x-text="$format.prefix(foo, 'prefixed_')"></span>
                <span x-text="$format.suffix(foo, '_suffixed')"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        FormatMagicHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('bar') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('prefixed_bar') });
        await waitFor(() => { expect(document.querySelectorAll('span')[2].textContent).equal('bar_suffixed') });
    });

    it('should work with the \'$format\' global magic attribute and be reactive', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'bar' }">
                <span x-text="foo"></span>
                <span x-text="$format.prefix(foo, 'prefixed_')"></span>
                <span x-text="$format.suffix(foo, '_suffixed')"></span>
                <button x-on:click="foo = 'baz'"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        FormatMagicHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('bar') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('prefixed_bar') });
        await waitFor(() => { expect(document.querySelectorAll('span')[2].textContent).equal('bar_suffixed') });

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('prefixed_baz') });
        await waitFor(() => { expect(document.querySelectorAll('span')[2].textContent).equal('baz_suffixed') });
    });

    it('should work with the \'$format\' global magic attribute and asyn expressions', async () => {
        globalThis.asyncCall = () => {
            return new Promise<string>((resolve) => setTimeout(() => resolve('foo')));
        };
        
        document.body.innerHTML = `
            <div x-data>
                <span x-text="globalThis.asyncCall()"></span>
                <span x-text="$format.prefix(globalThis.asyncCall(), 'prefixed_')"></span>
                <span x-text="$format.suffix(globalThis.asyncCall(), '_suffixed')"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        FormatMagicHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('foo') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('prefixed_foo') });
        await waitFor(() => { expect(document.querySelectorAll('span')[2].textContent).equal('foo_suffixed') });
    });
});
