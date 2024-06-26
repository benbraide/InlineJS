"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const create_1 = require("../global/create");
const create_child_1 = require("../proxy/create-child");
const is_equal_1 = require("../utilities/is-equal");
const is_object_1 = require("../utilities/is-object");
const proxy_keys_1 = require("../utilities/proxy-keys");
(0, mocha_1.describe)('proxy', () => {
    (0, mocha_1.it)('should be able to be created as root or child', () => {
        const global = (0, create_1.CreateGlobal)(), component = global.CreateComponent(document.createElement('div'));
        const root = component.GetRootProxy(), child = (0, create_child_1.CreateChildProxy)(root, 'one', {}), proxyName = `Proxy<${component.GetId()}>`;
        (0, chai_1.expect)(root.IsRoot()).equal(true);
        (0, chai_1.expect)(child.IsRoot()).equal(false);
        (0, chai_1.expect)(root.GetName()).equal(proxyName);
        (0, chai_1.expect)(root.GetPath()).equal(proxyName);
        (0, chai_1.expect)(root.GetParentPath()).equal('');
        (0, chai_1.expect)(child.GetName()).equal('one');
        (0, chai_1.expect)(child.GetPath()).equal(`${proxyName}.one`);
        (0, chai_1.expect)(child.GetParentPath()).equal(root.GetPath());
    });
    (0, mocha_1.it)('should respond to queries', () => {
        const global = (0, create_1.CreateGlobal)(), component = global.CreateComponent(document.createElement('div'));
        const root = component.GetRootProxy(), target = {}, child = (0, create_child_1.CreateChildProxy)(root, 'one', target), proxyName = `Proxy<${component.GetId()}>`;
        (0, chai_1.expect)(root.GetNative()[proxy_keys_1.ProxyKeys.componentId]).equal(component.GetId());
        (0, chai_1.expect)(root.GetNative()[proxy_keys_1.ProxyKeys.name]).equal(proxyName);
        (0, chai_1.expect)(root.GetNative()[proxy_keys_1.ProxyKeys.path]).equal(proxyName);
        (0, chai_1.expect)(root.GetNative()[proxy_keys_1.ProxyKeys.parentPath]).equal('');
        (0, chai_1.expect)((0, is_object_1.IsObject)(root.GetNative()[proxy_keys_1.ProxyKeys.target])).equal(true);
        (0, chai_1.expect)(child.GetNative()[proxy_keys_1.ProxyKeys.componentId]).equal(component.GetId());
        (0, chai_1.expect)(child.GetNative()[proxy_keys_1.ProxyKeys.name]).equal('one');
        (0, chai_1.expect)(child.GetNative()[proxy_keys_1.ProxyKeys.path]).equal(`${proxyName}.one`);
        (0, chai_1.expect)(child.GetNative()[proxy_keys_1.ProxyKeys.parentPath]).equal(root.GetPath());
        (0, chai_1.expect)(child.GetNative()[proxy_keys_1.ProxyKeys.target]).equal(target);
    });
    (0, mocha_1.it)('should set, retrieve, and delete values', () => {
        const global = (0, create_1.CreateGlobal)(), component = global.CreateComponent(document.createElement('div')), root = component.GetRootProxy();
        root.GetNative()['state'] = true;
        root.GetNative()['quantity'] = 72;
        root.GetNative()['list'] = [1, 2, 3, 4, 5];
        root.GetNative()['bio'] = {
            name: 'Clark Kent',
            alt: 'Superman',
            age: 36,
            isAlien: true,
        };
        (0, chai_1.expect)(root.GetNative()['state']).equal(true);
        (0, chai_1.expect)(root.GetNative()['quantity']).equal(72);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(root.GetNative()['list'], [1, 2, 3, 4, 5])).equal(true);
        (0, chai_1.expect)(root.GetNative()['bio']['name']).equal('Clark Kent');
        (0, chai_1.expect)(root.GetNative()['bio']['alt']).equal('Superman');
        (0, chai_1.expect)(root.GetNative()['bio']['age']).equal(36);
        (0, chai_1.expect)(root.GetNative()['bio']['isAlien']).equal(true);
        delete root.GetNative()['bio']['name'];
        (0, chai_1.expect)(root.GetNative()['bio']['name']).equal(null);
    });
    (0, mocha_1.it)('should alert accesses on get operations', () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const global = (0, create_1.CreateGlobal)(), component = global.CreateComponent(document.createElement('div')), root = component.GetRootProxy();
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
        component.GetBackend().changes.PushGetAccessStorage();
        root.GetNative()['state'];
        (0, chai_1.expect)(component.GetBackend().changes.GetLastAccessContext()).equal(`Proxy<${component.GetId()}>`);
        let storage = component.GetBackend().changes.PopGetAccessStorage();
        (0, chai_1.expect)((_a = storage.raw) === null || _a === void 0 ? void 0 : _a.entries.length).equal(1);
        (0, chai_1.expect)((_b = storage.raw) === null || _b === void 0 ? void 0 : _b.entries[0].compnentId).equal(component.GetId());
        (0, chai_1.expect)((_c = storage.raw) === null || _c === void 0 ? void 0 : _c.entries[0].path).equal(`Proxy<${component.GetId()}>.state`);
        (0, chai_1.expect)((_d = storage.optimized) === null || _d === void 0 ? void 0 : _d.entries.length).equal(1);
        (0, chai_1.expect)((_e = storage.optimized) === null || _e === void 0 ? void 0 : _e.entries[0].compnentId).equal(component.GetId());
        (0, chai_1.expect)((_f = storage.optimized) === null || _f === void 0 ? void 0 : _f.entries[0].path).equal(`Proxy<${component.GetId()}>.state`);
        component.GetBackend().changes.PushGetAccessStorage();
        root.GetNative()['quantity'];
        (0, chai_1.expect)(component.GetBackend().changes.GetLastAccessContext()).equal(`Proxy<${component.GetId()}>`);
        root.GetNative()['bio']['name'];
        (0, chai_1.expect)(component.GetBackend().changes.GetLastAccessContext()).equal(`Proxy<${component.GetId()}>.bio`);
        storage = component.GetBackend().changes.PopGetAccessStorage();
        (0, chai_1.expect)((_g = storage.raw) === null || _g === void 0 ? void 0 : _g.entries.length).equal(3);
        (0, chai_1.expect)((_h = storage.raw) === null || _h === void 0 ? void 0 : _h.entries[0].compnentId).equal(component.GetId());
        (0, chai_1.expect)((_j = storage.raw) === null || _j === void 0 ? void 0 : _j.entries[0].path).equal(`Proxy<${component.GetId()}>.quantity`);
        (0, chai_1.expect)((_k = storage.raw) === null || _k === void 0 ? void 0 : _k.entries[1].compnentId).equal(component.GetId());
        (0, chai_1.expect)((_l = storage.raw) === null || _l === void 0 ? void 0 : _l.entries[1].path).equal(`Proxy<${component.GetId()}>.bio`);
        (0, chai_1.expect)((_m = storage.raw) === null || _m === void 0 ? void 0 : _m.entries[2].compnentId).equal(component.GetId());
        (0, chai_1.expect)((_o = storage.raw) === null || _o === void 0 ? void 0 : _o.entries[2].path).equal(`Proxy<${component.GetId()}>.bio.name`);
        (0, chai_1.expect)((_p = storage.optimized) === null || _p === void 0 ? void 0 : _p.entries.length).equal(2);
        (0, chai_1.expect)((_q = storage.optimized) === null || _q === void 0 ? void 0 : _q.entries[0].compnentId).equal(component.GetId());
        (0, chai_1.expect)((_r = storage.optimized) === null || _r === void 0 ? void 0 : _r.entries[0].path).equal(`Proxy<${component.GetId()}>.quantity`);
        (0, chai_1.expect)((_s = storage.optimized) === null || _s === void 0 ? void 0 : _s.entries[1].compnentId).equal(component.GetId());
        (0, chai_1.expect)((_t = storage.optimized) === null || _t === void 0 ? void 0 : _t.entries[1].path).equal(`Proxy<${component.GetId()}>.bio.name`);
    });
    (0, mocha_1.it)('should report changes', () => {
        const global = (0, create_1.CreateGlobal)(), component = global.CreateComponent(document.createElement('div')), root = component.GetRootProxy();
        const proxyName = `Proxy<${component.GetId()}>`;
        root.GetNative()['state'] = true;
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(component.GetBackend().changes.GetLastChange(), {
            type: 'set',
            componentId: component.GetId(),
            path: `${proxyName}.state`,
            prop: 'state',
            origin: null,
        })).equal(true);
        root.GetNative()['quantity'] = 72;
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(component.GetBackend().changes.GetLastChange(), {
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
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(component.GetBackend().changes.GetLastChange(), {
            type: 'set',
            componentId: component.GetId(),
            path: `${proxyName}.bio`,
            prop: 'bio',
            origin: null,
        })).equal(true);
        root.GetNative()['bio']['age'] = 32;
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(component.GetBackend().changes.GetLastChange(), {
            original: {
                type: 'set',
                componentId: component.GetId(),
                path: `${proxyName}.bio.age`,
                prop: 'age',
                origin: null,
            },
            path: `${proxyName}.bio`,
        })).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(component.GetBackend().changes.GetLastChange(1), {
            type: 'set',
            componentId: component.GetId(),
            path: `${proxyName}.bio.age`,
            prop: 'age',
            origin: null,
        })).equal(true);
        delete root.GetNative()['bio']['age'];
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(component.GetBackend().changes.GetLastChange(), {
            type: 'delete',
            componentId: component.GetId(),
            path: `${proxyName}.bio`,
            prop: 'age',
            origin: null,
        })).equal(true);
    });
});
