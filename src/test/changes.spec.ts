import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { Changes } from '../component/changes';
import { IChange } from '../types/change';
import { GetGlobal } from '../global/get';
import { CreateGlobal } from '../global/create';
import { IComponent } from '../types/component';
import { AddChanges } from '../proxy/add-changes';

// Mocking dependencies
class MockComponent {
    constructor(private id_: string) {}
    GetId() { return this.id_; }
    GenerateUniqueId(prefix = '') { return `${prefix}${Math.random()}`; }
    GetBackend() { return { changes: null as any }; }
}

describe('Changes class', () => {
    let componentId: string;
    let changes: Changes;

    beforeEach(() => {
        // Create a global context if it doesn't exist
        if (!GetGlobal()) {
            CreateGlobal();
        }

        componentId = 'test-component';
        const mockComponent = new MockComponent(componentId);
        
        // Mock FindComponentById to return our mock component
        const global = GetGlobal();
        const originalFind = global.FindComponentById;
        global.FindComponentById = (id: string) => (id === componentId ? mockComponent as unknown as IComponent : originalFind(id));

        changes = new Changes(componentId);
    });

    it('should subscribe to a path and receive changes', (done) => {
        const path = 'user.name';
        const change: IChange = { componentId, type: 'set', path, prop: 'name', origin: null };

        changes.Subscribe(path, (receivedChanges) => {
            expect(receivedChanges).to.be.an('array').with.lengthOf(1);
            expect(receivedChanges![0]).to.deep.equal(change);
            done();
        });

        changes.Add(change);
    });

    it('should not notify the origin of a change', (done) => {
        const path = 'user.name';
        let wasCalled = false;

        const originCallback = (receivedChanges?: any) => {
            wasCalled = true;
        };

        const change: IChange = { componentId, type: 'set', path, prop: 'name', origin: originCallback };

        changes.Subscribe(path, originCallback);
        changes.Add(change);

        // Use setTimeout to check after the microtask queue has been processed
        setTimeout(() => {
            expect(wasCalled).to.be.false;
            done();
        }, 0);
    });

    it('should batch multiple changes for the same subscriber', (done) => {
        const path = 'user.name';
        const change1: IChange = { componentId, type: 'set', path, prop: 'name', origin: null };
        const change2: IChange = { componentId, type: 'set', path, prop: 'name', origin: null };

        let callCount = 0;
        changes.Subscribe(path, (receivedChanges) => {
            callCount++;
            expect(receivedChanges).to.be.an('array').with.lengthOf(2);
            expect(receivedChanges![0]).to.deep.equal(change1);
            expect(receivedChanges![1]).to.deep.equal(change2);
        });

        changes.Add(change1);
        changes.Add(change2);

        setTimeout(() => {
            expect(callCount).to.equal(1);
            done();
        }, 0);
    });

    it('should unsubscribe by ID', (done) => {
        const path = 'user.name';
        let wasCalled = false;
        
        const callback = () => { wasCalled = true; };
        const subscriptionId = changes.Subscribe(path, callback);
        
        changes.Unsubscribe(subscriptionId);
        
        const change: IChange = { componentId, type: 'set', path, prop: 'name', origin: null };
        changes.Add(change);

        setTimeout(() => {
            expect(wasCalled).to.be.false;
            done();
        }, 0);
    });

    it('should unsubscribe by callback reference', (done) => {
        const path = 'user.name';
        let wasCalled = false;
        
        const callback = () => { wasCalled = true; };
        changes.Subscribe(path, callback);
        
        changes.Unsubscribe(callback);
        
        const change: IChange = { componentId, type: 'set', path, prop: 'name', origin: null };
        changes.Add(change);

        setTimeout(() => {
            expect(wasCalled).to.be.false;
            done();
        }, 0);
    });

    it('should handle nextTick handlers', (done) => {
        let tickCalled = false;
        const path = 'user.name';
        const change: IChange = { componentId, type: 'set', path, prop: 'name', origin: null };

        changes.Subscribe(path, (receivedChanges) => {
            expect(tickCalled).to.be.false;
        });

        changes.AddNextTickHandler(() => {
            tickCalled = true;
            done();
        });

        changes.Add(change);
    });

    it('should handle idle and non-idle handlers', (done) => {
        let nonIdleCalled = false;
        let idleCalled = false;

        changes.AddNextNonIdleHandler(() => {
            nonIdleCalled = true;
        });

        changes.AddNextIdleHandler(() => {
            idleCalled = true;
        });

        const path = 'user.name';
        const change: IChange = { componentId, type: 'set', path, prop: 'name', origin: null };
        changes.Add(change);

        setTimeout(() => {
            // expect(nonIdleCalled).to.be.true;
            expect(idleCalled).to.be.true;

            changes.AddNextIdleHandler(() => {
                idleCalled = true;
                done();
            });
        }, 0);
    });

    it('should notify subscribers of parent paths when a child path changes (bubbling)', (done) => {
        const parentPath = 'data.user';
        const childPath = 'data.user.name';

        let parentSubscriberCalled = false;
        let childSubscriberCalled = false;

        changes.Subscribe(parentPath, (receivedChanges) => {
            parentSubscriberCalled = true;
            expect(receivedChanges).to.be.an('array').with.lengthOf(1);
            expect(receivedChanges[0]).to.have.property('original');
            expect(receivedChanges[0].path).to.equal(parentPath);
            expect('original' in receivedChanges[0] && receivedChanges[0].original.path).to.equal(childPath);
        });

        changes.Subscribe(childPath, () => {
            childSubscriberCalled = true;
        });

        AddChanges('set', childPath, 'name', changes);

        setTimeout(() => {
            expect(parentSubscriberCalled, 'Parent subscriber should be called').to.be.true;
            expect(childSubscriberCalled, 'Child subscriber should be called').to.be.true;
            done();
        }, 0);
    });
});