import { expect } from 'chai'
import { describe, it } from 'mocha'
import { GetGlobal } from '../global/get';

import { IUniqueMarkers } from '../types/unique-markers';
import { BeginsWith } from '../utilities/begins-with';
import { DeepCopy } from '../utilities/deep-copy';
import { EndsWith } from '../utilities/ends-with';
import { IsEqual } from '../utilities/is-equal';
import { AreObjects, IsObject } from '../utilities/is-object';
import { JoinPath, PathToRelative, SplitPath, TidyPath } from '../utilities/path';
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
        const array1 = [0, 2, 3, 4], copy1 = DeepCopy(array1);

        expect(array1 === copy1).equal(false);
        expect(IsEqual(array1, copy1)).equal(true);

        const array2 = [{
            one: 1,
            two: 'two',
            state: true,
            list: [9, 8, 1],
        }], copy2 = DeepCopy(array2);

        expect(array2 === copy2).equal(false);
        expect(IsEqual(array2, copy2)).equal(true);
    });

    it('should work with objects', () => {
        const obj1 = {
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
        const markers = GetDefaultUniqueMarkers();
        expect(GenerateUniqueId(markers) === '0_0_1').equal(true);
        expect(GenerateUniqueId(markers) === '0_0_2').equal(true);
        expect(GenerateUniqueId(markers) === '0_0_3').equal(true);
        expect(GenerateUniqueId(markers) === '0_0_3').equal(false);
    });

    it('should embed modifiers to generated IDs', () => {
        const markers = GetDefaultUniqueMarkers();
        expect(GenerateUniqueId(markers, 'comp.') === 'comp.0_0_1').equal(true);
        expect(GenerateUniqueId(markers, 'comp.', 'scope_') === 'comp.scope_0_0_2').equal(true);
        expect(GenerateUniqueId(markers, 'comp.', 'scope_', '_ms') === 'comp.scope_0_0_3_ms').equal(true);
    });
});

describe('path utility', () => {
    it('should tidy a path', () => {
        expect(TidyPath('//path/from//to??arg1=val1&arg2=val2&&arg3==val3', true)).equal('path/from/to?arg1=val1&arg2=val2&arg3=val3');
        expect(TidyPath('/path?arg1=val1?arg2=val2', true)).equal('path?arg1=val1&arg2=val2');
        expect(TidyPath('/path?arg1=val1?&arg2=val2&?arg3=val3', true)).equal('path?arg1=val1&arg2=val2&arg3=val3');
        expect(TidyPath('https:/path?', true)).equal('https://path');
    });

    it('should transform an absolute path to a tidied relative path and prepend prefix if available', () => {
        expect(PathToRelative('https://localhost:300/path', 'https://localhost:300', undefined, true)).equal('/path');
        expect(PathToRelative('https://localhost:300/path?arg1=val1?&arg2=val2&', 'https://localhost:300', undefined, true)).equal('/path?arg1=val1&arg2=val2');
        expect(PathToRelative('https://localhost:300/path', 'https://localhost:300', 'ajax', true)).equal('/ajax/path');
        expect(PathToRelative('https://localhost:300/path', 'https://localhost:300', '/ajax', true)).equal('/ajax/path');
    });

    it('should split a path', () => {
        expect(JSON.stringify(SplitPath('/path?arg1=val1&arg2=val2'))).equal('{"base":"/path","query":"arg1=val1&arg2=val2"}');
        expect(JSON.stringify(SplitPath('https://localhost:300/path?arg1=val1&arg2=val2'))).equal('{"base":"https://localhost:300/path","query":"arg1=val1&arg2=val2"}');
        expect(JSON.stringify(SplitPath('/path'))).equal('{"base":"/path","query":""}');
    });

    it('should split a path and transform absolute to relative', () => {
        expect(JSON.stringify(SplitPath('https://localhost:300/path?arg1=val1&arg2=val2', 'https://localhost:300'))).equal('{"base":"/path","query":"arg1=val1&arg2=val2"}');
    });

    it('should join a split path', () => {
        expect(JoinPath({base: '/path', query: 'arg1=val1&arg2=val2'})).equal('/path?arg1=val1&arg2=val2');
        expect(JoinPath({base: 'https://localhost:300/path', query: 'arg1=val1&arg2=val2'})).equal('https://localhost:300/path?arg1=val1&arg2=val2');
        expect(JoinPath({base: 'https://localhost:300/path', query: 'arg1=val1&arg2=val2'}, 'https://localhost:300')).equal('/path?arg1=val1&arg2=val2');
        expect(JoinPath({base: 'https://localhost:300/path', query: 'arg1=val1&arg2=val2'}, 'https://localhost:300', '', true)).equal('https://localhost:300/path?arg1=val1&arg2=val2');
        expect(JoinPath({base: '/path', query: ''})).equal('/path');
    });
});
