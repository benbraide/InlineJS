import { InitializeGlobalScope } from "../utilities/get-global-scope";
/**
 * Initializes the version of the library in the global scope.
 */
export function InitializeVersion() {
    InitializeGlobalScope('version', {
        major: 1,
        minor: 4,
        patch: 3,
        get value() {
            return `${this.major}.${this.minor}.${this.patch}`;
        },
        toString() {
            return this.value;
        },
    });
}
