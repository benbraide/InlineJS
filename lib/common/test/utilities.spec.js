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
        let array1 = [0, 2, 3, 4], copy1 = (0, deep_copy_1.DeepCopy)(array1);
        (0, chai_1.expect)(array1 === copy1).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(array1, copy1)).equal(true);
        let array2 = [{
                one: 1,
                two: 'two',
                state: true,
                list: [9, 8, 1],
            }], copy2 = (0, deep_copy_1.DeepCopy)(array2);
        (0, chai_1.expect)(array2 === copy2).equal(false);
        (0, chai_1.expect)((0, is_equal_1.IsEqual)(array2, copy2)).equal(true);
    });
    (0, mocha_1.it)('should work with objects', () => {
        let obj1 = {
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
        let markers = (0, unique_markers_1.GetDefaultUniqueMarkers)();
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers) === '0_0_1').equal(true);
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers) === '0_0_2').equal(true);
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers) === '0_0_3').equal(true);
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers) === '0_0_3').equal(false);
    });
    (0, mocha_1.it)('should embed modifiers to generated IDs', () => {
        let markers = (0, unique_markers_1.GetDefaultUniqueMarkers)();
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers, 'comp.') === 'comp.0_0_1').equal(true);
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers, 'comp.', 'scope_') === 'comp.scope_0_0_2').equal(true);
        (0, chai_1.expect)((0, unique_markers_1.GenerateUniqueId)(markers, 'comp.', 'scope_', '_ms') === 'comp.scope_0_0_3_ms').equal(true);
    });
});
