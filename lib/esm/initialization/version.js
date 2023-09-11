import { InitializeGlobalScope } from "../utilities/get-global-scope";
export function InitializeVersion() {
    InitializeGlobalScope('version', {
        major: 1,
        minor: 1,
        patch: 2,
        get value() {
            return `${this.major}.${this.minor}.${this.patch}`;
        },
        toString() {
            return this.value;
        },
    });
}
