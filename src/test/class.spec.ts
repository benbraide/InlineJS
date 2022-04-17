import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal } from '../global/create';
import { BootstrapAndAttach } from '../bootstrap/attach';

import { DataDirectiveHandlerCompact } from '../directive/core/data/data';
import { ClassDirectiveHandlerCompact } from '../directive/core/attr/class';
import { OnDirectiveHandlerCompact } from '../directive/core/flow/on';

describe('x-class directive', () => {
    it('should remove class when attribute value is falsy', () => {
        document.body.innerHTML = `
            <div x-data="{ foo: false }">
                <span class="foo" x-class:foo="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(false);
    });

    it('should add class when attribute value is truthy', () => {
        document.body.innerHTML = `
            <div x-data="{ foo: true }">
                <span x-class:foo="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
    });

    it('should be reactive', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: true }">
                <span x-class:foo="foo"></span>
                <button x-on:click="foo = false"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        
        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.classList.contains('foo')).equal(false) });
    });

    it('should accept a key-value map', () => {
        document.body.innerHTML = `
            <div x-data="{ map: { foo: true, zoo: false } }">
                <span x-class="map"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('zoo')).equal(false);
    });

    it('should have reactive key-value map', async () => {
        document.body.innerHTML = `
            <div x-data="{ map: { foo: true, zoo: false } }">
                <span x-class="map"></span>
                <button x-on:click="map.foo = !(map.zoo = true)"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('zoo')).equal(false);

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.classList.contains('foo')).equal(false) });
        await waitFor(() => { expect(document.querySelector('span')!.classList.contains('zoo')).equal(true) });
    });

    it('should accept the short form and be reactive', async () => {
        document.body.innerHTML = `
            <div x-data="{ foo: true }">
                <span .foo="foo"></span>
                <button x-on:click="foo = false"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        
        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.classList.contains('foo')).equal(false) });
    });

    it('should be merged by string syntax', async () => {
        document.body.innerHTML = `
            <div x-data="{ isOn: false }">
                <span class="foo" x-class="isOn ? 'bar': ''"></span>
                <button x-on:click="isOn = ! isOn"></button>
            </div>
        `;
        
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(false);
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => {
            expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
            expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
        });
    
        document.querySelector('button')!.click();
    
        await waitFor(() => {
            expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
            expect(document.querySelector('span')!.classList.contains('bar')).equal(false);
        });
    });

    it('should be merged by array syntax', async () => {
        document.body.innerHTML = `
            <div x-data="{ isOn: false }">
                <span class="foo" x-class="isOn ? ['bar', 'baz'] : ['bar']"></span>
                <button x-on:click="isOn = ! isOn"></button>
            </div>
        `;
        
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
        expect(document.querySelector('span')!.classList.contains('baz')).equal(false);
    
        document.querySelector('button')!.click();
    
        await waitFor(() => {
            expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
            expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
            expect(document.querySelector('span')!.classList.contains('baz')).equal(true);
        });
    
        document.querySelector('button')!.click();
    
        await waitFor(() => {
            expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
            expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
            expect(document.querySelector('span')!.classList.contains('baz')).equal(false);
        });
    });

    it('should remove multiple classes by object syntax', () => {
        document.body.innerHTML = `
            <div x-data="{ isOn: false }">
                <span class="foo bar" x-class="{ 'foo bar': isOn }"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(false);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(false);
    });

    it('should add multiple classes by object syntax', () => {
        document.body.innerHTML = `
            <div x-data="{ isOn: true }">
                <span x-class="{ 'foo bar': isOn }"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
    });

    it('should be added by array syntax', () => {
        document.body.innerHTML = `
            <div x-data>
                <span class="" x-class="['foo', 'bar']"></span>
            </div>
        `;
        
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
    });

    it('should be synced by string syntax', () => {
        document.body.innerHTML = `
            <div x-data="{foo: 'bar baz'}">
                <span class="" x-class="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
        expect(document.querySelector('span')!.classList.contains('baz')).equal(true);
    });

    it('should ignore extra whitespace in object syntax', async () => {
        document.body.innerHTML = `
            <div x-data>
                <span x-class="{ '  foo  bar  ': true }"></span>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
    });
    
    it('should ignore extra whitespace in string syntax', () => {
        document.body.innerHTML = `
            <div x-data>
                <span x-class="'  foo  bar  '"></span>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
    });
});
