import { expect } from 'chai'
import { describe, it } from 'mocha'
import { GetGlobal } from '../global/get';

import { IUniqueMarkers } from '../types/unique-markers';
import { BeginsWith } from '../utilities/begins-with';
import { DeepCopy } from '../utilities/deep-copy';
import { EndsWith } from '../utilities/ends-with';
import { IsEqual } from '../utilities/is-equal';
import { AreObjects, IsObject } from '../utilities/is-object';
import { GenerateUniqueId, GetDefaultUniqueMarkers } from '../utilities/unique-markers';

describe('is-equal utility', () => {
    it('should compare primitive types', () => {
        expect(IsEqual(45, 45)).equal(true);
        expect(IsEqual(45, 99)).equal(false);
        expect(IsEqual(45, '45')).equal(true);
        expect(IsEqual('45', 45)).equal(true);

        expect(IsEqual(true, true)).equal(true);
        expect(IsEqual(true, false)).equal(false);
        expect(IsEqual(false, false)).equal(true);
        expect(IsEqual(false, true)).equal(false);

        expect(IsEqual('Lorem', 'Lorem')).equal(true);
        expect(IsEqual('Lorem', 'Ipsum')).equal(false);
        expect(IsEqual('Lorem', 'lorem')).equal(false);

        expect(IsEqual(null, null)).equal(true);
        expect(IsEqual(null, undefined)).equal(true);
        expect(IsEqual(undefined, undefined)).equal(true);
        expect(IsEqual(undefined, null)).equal(true);
    });

    it('should compare arrays', () => {
        expect(IsEqual([], [])).equal(true);
        expect(IsEqual([], {})).equal(false);
        expect(IsEqual([0, 2, 4], [0, 2, 4])).equal(true);
        expect(IsEqual([0, 2, 4], [0, 2])).equal(false);
        expect(IsEqual([0, 2, 4], [4, 2, 0])).equal(false);
        expect(IsEqual([{}], [{}])).equal(true);
        expect(IsEqual([{ one: 1 }, { two: 2 }], [{ one: 1 }, { two: 2 }])).equal(true);
    });

    it('should compare objects', () => {
        expect(IsEqual({}, {})).equal(true);
        expect(IsEqual({ one: 1, two: 2, six: 6 }, { one: 1, two: 2, six: 6 })).equal(true);
        expect(IsEqual({ one: 1, two: 2, six: 6 }, { one: 1, two: 2 })).equal(false);
        expect(IsEqual({ one: 1, two: 2, six: 6 }, { one: 6, two: 2, six: 1 })).equal(false);
        expect(IsEqual({ one: 1, two: 2, six: 6 }, { six: 6, two: 2, one: 1 })).equal(true);
    });
});

describe('is-object|are-objects utility', () => {
    it('should work with single values', () => {
        expect(IsObject({})).equal(true);
        expect(IsObject([])).equal(false);

        expect(IsObject(GetGlobal().CreateNothing())).equal(false);
        expect(IsObject('')).equal(false);

        expect(IsObject(45)).equal(false);
        expect(IsObject(true)).equal(false);

        expect(IsObject(null)).equal(false);
        expect(IsObject(undefined)).equal(false);

        expect(IsObject(() => {})).equal(false);
    });

    it('should work with lists', () => {
        expect(AreObjects([{}, {}])).equal(true);
        expect(AreObjects([{}, []])).equal(false);
        expect(AreObjects([[], []])).equal(false);
    });
});

describe('deep-copy utility', () => {
    it('should work with arrays', () => {
        let array1 = [0, 2, 3, 4], copy1 = DeepCopy(array1);

        expect(array1 === copy1).equal(false);
        expect(IsEqual(array1, copy1)).equal(true);

        let array2 = [{
            one: 1,
            two: 'two',
            state: true,
            list: [9, 8, 1],
        }], copy2 = DeepCopy(array2);

        expect(array2 === copy2).equal(false);
        expect(IsEqual(array2, copy2)).equal(true);
    });

    it('should work with objects', () => {
        let obj1 = {
            one: 1,
            two: 'two',
            state: true,
            list: [9, 8, 1],
        }, copy1 = DeepCopy(obj1);

        expect(obj1 === copy1).equal(false);
        expect(IsEqual(obj1, copy1)).equal(true);
    });
});

describe('begins-with utility', () => {
    it('should be case sensitive by default', () => {
        expect(BeginsWith('Case:').test('Case: Study that')).equal(true);
        expect(BeginsWith('case:').test('Case: Study that')).equal(false);
    });

    it('should be case insensitive why specified', () => {
        expect(BeginsWith('Case:', true).test('Case: Study that')).equal(true);
        expect(BeginsWith('case:', true).test('Case: Study that')).equal(true);
    });
});

describe('ends-with utility', () => {
    it('should be case sensitive by default', () => {
        expect(EndsWith('That').test('Case: Study that')).equal(false);
        expect(EndsWith('that').test('Case: Study that')).equal(true);
    });

    it('should be case insensitive why specified', () => {
        expect(EndsWith('That', true).test('Case: Study that')).equal(true);
        expect(EndsWith('that', true).test('Case: Study that')).equal(true);
    });
});

describe('unique-markers utility', () => {
    it('should generate default values', () => {
        expect(IsEqual(GetDefaultUniqueMarkers(), <IUniqueMarkers>{ level0: 0, level1: 0, level2: 0 })).equal(true);
    });

    it('should generate IDs', () => {
        let markers = GetDefaultUniqueMarkers();
        expect(GenerateUniqueId(markers) === '0_0_1').equal(true);
        expect(GenerateUniqueId(markers) === '0_0_2').equal(true);
        expect(GenerateUniqueId(markers) === '0_0_3').equal(true);
        expect(GenerateUniqueId(markers) === '0_0_3').equal(false);
    });

    it('should embed modifiers to generated IDs', () => {
        let markers = GetDefaultUniqueMarkers();
        expect(GenerateUniqueId(markers, 'comp.') === 'comp.0_0_1').equal(true);
        expect(GenerateUniqueId(markers, 'comp.', 'scope_') === 'comp.scope_0_0_2').equal(true);
        expect(GenerateUniqueId(markers, 'comp.', 'scope_', '_ms') === 'comp.scope_0_0_3_ms').equal(true);
    });
});
