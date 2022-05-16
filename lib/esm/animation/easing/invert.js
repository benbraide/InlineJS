import { CallAnimationEase } from "./call";
export function InvertAnimationEase(handler, params) {
    return (1 - CallAnimationEase(handler, params));
}
