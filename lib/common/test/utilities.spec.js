"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const get_1 = require("../global/get");
const begins_with_1 = require("../utilities/begins-with");
const deep_copy_1 = require("../utilities/deep-copy");
const ends_with_1 = require("../utilities/ends-with");
const is_equal_1 = require("../utilities/is-equal");
const is_object_1 = require("../utilities/is-object");
const path_1 = require("../utilities/path");
const unique_markers_1 = require("../utilities/unique-markers");
(0, mocha_1.describe)('is-equal utility', () => {
    (0, mocha_1.it)('should compare primitive types', () => {
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(45, 45)).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(45, 99)).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(45, '45')).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)('45', 45)).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(true, true)).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(true, false)).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(false, false)).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(false, true)).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)('Lorem', 'Lorem')).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)('Lorem', 'Ipsum')).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)('Lorem', 'lorem')).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(null, null)).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(null, undefined)).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(undefined, undefined)).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(undefined, null)).equal(true);
    });
    (0, mocha_1.it)('should compare arrays', () => {
        (0, chai_1.expect)((0, is_equal_1.IsEqual)([], [])).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)([], {})).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)([0, 2, 4], [0, 2, 4])).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)([0, 2, 4], [0, 2])).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)([0, 2, 4], [4, 2, 0])).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)([{}], [{}])).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)([{ one: 1 }, { two: 2 }], [{ one: 1 }, { two: 2 }])).equal(true);
    });
    (0, mocha_1.it)('should compare objects', () => {
        (0, chai_1.expect)((0, is_equal_1.IsEqual)({}, {})).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)({ one: 1, two: 2, six: 6 }, { one: 1, two: 2, six: 6 })).equal(true);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)({ one: 1, two: 2, six: 6 }, { one: 1, two: 2 })).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)({ one: 1, two: 2, six: 6 }, { one: 6, two: 2, six: 1 })).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)({ one: 1, two: 2, six: 6 }, { six: 6, two: 2, one: 1 })).equal(true);
    });
});
(0, mocha_1.describe)('is-object|are-objects utility', () => {
    (0, mocha_1.it)('should work with single values', () => {
        (0, chai_1.expect)((0, is_object_1.IsObject)({})).equal(true);
        (0, chai_1.expect)((0, is_object_1.IsObject)([])).equal(false);
        (0, chai_1.expect)((0, is_object_1.IsObject)((0, get_1.GetGlobal)().CreateNothing())).equal(false);
        (0, chai_1.expect)((0, is_object_1.IsObject)('')).equal(false);
        (0, chai_1.expect)((0, is_object_1.IsObject)(45)).equal(false);
        (0, chai_1.expect)((0, is_object_1.IsObject)(true)).equal(false);
        (0, chai_1.expect)((0, is_object_1.IsObject)(null)).equal(false);
        (0, chai_1.expect)((0, is_object_1.IsObject)(undefined)).equal(false);
        (0, chai_1.expect)((0, is_object_1.IsObject)(() => { })).equal(false);
    });
    (0, mocha_1.it)('should work with lists', () => {
        (0, chai_1.expect)((0, is_object_1.AreObjects)([{}, {}])).equal(true);
        (0, chai_1.expect)((0, is_object_1.AreObjects)([{}, []])).equal(false);
        (0, chai_1.expect)((0, is_object_1.AreObjects)([[], []])).equal(false);
    });
});
(0, mocha_1.describe)('deep-copy utility', () => {
    (0, mocha_1.it)('should work with arrays', () => {
        const array1 = [0, 2, 3, 4], copy1 = (0, deep_copy_1.DeepCopy)(array1);
        (0, chai_1.expect)(array1 === copy1).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(array1, copy1)).equal(true);
        const array2 = [{
                one: 1,
                two: 'two',
                state: true,
                list: [9, 8, 1],
            }], copy2 = (0, deep_copy_1.DeepCopy)(array2);
        (0, chai_1.expect)(array2 === copy2).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(array2, copy2)).equal(true);
    });
    (0, mocha_1.it)('should work with objects', () => {
        const obj1 = {
            one: 1,
            two: 'two',
            state: true,
            list: [9, 8, 1],
        }, copy1 = (0, deep_copy_1.DeepCopy)(obj1);
        (0, chai_1.expect)(obj1 === copy1).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(obj1, copy1)).equal(true);
    });
});
(0, mocha_1.describe)('begins-with utility', () => {
    (0, mocha_1.it)('should be case sensitive by default', () => {
        (0, chai_1.expect)((0, begins_with_1.BeginsWith)('Case:').test('Case: Study that')).equal(true);
        (0, chai_1.expect)((0, begins_with_1.BeginsWith)('case:').test('Case: Study that')).equal(false);
    });
    (0, mocha_1.it)('should be case insensitive why specified', () => {
        (0, chai_1.expect)((0, begins_with_1.BeginsWith)('Case:', true).test('Case: Study that')).equal(true);
        (0, chai_1.expect)((0, begins_with_1.BeginsWith)('case:', true).test('Case: Study that')).equal(true);
    });
});
(0, mocha_1.describe)('ends-with utility', () => {
    (0, mocha_1.it)('should be case sensitive by default', () => {
        (0, chai_1.expect)((0, ends_with_1.EndsWith)('That').test('Case: Study that')).equal(false);
        (0, chai_1.expect)((0, ends_with_1.EndsWith)('that').test('Case: Study that')).equal(true);
    });
    (0, mocha_1.it)('should be case insensitive why specified', () => {
        (0, chai_1.expect)((0, ends_with_1.EndsWith)('That', true).test('Case: Study that')).equal(true);
        (0, chai_1.expect)((0, ends_with_1.EndsWith)('that', true).test('Case: Study that')).equal(true);
    });
});
(0, mocha_1.describe)('unique-markers utility', () => {
    (0, mocha_1.it)('should generate default values', () => {
        (0, chai_1.expect)((0, is_equal_1.IsEqual)((0, unique_markers_1.GetDefaultUniqueMarkers)(), { level0: 0, level1: 0, level2: 0 })).equal(true);
    });
    (0, mocha_1.it)('should generate IDs', () => {
        const markers = (0, unique_markers_1.GetDefaultUniqueMarkers)();
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers) === '0_0_1').equal(true);
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers) === '0_0_2').equal(true);
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers) === '0_0_3').equal(true);
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers) === '0_0_3').equal(false);
    });
    (0, mocha_1.it)('should embed modifiers to generated IDs', () => {
        const markers = (0, unique_markers_1.GetDefaultUniqueMarkers)();
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers, 'comp.') === 'comp.0_0_1').equal(true);
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers, 'comp.', 'scope_') === 'comp.scope_0_0_2').equal(true);
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers, 'comp.', 'scope_', '_ms') === 'comp.scope_0_0_3_ms').equal(true);
    });
});
(0, mocha_1.describe)('path utility', () => {
    (0, mocha_1.it)('should tidy a path', () => {
        (0, chai_1.expect)((0, path_1.TidyPath)('//path/from//to??arg1=val1&arg2=val2&&arg3==val3', true)).equal('path/from/to?arg1=val1&arg2=val2&arg3=val3');
        (0, chai_1.expect)((0, path_1.TidyPath)('/path?arg1=val1?arg2=val2', true)).equal('path?arg1=val1&arg2=val2');
        (0, chai_1.expect)((0, path_1.TidyPath)('/path?arg1=val1?&arg2=val2&?arg3=val3', true)).equal('path?arg1=val1&arg2=val2&arg3=val3');
        (0, chai_1.expect)((0, path_1.TidyPath)('https:/path?', true)).equal('https://path');
    });
    (0, mocha_1.it)('should transform an absolute path to a tidied relative path and prepend prefix if available', () => {
        (0, chai_1.expect)((0, path_1.PathToRelative)('https://localhost:300/path', 'https://localhost:300', undefined, true)).equal('/path');
        (0, chai_1.expect)((0, path_1.PathToRelative)('https://localhost:300/path?arg1=val1?&arg2=val2&', 'https://localhost:300', undefined, true)).equal('/path?arg1=val1&arg2=val2');
        (0, chai_1.expect)((0, path_1.PathToRelative)('https://localhost:300/path', 'https://localhost:300', 'ajax', true)).equal('/ajax/path');
        (0, chai_1.expect)((0, path_1.PathToRelative)('https://localhost:300/path', 'https://localhost:300', '/ajax', true)).equal('/ajax/path');
    });
    (0, mocha_1.it)('should split a path', () => {
        (0, chai_1.expect)(JSON.stringify((0, path_1.SplitPath)('/path?arg1=val1&arg2=val2'))).equal('{"base":"/path","query":"arg1=val1&arg2=val2"}');
        (0, chai_1.expect)(JSON.stringify((0, path_1.SplitPath)('https://localhost:300/path?arg1=val1&arg2=val2'))).equal('{"base":"https://localhost:300/path","query":"arg1=val1&arg2=val2"}');
        (0, chai_1.expect)(JSON.stringify((0, path_1.SplitPath)('/path'))).equal('{"base":"/path","query":""}');
    });
    (0, mocha_1.it)('should split a path and transform absolute to relative', () => {
        (0, chai_1.expect)(JSON.stringify((0, path_1.SplitPath)('https://localhost:300/path?arg1=val1&arg2=val2', 'https://localhost:300'))).equal('{"base":"/path","query":"arg1=val1&arg2=val2"}');
    });
    (0, mocha_1.it)('should join a split path', () => {
        (0, chai_1.expect)((0, path_1.JoinPath)({ base: '/path', query: 'arg1=val1&arg2=val2' })).equal('/path?arg1=val1&arg2=val2');
        (0, chai_1.expect)((0, path_1.JoinPath)({ base: 'https://localhost:300/path', query: 'arg1=val1&arg2=val2' })).equal('https://localhost:300/path?arg1=val1&arg2=val2');
        (0, chai_1.expect)((0, path_1.JoinPath)({ base: 'https://localhost:300/path', query: 'arg1=val1&arg2=val2' }, 'https://localhost:300')).equal('/path?arg1=val1&arg2=val2');
        (0, chai_1.expect)((0, path_1.JoinPath)({ base: 'https://localhost:300/path', query: 'arg1=val1&arg2=val2' }, 'https://localhost:300', '', true)).equal('https://localhost:300/path?arg1=val1&arg2=val2');
        (0, chai_1.expect)((0, path_1.JoinPath)({ base: '/path', query: '' })).equal('/path');
    });
});
