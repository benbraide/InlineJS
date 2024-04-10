import { InitializeGlobalScope } from "../utilities/get-global-scope";
export function InitializeVersion() {
    InitializeGlobalScope('version', {
        major: 1,
        minor: 2,
        patch: 0,
        get value() {
            return `${this.major}.${this.minor}.${this.patch}`;
        },
        toString() {
            return this.value;
        },
    });
}
