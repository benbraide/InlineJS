import { expect } from 'chai'
import { describe, it } from 'mocha'

import { CreateGlobal } from "../global/create";
import { CreateChildProxy } from "../proxy/create-child";
import { IBubbledChange, IChange } from '../types/change';
import { IsEqual } from '../utilities/is-equal';
import { IsObject } from '../utilities/is-object';
import { ProxyKeys } from '../utilities/proxy-keys';
import { ProxyAccessStorage } from '../storage/get-access';

describe('proxy', () => {
    it('should be able to be created as root or child', () => {
        const global = CreateGlobal(), component = global.CreateComponent(document.createElement('div'));
        const root = component.GetRootProxy(), child = CreateChildProxy(root, 'one', {})!, proxyName = `Proxy<${component.GetId()}>`;

        expect(root.IsRoot()).equal(true);
        expect(child.IsRoot()).equal(false);
        
        expect(root.GetName()).equal(proxyName);
        expect(root.GetPath()).equal(proxyName);
        expect(root.GetParentPath()).equal('');

        expect(child.GetName()).equal('one');
        expect(child.GetPath()).equal(`${proxyName}.one`);
        expect(child.GetParentPath()).equal(root.GetPath());
    });

    it('should respond to queries', () => {
        const global = CreateGlobal(), component = global.CreateComponent(document.createElement('div'));
        const root = component.GetRootProxy(), target = {}, child = CreateChildProxy(root, 'one', target)!, proxyName = `Proxy<${component.GetId()}>`;

        expect(root.GetNative()[ProxyKeys.componentId]).equal(component.GetId());
        expect(root.GetNative()[ProxyKeys.name]).equal(proxyName);
        expect(root.GetNative()[ProxyKeys.path]).equal(proxyName);
        expect(root.GetNative()[ProxyKeys.parentPath]).equal('');
        expect(IsObject(root.GetNative()[ProxyKeys.target])).equal(true);

        expect(child.GetNative()[ProxyKeys.componentId]).equal(component.GetId());
        expect(child.GetNative()[ProxyKeys.name]).equal('one');
        expect(child.GetNative()[ProxyKeys.path]).equal(`${proxyName}.one`);
        expect(child.GetNative()[ProxyKeys.parentPath]).equal(root.GetPath());
        expect(child.GetNative()[ProxyKeys.target]).equal(target);
    });

    it('should set, retrieve, and delete values', () => {
        const global = CreateGlobal(), component = global.CreateComponent(document.createElement('div')), root = component.GetRootProxy();

        root.GetNative()['state'] = true;
        root.GetNative()['quantity'] = 72;
        root.GetNative()['list'] = [1, 2, 3, 4, 5];
        root.GetNative()['bio'] = {
            name: 'Clark Kent',
            alt: 'Superman',
            age: 36,
            isAlien: true,
        };

        expect(root.GetNative()['state']).equal(true);
        expect(root.GetNative()['quantity']).equal(72);
        expect(IsEqual(root.GetNative()['list'], [1, 2, 3, 4, 5])).equal(true);

        expect(root.GetNative()['bio']['name']).equal('Clark Kent');
        expect(root.GetNative()['bio']['alt']).equal('Superman');
        expect(root.GetNative()['bio']['age']).equal(36);
        expect(root.GetNative()['bio']['isAlien']).equal(true);

        delete root.GetNative()['bio']['name'];
        expect(root.GetNative()['bio']['name']).equal(null);
    });

    it('should alert accesses on get operations', () => {
        const global = CreateGlobal(), component = global.CreateComponent(document.createElement('div')), root = component.GetRootProxy();

        global.GetConfig().SetReactiveState('optimized');
        
        root.GetNative()['state'] = true;
        root.GetNative()['quantity'] = 72;
        root.GetNative()['list'] = [1, 2, 3, 4, 5];
        root.GetNative()['bio'] = {
            name: 'Clark Kent',
            alt: 'Superman',
            age: 36,
            isAlien: true,
        };

        const storage = new ProxyAccessStorage;

        global.UseProxyAccessStorage(() => {
            root.GetNative()['state'];
        }, storage);
        
        root.GetNative()['state'];

        let entries = storage.GetEntries();

        expect(entries.length).equal(1);
        expect(entries[0].componentId).equal(component.GetId());
        expect(entries[0].path).equal(`Proxy<${component.GetId()}>.state`);

        storage.Clear();

        global.UseProxyAccessStorage(() => {
            root.GetNative()['quantity'];
            root.GetNative()['bio']['name'];
        }, storage);

        entries = storage.GetEntries();

        expect(entries.length).equal(2);
        expect(entries[0].componentId).equal(component.GetId());
        expect(entries[0].path).equal(`Proxy<${component.GetId()}>.quantity`);
        expect(entries[1].componentId).equal(component.GetId());
        expect(entries[1].path).equal(`Proxy<${component.GetId()}>.bio.name`);
    });

    it('should be able to suspned and resume access tracking ong get operations', () => {
        const global = CreateGlobal(), component = global.CreateComponent(document.createElement('div')), root = component.GetRootProxy();

        global.GetConfig().SetReactiveState('optimized');
        
        root.GetNative()['state'] = true;
        root.GetNative()['quantity'] = 72;
        root.GetNative()['list'] = [1, 2, 3, 4, 5];
        root.GetNative()['bio'] = {
            name: 'Clark Kent',
            alt: 'Superman',
            age: 36,
            isAlien: true,
        };

        const storage = new ProxyAccessStorage;

        global.UseProxyAccessStorage(() => {
            root.GetNative()['state'];
        }, storage);
        
        root.GetNative()['state'];

        let entries = storage.GetEntries();

        expect(entries.length).equal(1);
        expect(entries[0].componentId).equal(component.GetId());
        expect(entries[0].path).equal(`Proxy<${component.GetId()}>.state`);

        storage.Clear();

        global.UseProxyAccessStorage(() => {
            root.GetNative()['quantity'];
            root.GetNative()['bio']['name'];

            global.SuspendProxyAccessStorage(() => {
                root.GetNative()['bio']['alt'];
            });

            root.GetNative()['bio']['age'];
        }, storage);

        entries = storage.GetEntries();

        expect(entries.length).equal(3);
        expect(entries[0].componentId).equal(component.GetId());
        expect(entries[0].path).equal(`Proxy<${component.GetId()}>.quantity`);
        expect(entries[1].componentId).equal(component.GetId());
        expect(entries[1].path).equal(`Proxy<${component.GetId()}>.bio.name`);
        expect(entries[2].componentId).equal(component.GetId());
        expect(entries[2].path).equal(`Proxy<${component.GetId()}>.bio.age`);
    });

    it('should report changes', () => {
        const global = CreateGlobal(), component = global.CreateComponent(document.createElement('div')), root = component.GetRootProxy();
        const proxyName = `Proxy<${component.GetId()}>`;

        root.GetNative()['state'] = true;
        expect(IsEqual(component.GetBackend().changes.GetLastChange(), <IChange>{
            type: 'set',
            componentId: component.GetId(),
            path: `${proxyName}.state`,
            prop: 'state',
            origin: null,
        })).equal(true);
        
        root.GetNative()['quantity'] = 72;
        expect(IsEqual(component.GetBackend().changes.GetLastChange(), <IChange>{
            type: 'set',
            componentId: component.GetId(),
            path: `${proxyName}.quantity`,
            prop: 'quantity',
            origin: null,
        })).equal(true);

        root.GetNative()['bio'] = {
            name: 'Clark Kent',
            alt: 'Superman',
            age: 36,
            isAlien: true,
        };
        
        expect(IsEqual(component.GetBackend().changes.GetLastChange(), <IChange>{
            type: 'set',
            componentId: component.GetId(),
            path: `${proxyName}.bio`,
            prop: 'bio',
            origin: null,
        })).equal(true);

        root.GetNative()['bio']['age'] = 32;
        expect(IsEqual(component.GetBackend().changes.GetLastChange(), <IBubbledChange>{
            original: {
                type: 'set',
                componentId: component.GetId(),
                path: `${proxyName}.bio.age`,
                prop: 'age',
                origin: null,
            },
            path: `${proxyName}.bio`,
        })).equal(true);

        expect(IsEqual(component.GetBackend().changes.GetLastChange(1), <IChange>{
            type: 'set',
            componentId: component.GetId(),
            path: `${proxyName}.bio.age`,
            prop: 'age',
            origin: null,
        })).equal(true);

        delete root.GetNative()['bio']['age'];
        expect(IsEqual(component.GetBackend().changes.GetLastChange(1), <IChange>{
            type: 'delete',
            componentId: component.GetId(),
            path: `${proxyName}.bio.age`,
            prop: 'age',
            origin: null,
        })).equal(true);
    });
});
