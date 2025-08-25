"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const changes_1 = require("../component/changes");
const get_1 = require("../global/get");
const create_1 = require("../global/create");
const add_changes_1 = require("../proxy/add-changes");
// Mocking dependencies
class MockComponent {
    constructor(id_) {
        this.id_ = id_;
    }
    GetId() { return this.id_; }
    GenerateUniqueId(prefix = '') { return `${prefix}${Math.random()}`; }
    GetBackend() { return { changes: null }; }
}
(0, mocha_1.describe)('Changes class', () => {
    let componentId;
    let changes;
    (0, mocha_1.beforeEach)(() => {
        // Create a global context if it doesn't exist
        if (!(0, get_1.GetGlobal)()) {
            (0, create_1.CreateGlobal)();
        }
        componentId = 'test-component';
        const mockComponent = new MockComponent(componentId);
        // Mock FindComponentById to return our mock component
        const global = (0, get_1.GetGlobal)();
        const originalFind = global.FindComponentById;
        global.FindComponentById = (id) => (id === componentId ? mockComponent : originalFind(id));
        changes = new changes_1.Changes(componentId);
    });
    (0, mocha_1.it)('should subscribe to a path and receive changes', (done) => {
        const path = 'user.name';
        const change = { componentId, type: 'set', path, prop: 'name', origin: null };
        changes.Subscribe(path, (receivedChanges) => {
            (0, chai_1.expect)(receivedChanges).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(receivedChanges[0]).to.deep.equal(change);
            done();
        });
        changes.Add(change);
    });
    (0, mocha_1.it)('should not notify the origin of a change', (done) => {
        const path = 'user.name';
        let wasCalled = false;
        const originCallback = (receivedChanges) => {
            wasCalled = true;
        };
        const change = { componentId, type: 'set', path, prop: 'name', origin: originCallback };
        changes.Subscribe(path, originCallback);
        changes.Add(change);
        // Use setTimeout to check after the microtask queue has been processed
        setTimeout(() => {
            (0, chai_1.expect)(wasCalled).to.be.false;
            done();
        }, 0);
    });
    (0, mocha_1.it)('should batch multiple changes for the same subscriber', (done) => {
        const path = 'user.name';
        const change1 = { componentId, type: 'set', path, prop: 'name', origin: null };
        const change2 = { componentId, type: 'set', path, prop: 'name', origin: null };
        let callCount = 0;
        changes.Subscribe(path, (receivedChanges) => {
            callCount++;
            (0, chai_1.expect)(receivedChanges).to.be.an('array').with.lengthOf(2);
            (0, chai_1.expect)(receivedChanges[0]).to.deep.equal(change1);
            (0, chai_1.expect)(receivedChanges[1]).to.deep.equal(change2);
        });
        changes.Add(change1);
        changes.Add(change2);
        setTimeout(() => {
            (0, chai_1.expect)(callCount).to.equal(1);
            done();
        }, 0);
    });
    (0, mocha_1.it)('should unsubscribe by ID', (done) => {
        const path = 'user.name';
        let wasCalled = false;
        const callback = () => { wasCalled = true; };
        const subscriptionId = changes.Subscribe(path, callback);
        changes.Unsubscribe(subscriptionId);
        const change = { componentId, type: 'set', path, prop: 'name', origin: null };
        changes.Add(change);
        setTimeout(() => {
            (0, chai_1.expect)(wasCalled).to.be.false;
            done();
        }, 0);
    });
    (0, mocha_1.it)('should unsubscribe by callback reference', (done) => {
        const path = 'user.name';
        let wasCalled = false;
        const callback = () => { wasCalled = true; };
        changes.Subscribe(path, callback);
        changes.Unsubscribe(callback);
        const change = { componentId, type: 'set', path, prop: 'name', origin: null };
        changes.Add(change);
        setTimeout(() => {
            (0, chai_1.expect)(wasCalled).to.be.false;
            done();
        }, 0);
    });
    (0, mocha_1.it)('should handle nextTick handlers', (done) => {
        let tickCalled = false;
        const path = 'user.name';
        const change = { componentId, type: 'set', path, prop: 'name', origin: null };
        changes.Subscribe(path, (receivedChanges) => {
            (0, chai_1.expect)(tickCalled).to.be.false;
        });
        changes.AddNextTickHandler(() => {
            tickCalled = true;
            done();
        });
        changes.Add(change);
    });
    (0, mocha_1.it)('should handle idle and non-idle handlers', (done) => {
        let nonIdleCalled = false;
        let idleCalled = false;
        changes.AddNextNonIdleHandler(() => {
            nonIdleCalled = true;
        });
        changes.AddNextIdleHandler(() => {
            idleCalled = true;
        });
        const path = 'user.name';
        const change = { componentId, type: 'set', path, prop: 'name', origin: null };
        changes.Add(change);
        setTimeout(() => {
            // expect(nonIdleCalled).to.be.true;
            (0, chai_1.expect)(idleCalled).to.be.true;
            changes.AddNextIdleHandler(() => {
                idleCalled = true;
                done();
            });
        }, 0);
    });
    (0, mocha_1.it)('should notify subscribers of parent paths when a child path changes (bubbling)', (done) => {
        const parentPath = 'data.user';
        const childPath = 'data.user.name';
        let parentSubscriberCalled = false;
        let childSubscriberCalled = false;
        changes.Subscribe(parentPath, (receivedChanges) => {
            parentSubscriberCalled = true;
            (0, chai_1.expect)(receivedChanges).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(receivedChanges[0]).to.have.property('original');
            (0, chai_1.expect)(receivedChanges[0].path).to.equal(parentPath);
            (0, chai_1.expect)('original' in receivedChanges[0] && receivedChanges[0].original.path).to.equal(childPath);
        });
        changes.Subscribe(childPath, () => {
            childSubscriberCalled = true;
        });
        (0, add_changes_1.AddChanges)('set', childPath, 'name', changes);
        setTimeout(() => {
            (0, chai_1.expect)(parentSubscriberCalled, 'Parent subscriber should be called').to.be.true;
            (0, chai_1.expect)(childSubscriberCalled, 'Child subscriber should be called').to.be.true;
            done();
        }, 0);
    });
});
