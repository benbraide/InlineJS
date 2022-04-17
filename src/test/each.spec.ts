import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal } from '../global/create';
import { BootstrapAndAttach } from '../bootstrap/attach';

import { DataDirectiveHandlerCompact } from '../directive/core/data/data';
import { EachDirectiveHandlerCompact } from '../directive/core/control/each';
import { TextDirectiveHandlerCompact } from '../directive/core/flow/text';
import { OnDirectiveHandlerCompact } from '../directive/core/flow/on';
import { UninitDirectiveHandlerCompact } from '../directive/core/lifecycle/uninit';

describe('x-each directive', () => {
    it('should work on arrays', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="['foo', 'bar']">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.2');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
    });

    it('should support the \'as <name>\' syntax on arrays', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="['foo', 'bar'] as item">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.foo.2');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.bar.2');
    });

    it('should support the \'as <key> => <name>\' syntax on arrays', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="['foo', 'bar'] as key => item">
                    <p x-text="\`\${$each.index}.\${key}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.0.foo.foo.2');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.1.bar.bar.2');
    });

    it('should work on arrays of objects', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="[{ name: 'Anon', age: 27 }, { name: 'Legion', age: 99 }] as item">
                    <p x-text="\`\${item.name}.\${item.age}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('Anon.27');
        expect(document.querySelectorAll('p')[1].textContent).equal('Legion.99');
    });

    it('should be reactive when array is replaced', async () => {
        document.body.innerHTML = `
            <div x-data="{ list: ['foo'] }">
                <template x-each="list">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button x-on:click="list = ['foo', 'bar']"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.1');
        
        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(2);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.2');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
        });
    });

    it('should be reactive when array is manipulated', async () => {
        document.body.innerHTML = `
            <div x-data="{ list: ['foo'] }">
                <template x-each="list">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button x-on:click="list.push('bar')"></button>
                <button x-on:click="list.unshift('first')"></button>
                <button x-on:click="list.splice(1, 1)"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.1');
        
        userEvent.click(document.querySelectorAll('button')[0]);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(2);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.2');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
        });

        userEvent.click(document.querySelectorAll('button')[1]);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(3);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.first.3');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.foo.3');
            expect(document.querySelectorAll('p')[2].textContent).equal('2.bar.3');
        });

        userEvent.click(document.querySelectorAll('button')[2]);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(2);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.first.2');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.2');
        });
    });

    it('should support the \'as <name>\' syntax and be reactive', async () => {
        document.body.innerHTML = `
            <div x-data="{ list: ['foo'] }">
                <template x-each="list as item">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
                <button x-on:click="list = ['foo', 'bar']"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.foo.1');
        
        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(2);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.foo.2');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.bar.bar.2');
        });
    });

    it('should remove all elements when array is empty', async () => {
        document.body.innerHTML = `
            <div x-data="{ list: ['foo'] }">
                <template x-each="list">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button x-on:click="list = []"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(1);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.foo.1');
        
        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => { expect(document.querySelectorAll('p').length).equal(0) });
    });

    it('should optimize the creation of new nodes when coupled with a key', async () => {
        document.body.innerHTML = `
            <div x-data="{ list: ['foo'], uninitCount: 0 }">
                <template x-each="list as index => item" :key="index">
                    <p x-text="item + '.' + $each.count" x-uninit="uninitCount += 1"></p>
                </template>
                <template x-each="list as item">
                    <p x-text="item" x-uninit="uninitCount += 1"></p>
                </template>
                <button x-on:click="list = ['foo', 'bar']"></button>
                <span x-text="uninitCount"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();
        UninitDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(2);
        expect(document.querySelectorAll('p')[0].textContent).equal('foo.1');
        expect(document.querySelectorAll('p')[1].textContent).equal('foo');
        expect(document.querySelectorAll('span')[0].textContent).equal('0');
        
        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(4);
            expect(document.querySelectorAll('p')[0].textContent).equal('foo.2');
            expect(document.querySelectorAll('p')[1].textContent).equal('bar.2');
            expect(document.querySelectorAll('p')[2].textContent).equal('foo');
            expect(document.querySelectorAll('p')[3].textContent).equal('bar');
            expect(document.querySelectorAll('span')[0].textContent).equal('1');
        });
    });

    it('should work on positive integer ranges', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="3">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(3);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.0.3');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.1.3');
        expect(document.querySelectorAll('p')[2].textContent).equal('2.2.3');
    });

    it('should work on positive integer ranges and be reactive', async () => {
        document.body.innerHTML = `
            <div x-data="{ value: 3 }">
                <template x-each="value">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button x-on:click="value = 5"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(3);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.0.3');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.1.3');
        expect(document.querySelectorAll('p')[2].textContent).equal('2.2.3');

        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(5);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.0.5');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.1.5');
            expect(document.querySelectorAll('p')[2].textContent).equal('2.2.5');
            expect(document.querySelectorAll('p')[3].textContent).equal('3.3.5');
            expect(document.querySelectorAll('p')[4].textContent).equal('4.4.5');
        });
    });

    it('should work on negative integer ranges', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="-3">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(3);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.-1.3');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.-2.3');
        expect(document.querySelectorAll('p')[2].textContent).equal('2.-3.3');
    });

    it('should work on negative integer ranges and be reactive', async () => {
        document.body.innerHTML = `
            <div x-data="{ value: -3 }">
                <template x-each="value">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
                <button x-on:click="value = -5"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(3);
        expect(document.querySelectorAll('p')[0].textContent).equal('0.-1.3');
        expect(document.querySelectorAll('p')[1].textContent).equal('1.-2.3');
        expect(document.querySelectorAll('p')[2].textContent).equal('2.-3.3');

        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => {
            expect(document.querySelectorAll('p').length).equal(5);
            expect(document.querySelectorAll('p')[0].textContent).equal('0.-1.5');
            expect(document.querySelectorAll('p')[1].textContent).equal('1.-2.5');
            expect(document.querySelectorAll('p')[2].textContent).equal('2.-3.5');
            expect(document.querySelectorAll('p')[3].textContent).equal('3.-4.5');
            expect(document.querySelectorAll('p')[4].textContent).equal('4.-5.5');
        });
    });

    it('should work on key-value pairs', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="{ name: 'John Doe', age: 36, gender: 'MALE' }">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(3);
        expect(document.querySelectorAll('p')[0].textContent).equal('name.John Doe.3');
        expect(document.querySelectorAll('p')[1].textContent).equal('age.36.3');
        expect(document.querySelectorAll('p')[2].textContent).equal('gender.MALE.3');
    });

    it('should support the \'as <name>\' syntax on key-value pairs', () => {
        document.body.innerHTML = `
            <div x-data>
                <template x-each="{ name: 'John Doe', age: 36, gender: 'MALE' } as item">
                    <p x-text="\`\${$each.index}.\${$each.value}.\${item}.\${$each.count}\`"></p>
                </template>
            </div>
        `;
        
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('p').length).equal(3);
        expect(document.querySelectorAll('p')[0].textContent).equal('name.John Doe.John Doe.3');
        expect(document.querySelectorAll('p')[1].textContent).equal('age.36.36.3');
        expect(document.querySelectorAll('p')[2].textContent).equal('gender.MALE.MALE.3');
    });

    it('should contain reactive elements', async () => {
        document.body.innerHTML = `
            <div x-data="{ items: ['first'], foo: 'bar' }">
                <button x-on:click="foo = 'baz'"></button>
                <template x-each="items">
                    <section>
                        <h1 x-text="\`\${$each.index}.\${$each.value}.\${$each.count}\`"></h1>
                        <h2 x-text="foo"></h2>
                    </section>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('section').length).equal(1);
        expect(document.querySelector('h1')!.textContent).equal('0.first.1');
        expect(document.querySelector('h2')!.textContent).equal('bar');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => {
            expect(document.querySelector('h1')!.textContent).equal('0.first.1');
            expect(document.querySelector('h2')!.textContent).equal('baz');
        });
    });

    it('can be nested', async () => {
        document.body.innerHTML = `
            <div x-data="{ $enableOptimizedBinds: false, foos: [ { bars: ['bob', 'lob'] } ] }">
                <button x-on:click="foos = [ { bars: ['bob', 'lob'] }, { bars: ['law'] } ]"></button>
                <template x-each="foos">
                    <template x-each="$each.value.bars">
                        <span x-text="$each.value"></span>
                    </template>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span').length).equal(2) });
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bob');
        expect(document.querySelectorAll('span')[1].textContent).equal('lob');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelectorAll('span').length).equal(3) });
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bob');
        expect(document.querySelectorAll('span')[1].textContent).equal('lob');
        expect(document.querySelectorAll('span')[2].textContent).equal('law');
    });

    it('should be able to access parent data when nested', async () => {
        document.body.innerHTML = `
            <div x-data="{ foos: [ {name: 'foo', bars: ['bob', 'lob']}, {name: 'baz', bars: ['bab', 'lab']} ] }">
                <template x-each="foos">
                    <template x-each="$each.value.bars">
                        <span x-text="$each.parent.value.name+': '+$each.value"></span>
                    </template>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span').length).equal(4) });
    
        expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob');
        expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob');
        expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab');
        expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab');
    });

    it('should support the \'as <name>\' syntax and be able to access parent data when nested', async () => {
        document.body.innerHTML = `
            <div x-data="{ foos: [ {name: 'foo', bars: ['bob', 'lob']}, {name: 'baz', bars: ['bab', 'lab']} ] }">
                <template x-each="foos as foo">
                    <template x-each="foo.bars as bar">
                        <span x-text="foo.name+': '+bar"></span>
                    </template>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span').length).equal(4) });
    
        expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob');
        expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob');
        expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab');
        expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab');
    });

    it('should be able to handle nested event listeners', async () => {
        document['_alerts'] = [];
    
        document.body.innerHTML = `
            <div x-data="{ foos: [
                {name: 'foo', bars: [{name: 'bob', count: 0}, {name: 'lob', count: 0}]},
                {name: 'baz', bars: [{name: 'bab', count: 0}, {name: 'lab', count: 0}]}
            ], fnText: function(foo, bar) { return foo.name+': '+bar.name+' = '+bar.count; }, onClick: function(foo, bar){ bar.count += 1; document._alerts.push(this.fnText(foo, bar)) } }">
                <template x-each="foos">
                    <template x-each="$each.value.bars">
                        <span x-text="fnText($each.parent.value, $each.value)" x-on:click="onClick($each.parent.value, $each.value)" ></span>
                    </template>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span').length).equal(4) });
    
        expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 0');
        expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
        expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 0');
        expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
        expect(document['_alerts'].length).equal(0);
    
        userEvent.click(document.querySelectorAll('span')[0]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 1');
            expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 0');
            expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
            expect(document['_alerts'].length).equal(1);
            expect(document['_alerts'][0]).equal('foo: bob = 1');
        });
    
        userEvent.click(document.querySelectorAll('span')[2]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 1');
            expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 1');
            expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
            expect(document['_alerts'].length).equal(2);
            expect(document['_alerts'][0]).equal('foo: bob = 1');
            expect(document['_alerts'][1]).equal('baz: bab = 1');
        });
    
        userEvent.click(document.querySelectorAll('span')[0]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 2');
            expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 1');
            expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
            expect(document['_alerts'].length).equal(3);
            expect(document['_alerts'][0]).equal('foo: bob = 1');
            expect(document['_alerts'][1]).equal('baz: bab = 1');
            expect(document['_alerts'][2]).equal('foo: bob = 2');
        });
    });

    it('should support the \'as <name>\' syntax and be able to handle nested event listeners', async () => {
        document['_alerts'] = [];
    
        document.body.innerHTML = `
            <div x-data="{ foos: [
                {name: 'foo', bars: [{name: 'bob', count: 0}, {name: 'lob', count: 0}]},
                {name: 'baz', bars: [{name: 'bab', count: 0}, {name: 'lab', count: 0}]}
            ], fnText: function(foo, bar) { return foo.name+': '+bar.name+' = '+bar.count; }, onClick: function(foo, bar){ bar.count += 1; document._alerts.push(this.fnText(foo, bar)) } }">
                <template x-each="foos as foo">
                    <template x-each="foo.bars as bar">
                        <span x-text="fnText(foo, bar)" x-on:click="onClick(foo, bar)" ></span>
                    </template>
                </template>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        EachDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span').length).equal(4) });
    
        expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 0');
        expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
        expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 0');
        expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
        expect(document['_alerts'].length).equal(0);
    
        userEvent.click(document.querySelectorAll('span')[0]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 1');
            expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 0');
            expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
            expect(document['_alerts'].length).equal(1);
            expect(document['_alerts'][0]).equal('foo: bob = 1');
        });
    
        userEvent.click(document.querySelectorAll('span')[2]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 1');
            expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 1');
            expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
            expect(document['_alerts'].length).equal(2)
            expect(document['_alerts'][0]).equal('foo: bob = 1')
            expect(document['_alerts'][1]).equal('baz: bab = 1')
        });
    
        userEvent.click(document.querySelectorAll('span')[0]);
    
        await waitFor(() => {
            expect(document.querySelectorAll('span')[0].textContent).equal('foo: bob = 2');
            expect(document.querySelectorAll('span')[1].textContent).equal('foo: lob = 0');
            expect(document.querySelectorAll('span')[2].textContent).equal('baz: bab = 1');
            expect(document.querySelectorAll('span')[3].textContent).equal('baz: lab = 0');
    
            expect(document['_alerts'].length).equal(3);
            expect(document['_alerts'][0]).equal('foo: bob = 1');
            expect(document['_alerts'][1]).equal('baz: bab = 1');
            expect(document['_alerts'][2]).equal('foo: bob = 2');
        });
    });
});
