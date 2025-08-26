"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsiderRange = exports.UseRange = void 0;
const get_1 = require("../global/get");
const try_1 = require("../journal/try");
const is_equal_1 = require("./is-equal");
const loop_1 = require("./loop");
function UseRange(range, callback, duration = 3000, delay = 1000, checkIntegers = true) {
    const applyValue = (value) => {
        if (!checkIntegers) {
            return (0, try_1.JournalTry)(() => callback(value));
        }
        const from = range.GetFrom(), to = range.GetTo();
        if (typeof from !== "number" || typeof to !== "number") {
            return (0, try_1.JournalTry)(() => callback(value));
        }
        return (0, try_1.JournalTry)(() => callback(Number.isInteger(from) && Number.isInteger(to) ? Math.floor(value) : value));
    };
    const doLastStep = () => {
        const lastStep = range.Step(1);
        lastStep !== null && applyValue(lastStep);
    };
    if ((0, get_1.GetGlobal)().IsTimedRange(range)) {
        duration = range.GetDuration() || duration;
        delay = range.GetDelay() || delay;
    }
    if (duration <= 0) { // Duration is invalid
        doLastStep();
        return;
    }
    const firstStep = range.Step(0);
    if (firstStep === null) {
        doLastStep();
        return;
    }
    let previousStep = firstStep;
    if (applyValue(previousStep) === false)
        return;
    (0, loop_1.CreateAnimationLoop)(duration, delay).While(({ elapsed, abort }) => {
        const step = range.Step(elapsed / duration);
        if (step === null) {
            abort === null || abort === void 0 ? void 0 : abort();
        }
        else if (!(0, is_equal_1.IsEqual)(step, previousStep)) {
            previousStep = step;
            applyValue(step) === false && (abort === null || abort === void 0 ? void 0 : abort());
        }
    }).Final(doLastStep);
}
exports.UseRange = UseRange;
function ConsiderRange(value, callback, duration = 3000, delay = 1000, checkIntegers = true) {
    if ((0, get_1.GetGlobal)().IsRange(value)) {
        UseRange(value, callback, duration, delay, checkIntegers);
    }
    else {
        (0, try_1.JournalTry)(() => callback(value));
    }
}
exports.ConsiderRange = ConsiderRange;
