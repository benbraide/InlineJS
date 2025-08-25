"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseRange = void 0;
const get_1 = require("../global/get");
const try_1 = require("../journal/try");
const is_equal_1 = require("./is-equal");
const loop_1 = require("./loop");
function UseRange(range, callback, duration = 3000, delay = 1000) {
    const doLastStep = () => {
        const lastStep = range.Step(1);
        lastStep !== null && (0, try_1.JournalTry)(() => callback(lastStep));
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
    if ((0, try_1.JournalTry)(() => callback(previousStep)) === false)
        return;
    (0, loop_1.CreateAnimationLoop)(duration, delay).While(({ elapsed, abort }) => {
        const step = range.Step(elapsed / duration);
        if (step === null) {
            abort === null || abort === void 0 ? void 0 : abort();
        }
        else if (!(0, is_equal_1.IsEqual)(step, previousStep)) {
            previousStep = step;
            (0, try_1.JournalTry)(() => callback(step)) === false && (abort === null || abort === void 0 ? void 0 : abort());
        }
    }).Final(doLastStep);
}
exports.UseRange = UseRange;
