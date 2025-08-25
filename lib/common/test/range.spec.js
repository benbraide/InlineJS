"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const range_1 = require("../values/range");
describe('Range class', () => {
    describe('GetFrom and GetTo methods', () => {
        it('should return the correct from and to values for numbers', () => {
            const range = new range_1.Range(10, 20);
            (0, chai_1.expect)(range.GetFrom()).to.equal(10);
            (0, chai_1.expect)(range.GetTo()).to.equal(20);
        });
        it('should return the correct from and to values for strings', () => {
            const range = new range_1.Range('a', 'abc');
            (0, chai_1.expect)(range.GetFrom()).to.equal('a');
            (0, chai_1.expect)(range.GetTo()).to.equal('abc');
        });
    });
    describe('IsAscending method', () => {
        it('should correctly determine ascending for numbers', () => {
            (0, chai_1.expect)(new range_1.Range(10, 20).IsAscending()).to.be.true;
            (0, chai_1.expect)(new range_1.Range(20, 10).IsAscending()).to.be.false;
            (0, chai_1.expect)(new range_1.Range(10, 10).IsAscending()).to.be.false;
        });
        it('should correctly determine ascending for strings based on length', () => {
            (0, chai_1.expect)(new range_1.Range('a', 'abc').IsAscending()).to.be.true;
            (0, chai_1.expect)(new range_1.Range('abc', 'a').IsAscending()).to.be.false;
            (0, chai_1.expect)(new range_1.Range('abc', 'def').IsAscending()).to.be.false;
        });
        it('should correctly determine ascending for arrays based on length', () => {
            (0, chai_1.expect)(new range_1.Range([1], [1, 2, 3]).IsAscending()).to.be.true;
            (0, chai_1.expect)(new range_1.Range([1, 2, 3], [1]).IsAscending()).to.be.false;
            (0, chai_1.expect)(new range_1.Range([1, 2], [3, 4]).IsAscending()).to.be.false;
        });
        it('should correctly determine ascending for objects based on key count', () => {
            (0, chai_1.expect)(new range_1.Range({ a: 1 }, { a: 1, b: 2 }).IsAscending()).to.be.true;
            (0, chai_1.expect)(new range_1.Range({ a: 1, b: 2 }, { a: 1 }).IsAscending()).to.be.false;
            (0, chai_1.expect)(new range_1.Range({ a: 1 }, { b: 2 }).IsAscending()).to.be.false;
        });
    });
    describe('Step method', () => {
        context('with number ranges', () => {
            it('should step correctly for an ascending range', () => {
                const range = new range_1.Range(100, 200);
                (0, chai_1.expect)(range.Step(0)).to.equal(100);
                (0, chai_1.expect)(range.Step(0.5)).to.equal(150);
                (0, chai_1.expect)(range.Step(1)).to.equal(200);
                (0, chai_1.expect)(range.Step(0.25)).to.equal(125);
            });
            it('should step correctly for a descending range', () => {
                const range = new range_1.Range(200, 100);
                (0, chai_1.expect)(range.Step(0)).to.equal(200);
                (0, chai_1.expect)(range.Step(0.5)).to.equal(150);
                (0, chai_1.expect)(range.Step(1)).to.equal(100);
                (0, chai_1.expect)(range.Step(0.25)).to.equal(175);
            });
            it('should apply offset correctly for number ranges', () => {
                const range = new range_1.Range(100, 200);
                (0, chai_1.expect)(range.Step(0.5, 10)).to.equal(160);
            });
        });
        context('with string ranges', () => {
            it('should step correctly for an ascending range', () => {
                const range = new range_1.Range('a', 'abcde'); // diff = 4
                (0, chai_1.expect)(range.Step(0)).to.equal('a');
                (0, chai_1.expect)(range.Step(0.25)).to.equal('ab');
                (0, chai_1.expect)(range.Step(0.5)).to.equal('abc');
                (0, chai_1.expect)(range.Step(1)).to.equal('abcde');
            });
            it('should step correctly for a descending range', () => {
                const range = new range_1.Range('abcde', 'a'); // diff = 4
                (0, chai_1.expect)(range.Step(0)).to.equal('abcde');
                (0, chai_1.expect)(range.Step(0.5)).to.equal('abc');
                (0, chai_1.expect)(range.Step(1)).to.equal('a');
            });
            it('should apply offset correctly for string ranges', () => {
                const range = new range_1.Range('a', 'abcde');
                (0, chai_1.expect)(range.Step(0.5, 1)).to.equal('acd');
            });
        });
        context('with array ranges', () => {
            const from = [10];
            const to = [10, 20, 30, 40, 50];
            it('should step correctly for an ascending range', () => {
                const range = new range_1.Range(from, to);
                (0, chai_1.expect)(range.Step(0)).to.deep.equal([10]);
                (0, chai_1.expect)(range.Step(0.5)).to.deep.equal([10, 20, 30]);
                (0, chai_1.expect)(range.Step(1)).to.deep.equal(to);
            });
            it('should step correctly for a descending range', () => {
                const range = new range_1.Range(to, from);
                (0, chai_1.expect)(range.Step(0)).to.deep.equal(to);
                (0, chai_1.expect)(range.Step(0.5)).to.deep.equal([10, 20, 30]);
                (0, chai_1.expect)(range.Step(1)).to.deep.equal(from);
            });
            it('should apply offset correctly for array ranges', () => {
                const range = new range_1.Range(from, to);
                (0, chai_1.expect)(range.Step(0.5, 1)).to.deep.equal([10, 30, 40]);
            });
        });
        context('with object ranges', () => {
            const from = { a: 1 };
            const to = { a: 1, b: 2, c: 3, d: 4, e: 5 };
            it('should step correctly for an ascending range', () => {
                const range = new range_1.Range(from, to);
                (0, chai_1.expect)(range.Step(0)).to.deep.equal(from);
                (0, chai_1.expect)(range.Step(0.5)).to.deep.equal({ a: 1, b: 2, c: 3 });
                (0, chai_1.expect)(range.Step(1)).to.deep.equal(to);
            });
            it('should step correctly for a descending range', () => {
                const range = new range_1.Range(to, from);
                (0, chai_1.expect)(range.Step(0)).to.deep.equal(to);
                (0, chai_1.expect)(range.Step(0.5)).to.deep.equal({ a: 1, b: 2, c: 3 });
                (0, chai_1.expect)(range.Step(1)).to.deep.equal(from);
            });
            it('should apply offset correctly for object ranges', () => {
                const range = new range_1.Range(from, to);
                (0, chai_1.expect)(range.Step(0.5, 1)).to.deep.equal({ a: 1, c: 3, d: 4 });
            });
        });
    });
});
