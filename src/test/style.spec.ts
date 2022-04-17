import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal } from '../global/create';
import { BootstrapAndAttach } from '../bootstrap/attach';

import { DataDirectiveHandlerCompact } from '../directive/core/data/data';
import { StyleDirectiveHandlerCompact } from '../directive/core/attr/style';
import { OnDirectiveHandlerCompact } from '../directive/core/flow/on';

describe('x-style directive', () => {
    it('should set corresponding value on initialization', () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'block' }">
                <span x-style:display="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        StyleDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.style.display).equal('block');
    });

    it('should be reactive', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: 'block' }">
                <span x-style:display="foo"></span>
                <button x-on:click="foo = 'flex'"></button>
            </div>
        `;
    
        CreateGlobal(undefined, 999);

        DataDirectiveHandlerCompact();
        StyleDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.style.display).equal('block');
        
        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.style.display).equal('flex') });
    });

    it('should accept a key-value map', () => {
        document.body.innerHTML = `
            <div x-data="{ map: { display: 'block', width: '180px' } }">
                <span x-style="map"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        StyleDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.style.display).equal('block');
        expect(document.querySelector('span')!.style.width).equal('180px');
    });

    it('should have reactive key-value map', async () => {
        document.body.innerHTML = `
            <div x-data="{ map: { display: 'block', width: '180px' } }">
                <span x-style="map"></span>
                <button x-on:click="map.width = '270px'"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        StyleDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.style.display).equal('block');
        expect(document.querySelector('span')!.style.width).equal('180px');

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.style.display).equal('block') });
        await waitFor(() => { expect(document.querySelector('span')!.style.width).equal('270px') });
    });

    it('should format keys to camel casing', () => {
        document.body.innerHTML = `
            <div x-data="{ foo: '99' }">
                <span x-style:z-index="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        StyleDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.style.zIndex).equal('99');
    });
});
