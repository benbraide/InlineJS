"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwalAlert = void 0;
const sweetalert2_1 = require("sweetalert2");
const is_object_1 = require("../utilities/is-object");
class SwalAlert {
    Notify(options) {
        if ((0, is_object_1.IsObject)(options)) {
            options['icon'] = (options['icon'] || (options['error'] ? 'error' : (options['type'] || options['code'] || 'success')));
            options['text'] = (options['text'] || options['message']);
            options['toast'] = (!!options['toast'] || !!options['asToast']);
            options['position'] = (options['position'] || (options['toast'] ? 'top-end' : 'center'));
            options['timer'] = (options['timer'] || ((typeof options['duration'] === 'number') ? options['duration'] : ((options['duration'] === false) ? undefined : 5000)));
        }
        return sweetalert2_1.default.fire(options);
    }
    Confirm(options) {
        if ((0, is_object_1.IsObject)(options)) {
            options['icon'] = (options['icon'] || 'warning');
            options['title'] = (options['title'] || 'Please confirm your action');
            options['text'] = (options['text'] || options['message']);
            options['confirmButtonText'] = (options['confirmButtonText'] || 'Yes, continue');
            options['position'] = (options['position'] || 'center');
            options['toast'] = false;
            options['timer'] = undefined;
        }
        else {
            options = {
                icon: 'warning',
                title: 'Please confirm your action',
                text: options,
                confirmButtonText: 'Yes, continue',
                position: 'center',
            };
        }
        options['showCancelButton'] = true;
        return sweetalert2_1.default.fire(options);
    }
    Prompt(options) {
        if ((0, is_object_1.IsObject)(options)) {
            options['icon'] = (options['icon'] || 'info');
            options['title'] = (options['title'] || 'Please enter details below');
            options['text'] = (options['text'] || options['message']);
            options['confirmButtonText'] = (options['confirmButtonText'] || 'Submit');
            options['position'] = (options['position'] || 'center');
            options['input'] = (options['input'] || options['type'] || 'text');
            options['toast'] = false;
            options['timer'] = undefined;
        }
        else {
            options = {
                icon: 'info',
                title: 'Please enter details below',
                text: options,
                confirmButtonText: 'Submit',
                position: 'center',
                input: 'text',
            };
        }
        return sweetalert2_1.default.fire(options);
    }
}
exports.SwalAlert = SwalAlert;
