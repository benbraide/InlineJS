import Swal from 'sweetalert2';
import { IsObject } from '../utilities/is-object';
export class SwalAlert {
    Notify(options) {
        if (IsObject(options)) {
            options['icon'] = (options['icon'] || (options['error'] ? 'error' : (options['type'] || options['code'] || 'success')));
            options['text'] = (options['text'] || options['message']);
            options['toast'] = (!!options['toast'] || !!options['asToast']);
            options['position'] = (options['position'] || (options['toast'] ? 'top-end' : 'center'));
            options['timer'] = (options['timer'] || ((typeof options['duration'] === 'number') ? options['duration'] : ((options['duration'] === false) ? undefined : 5000)));
        }
        return Swal.fire(options);
    }
    Confirm(options) {
        if (IsObject(options)) {
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
        return Swal.fire(options);
    }
    Prompt(options) {
        if (IsObject(options)) {
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
        return Swal.fire(options);
    }
}
