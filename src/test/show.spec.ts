import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal } from '../global/create';
import { BootstrapAndAttach } from '../bootstrap/attach';

import { DataDirectiveHandlerCompact } from '../directive/core/data/data';
import { ShowDirectiveHandlerCompact } from '../directive/core/show';
import { OnDirectiveHandlerCompact } from '../directive/core/flow/on';

describe('x-show directive', () => {
    it('should toggle display: none; with no other style attributes', async () => {
        document.body.innerHTML = `
            <div x-data="{ show: true }">
                <span x-show="show"></span>
                <button x-on:click="show = ! show"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ShowDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.getAttribute('style')).equal(null);
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.getAttribute('style')).equal('display: none;') });

        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.getAttribute('style')).equal(null) });
    });

    it('should toggle display: none; with other style attributes', async () => {
        document.body.innerHTML = `
            <div x-data="{ show: true }">
                <span x-show="show" style="color: blue;"></span>
                <button x-on:click="show = ! show"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ShowDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.getAttribute('style')).equal('color: blue;');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.getAttribute('style')).equal('color: blue; display: none;') });

        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.getAttribute('style')).equal('color: blue;') });
    });
});
